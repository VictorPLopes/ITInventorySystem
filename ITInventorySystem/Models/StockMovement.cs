using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ITInventorySystem.Models.Enums;

namespace ITInventorySystem.Models;

public class StockMovement
{
    public                                 int                Id           { get; set; }
    [Required]                      public int                ProductId    { get; set; }
    [Required]                      public Product            Product      { get; set; }
    [Required]                      public EStockMovementType MovementType { get; set; }
    [Required]                      public int                Quantity     { get; set; }
    [Required] [StringLength(1000)] public string             Description  { get; set; } //Motivo da movimentação

    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public DateTime CreatedAt { get; set; }
}