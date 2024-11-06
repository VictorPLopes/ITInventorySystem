using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ITInventorySystem.Models;

public class Client
{
    public int Id { get; set; }

    [Required] [StringLength(14)]
    public string IdDoc { get; set; } // CPF/CNPJ

    [Required] [StringLength(100)]
    public string Name { get; set; }

    [Required] [EmailAddress]
    public string Email { get; set; }

    [StringLength(200)]
    public string Street { get; set; }

    [StringLength(100)]
    public string City { get; set; }

    [StringLength(50)]
    public string State { get; set; }

    [StringLength(10)]
    public string PostalCode { get; set; }

    [Phone]
    public string PhoneNumber { get; set; }

    public ICollection<WorkOrder> WorkOrders { get; set; } // Um cliente pode ter várias ordens de serviço

    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}