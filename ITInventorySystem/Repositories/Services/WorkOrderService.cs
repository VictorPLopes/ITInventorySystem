using ITInventorySystem.Data;
using ITInventorySystem.DTO.WorkOrder;
using ITInventorySystem.Models;
using ITInventorySystem.Models.Enums;
using ITInventorySystem.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ITInventorySystem.Repositories.Services;

public class WorkOrderService(AppDbContext context) : IWorkOrderInterface
{
    public async Task<WorkOrder> AddAsync(WorkOrderCreateDto workOrderDto)
    {
        await using var transaction = await context.Database.BeginTransactionAsync();
        try
        {
            // Inicializa a nova ordem de serviço
            var workOrder = new WorkOrder
            {
                StartDate      = workOrderDto.StartDate,
                UserInChargeId = workOrderDto.UserInChargeId,
                ClientId       = workOrderDto.ClientId,
                Description    = workOrderDto.Description,
                WorkHours      = workOrderDto.WorkHours
            };

            // Verifica a disponibilidade de produtos no estoque
            foreach (var productDto in workOrderDto.Products)
            {
                if (productDto.Quantity <= 0)
                    throw new
                        ArgumentException("Product with ID {productDto.ProductId} has an invalid quantity: {productDto.Quantity}. Quantity must be greater than zero.");

                var product = await context.Products.FindAsync(productDto.ProductId);
                if (product == null || product.IsDeleted)
                    throw new
                        KeyNotFoundException($"Product with ID {productDto.ProductId} not found or is no longer available.");
                if (product.Quantity < productDto.Quantity)
                    throw new
                        InvalidOperationException($"Insufficient stock for Product ID {productDto.ProductId}. Available: {product.Quantity}, Requested: {productDto.Quantity}");

                // Atualiza o estoque do produto
                product.Quantity -= productDto.Quantity;

                // Atualiza o produto no contexto
                context.Products.Update(product);

                await RegisterStockMovementAsync(product.Id, productDto.Quantity, EStockMovementType.Exit,
                                                 "Usado na criação de O.S.");


                // Adiciona o produto à ordem de serviço
                var productInWorkOrder = new ProductsInWorkOrder
                {
                    ProductId = productDto.ProductId,
                    Quantity  = productDto.Quantity
                };
                workOrder.Products.Add(productInWorkOrder);
            }

            // Adiciona a ordem de serviço ao banco de dados
            context.WorkOrders.Add(workOrder);
            await context.SaveChangesAsync();
            await transaction.CommitAsync();

            return workOrder;
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            throw new Exception(ex.Message, ex);
        }
    }


    public async Task DeleteAsync(int id)
    {
        await using var transaction = await context.Database.BeginTransactionAsync();
        try
        {
            var workOrder = await context.WorkOrders
                                         .Include(w => w.Products)
                                         .FirstOrDefaultAsync(wo => wo.Id == id);

            if (workOrder == null)
                throw new KeyNotFoundException($"WorkOrder with ID {id} not found.");

            foreach (var productInWorkOrder in workOrder.Products)
            {
                var p = await context.Products.FindAsync(productInWorkOrder.ProductId);
                if (p != null && !p.IsDeleted)
                {
                    p.Quantity += productInWorkOrder.Quantity;
                    await RegisterStockMovementAsync(p.Id, productInWorkOrder.Quantity, EStockMovementType.Entry,
                                                     "Restocked from Work Order deletion.");

                    context.Products.Update(p); // Atualiza o produto no context
                }
            }

            context.WorkOrders.Remove(workOrder);
            await context.SaveChangesAsync();
            await transaction.CommitAsync();
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            throw new InvalidOperationException($"An error occurred while deleting the work order. {ex.Message}");
        }
    }

    public async Task<IEnumerable<WorkOrder>> GetAllAsync() =>
        await context.WorkOrders
                     .Include(w => w.Client)
                     .Include(w => w.UserInCharge)
                     .Include(w => w.Products)
                     .ThenInclude(p => p.Product)
                     .ToListAsync();

    public async Task<IEnumerable<WorkOrder>> GetByClientIdAsync(int clientId) =>
        await context.WorkOrders
                     .Include(w => w.Client)
                     .Include(w => w.UserInCharge)
                     .Include(w => w.Products)
                     .ThenInclude(p => p.Product)
                     .Where(w => w.ClientId == clientId)
                     .ToListAsync();

    public async Task<WorkOrder> GetByIdAsync(int id)
    {
        var workOrder = await context.WorkOrders
                                     .Include(w => w.Client)
                                     .Include(w => w.UserInCharge)
                                     .Include(x => x.Products)
                                     .ThenInclude(p => p.Product)
                                     .FirstOrDefaultAsync(w => w.Id == id);

        if (workOrder == null)
            throw new KeyNotFoundException($"WorkOrder with ID {id} not found.");

        return workOrder;
    }


    public async Task<WorkOrder> UpdateAsync(int id, WorkOrderUpdateDto updateDto)
    {
        await using var transaction = await context.Database.BeginTransactionAsync();
        try
        {
            // Carrega a ordem de serviço existente
            var workOrder = await context.WorkOrders
                                         .Include(wo => wo.Products)
                                         .FirstOrDefaultAsync(wo => wo.Id == id);

            if (workOrder == null)
                throw new KeyNotFoundException($"WorkOrder with ID {id} not found.");

            // Atualiza os campos básicos
            workOrder.StartDate      = updateDto.StartDate;
            workOrder.UserInChargeId = updateDto.UserInChargeId;
            workOrder.ClientId       = updateDto.ClientId;
            workOrder.Description    = updateDto.Description;
            workOrder.WorkHours      = updateDto.WorkHours;
            workOrder.Status         = updateDto.Status;
            workOrder.UpdatedAt      = DateTime.Now;

            // Atualiza a lista de produtos associados
            var existingProducts = workOrder.Products.ToList();

            // Processa os produtos do DTO
            foreach (var productDto in updateDto.Products)
            {
                if (productDto.Quantity <= 0)
                    throw new
                        ArgumentException(
                                          $"Product with ID {productDto.ProductId} has an invalid quantity: {productDto.Quantity}. Quantity must be greater than zero.");

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
                    if (productDto.Quantity > existingProduct.Quantity &&
                        productDto.Quantity != existingProduct.Quantity)
                    {
                        // Reduz o estoque apenas se a quantidade aumentou
                        var additionalQuantity = productDto.Quantity - existingProduct.Quantity;
                        if (product.Quantity < additionalQuantity)
                            throw new
                                InvalidOperationException(
                                                          $"Insufficient stock for Product ID {productDto.ProductId}. Available: {product.Quantity}, Requested Additional: {additionalQuantity}");

                        product.Quantity -= additionalQuantity;
                        await RegisterStockMovementAsync(product.Id, additionalQuantity, EStockMovementType.Exit,
                                                         "Utilizado em correção de ordem de serviço.");
                    }
                    else if (productDto.Quantity < existingProduct.Quantity)
                    {
                        // Devolve o estoque se a quantidade foi reduzida
                        var quantityToReturn = existingProduct.Quantity - productDto.Quantity;
                        product.Quantity += quantityToReturn;
                        await RegisterStockMovementAsync(product.Id, quantityToReturn, EStockMovementType.Entry,
                                                         "Devolvido através de correção de ordem de serviço.");
                    }

                    existingProduct.Quantity = productDto.Quantity;
                }
                else
                {
                    // Novo produto na ordem
                    if (product.Quantity < productDto.Quantity)
                        throw new
                            InvalidOperationException(
                                                      $"Insufficient stock for Product ID {productDto.ProductId}. Available: {product.Quantity}, Requested: {productDto.Quantity}");

                    product.Quantity -= productDto.Quantity;
                    await RegisterStockMovementAsync(product.Id, productDto.Quantity, EStockMovementType.Exit,
                                                     "Utilizado em correção de ordem de serviço.");

                    var newProductInWorkOrder = new ProductsInWorkOrder
                    {
                        ProductId   = productDto.ProductId,
                        Quantity    = productDto.Quantity,
                        WorkOrderId = workOrder.Id
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
                {
                    // Devolve o estoque e registra a movimentação
                    product.Quantity += productToRemove.Quantity;
                    await RegisterStockMovementAsync(product.Id, productToRemove.Quantity, EStockMovementType.Entry,
                                                     "Devolvido através de correção de ordem de serviço.");
                }

                context.ProductsInWorkOrder.Remove(productToRemove);
            }

            await context.SaveChangesAsync();
            await transaction.CommitAsync();

            return workOrder;
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task RegisterStockMovementAsync(int    productId, int quantity, EStockMovementType movementType,
                                                 string description)
    {
        var stockMovement = new StockMovement
        {
            ProductId    = productId,
            Quantity     = quantity,
            MovementType = movementType,
            Description  = description,
            CreatedAt    = DateTime.Now
        };

        context.StockMovements.Add(stockMovement);
        await context.SaveChangesAsync();
    }
}