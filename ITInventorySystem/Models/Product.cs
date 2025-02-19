﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ITInventorySystem.Models;

public class Product
{
    public int Id { get; set; }

    [Required] [StringLength(100)] public string Name { get; set; }

    public int Quantity { get; set; }

    [StringLength(500)] public string? Description { get; set; }

    [StringLength(100)] public string? Category { get; set; }

    [Column(TypeName = "decimal(18,2)")] public decimal CostPrice { get; set; }

    [Column(TypeName = "decimal(18,2)")] public decimal SalePrice { get; set; }

    [StringLength(100)] public string? BrandManufacturerName { get; set; }

    [JsonIgnore]
    public ICollection<ProductsInWorkOrder> ProductsInWorkOrder { get; set; } =
        new List<ProductsInWorkOrder>(); // Um produto pode estar em várias ordens de serviço

    public bool IsDeleted { get; set; }

    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}