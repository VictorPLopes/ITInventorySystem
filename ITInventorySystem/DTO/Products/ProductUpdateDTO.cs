namespace ITInventorySystem.DTO.Products;

public class ProductUpdateDto
{
    public int Id { get; set; }

    public string Name { get; set; }

    public int Quantity { get; set; }

    public string? Description { get; set; }

    public string? Category { get; set; }

    public decimal CostPrice { get; set; }

    public decimal SalePrice { get; set; }

    public string? BrandManufacturerName { get; set; }
}