using ITInventorySystem.Data;
using ITInventorySystem.DTO.WorkOrder;
using ITInventorySystem.Models;
using ITInventorySystem.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ITInventorySystem.Repositories.Services;

public class WorkOrderService(AppDbContext context) : IWorkOrderInterface
{
    public async Task<WorkOrder> AddAsync(WorkOrderCreateDto workOrderDto)
    {
        try
        {
            // Inicializa a nova ordem de serviço
            var workOrder = new WorkOrder
            {
                StartDate = workOrderDto.StartDate,
                UserInChargeId = workOrderDto.UserInChargeId,
                ClientId = workOrderDto.ClientId,
                Description = workOrderDto.Description,
                WorkHours = workOrderDto.WorkHours
            };

            // Verifica a disponibilidade de produtos no estoque
            foreach (var productDto in workOrderDto.Products)
            {
                if (productDto.Quantity <= 0)
                    throw new
                        ArgumentException("Product with ID {productDto.ProductId} has an invalid quantity: {productDto.Quantity}. Quantity must be greater than zero.");

                var product = await context.Products.FindAsync(productDto.ProductId);
                if (product == null)
                    throw new KeyNotFoundException($"Product with ID {productDto.ProductId} not found.");

                if (product.Quantity < productDto.Quantity)
                    throw new
                        InvalidOperationException($"Insufficient stock for Product ID {productDto.ProductId}. Available: {product.Quantity}, Requested: {productDto.Quantity}");

                // Atualiza o estoque do produto
                product.Quantity -= productDto.Quantity;

                // Atualiza o produto no contexto
                context.Products.Update(product);

                // Adiciona o produto à ordem de serviço
                var productInWorkOrder = new ProductsInWorkOrder
                {
                    ProductId = productDto.ProductId,
                    ProductQuantity = productDto.Quantity
                };
                workOrder.ProductsInWorkOrder.Add(productInWorkOrder);
            }

            // Adiciona a ordem de serviço ao banco de dados
            context.WorkOrders.Add(workOrder);
            await context.SaveChangesAsync();

            return workOrder;
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message, ex);
        }
    }


    public async Task DeleteAsync(int id)
    {
        try
        {
            var workOrder = await context.WorkOrders.FindAsync(id);

            if (workOrder == null)
                throw new KeyNotFoundException($"WorkOrder with ID {id} not found.");

            context.WorkOrders.Remove(workOrder);
            context.SaveChanges();
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException("An error occurred while deleting the work order.", ex);
        }
    }

    public async Task<IEnumerable<WorkOrder>> GetAllAsync() =>
        await context.WorkOrders
                     .Include(w => w.Client)
                     .Include(w => w.UserInCharge)
                     .Include(w => w.ProductsInWorkOrder)
                     .ThenInclude(p => p.Product)
                     .ToListAsync();

    public async Task<WorkOrder> GetByIdAsync(int id)
    {
        var workOrder = await context.WorkOrders
                                     .Include(w => w.Client)
                                     .Include(w => w.UserInCharge)
                                     .Include(x => x.ProductsInWorkOrder)
                                     .ThenInclude(p => p.Product)
                                     .FirstOrDefaultAsync(w => w.Id == id);

        if (workOrder == null)
            throw new KeyNotFoundException($"WorkOrder with ID {id} not found.");

        return workOrder;
    }

    public async Task<WorkOrder> UpdateAsync(WorkOrderUpdateDto updateDto)
    {
        // Carrega a ordem de serviço existente
        var workOrder = await context.WorkOrders
                                     .Include(wo => wo.ProductsInWorkOrder)
                                     .FirstOrDefaultAsync(wo => wo.Id == updateDto.Id);

        if (workOrder == null)
            throw new KeyNotFoundException($"WorkOrder with ID {updateDto.Id} not found.");

        // Atualiza os campos básicos
        workOrder.StartDate = updateDto.StartDate;
        workOrder.UserInChargeId = updateDto.UserInChargeId;
        workOrder.ClientId = updateDto.ClientId;
        workOrder.Description = updateDto.Description;
        workOrder.WorkHours = updateDto.WorkHours;
        workOrder.Status = updateDto.NewStatus;
        workOrder.UpdatedAt = DateTime.Now;

        // Atualiza a lista de produtos associados
        var existingProducts = workOrder.ProductsInWorkOrder.ToList();

        // Processa os produtos do DTO
        foreach (var productDto in updateDto.Products)
        {
            if (productDto.Quantity <= 0)
                throw new
                    ArgumentException($"Product with ID {productDto.ProductId} has an invalid quantity: {productDto.Quantity}. Quantity must be greater than zero.");

            //Busca o produto no banco de dados, se não encontra lança uma exceção
            var product = await context.Products.FindAsync(productDto.ProductId);
            if (product == null)
                throw new KeyNotFoundException($"Product with ID {productDto.ProductId} not found.");

            //Verifica agora se o produto já existe naquela ordem de serviço ou não
            var existingProduct = existingProducts.FirstOrDefault(p => p.ProductId == productDto.ProductId);

            //Se já existe
            if (existingProduct != null)
            {
                // Produto já existe na ordem: Atualiza a quantidade
                if (productDto.Quantity > existingProduct.ProductQuantity)
                {
                    // Reduz o estoque apenas se a quantidade aumentou
                    var additionalQuantity = productDto.Quantity - existingProduct.ProductQuantity;
                    if (product.Quantity < additionalQuantity)
                        throw new
                            InvalidOperationException($"Insufficient stock for Product ID {productDto.ProductId}. Available: {product.Quantity}, Requested Additional: {additionalQuantity}");

                    product.Quantity -= additionalQuantity;
                }
                else
                {
                    // Devolve o estoque se a quantidade foi reduzida
                    var quantityToReturn = existingProduct.ProductQuantity - productDto.Quantity;
                    product.Quantity += quantityToReturn;
                }

                existingProduct.ProductQuantity = productDto.Quantity;
            }
            else
            {
                // Novo produto na ordem
                if (product.Quantity < productDto.Quantity)
                    throw new
                        InvalidOperationException($"Insufficient stock for Product ID {productDto.ProductId}. Available: {product.Quantity}, Requested: {productDto.Quantity}");

                product.Quantity -= productDto.Quantity;

                var newProductInWorkOrder = new ProductsInWorkOrder
                {
                    ProductId = productDto.ProductId,
                    ProductQuantity = productDto.Quantity
                };

                context.ProductsInWorkOrder.Add(newProductInWorkOrder);
            }
        }

        // Remove produtos que não estão mais na lista de produtos do DTO
        var productIdsToRemove = existingProducts
                                 .Where(ep => updateDto.Products.All(dto => dto.ProductId != ep.ProductId))
                                 .ToList();

        foreach (var productToRemove in productIdsToRemove)
        {
            var product = await context.Products.FindAsync(productToRemove.ProductId);
            if (product != null)
                // Devolve o estoque
                product.Quantity += productToRemove.ProductQuantity;
            context.ProductsInWorkOrder.Remove(productToRemove);
        }

        // Salva alterações no banco
        await context.SaveChangesAsync();
        return workOrder;
    }
}