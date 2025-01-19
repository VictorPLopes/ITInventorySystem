using System.ComponentModel.DataAnnotations;
using ITInventorySystem.Models.Enums;

namespace ITInventorySystem.DTO.StockMovement;

public class CreateStockMovementDTO
{
    [Required] public int ProductId { get; set; }

    [Required] public int Quantity { get; set; }

    [Required] public EStockMovementType MovementType { get; set; }

    [Required]
    [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters.")]
    public string Description { get; set; }
}