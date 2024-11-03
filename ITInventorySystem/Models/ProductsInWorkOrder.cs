using System.ComponentModel.DataAnnotations.Schema;

namespace ITInventorySystem.Models
{
    public class ProductsInWorkOrder
    {
        [ForeignKey("Product")]
        public int ProductId { get; set; }

        [ForeignKey("WorkOrder")]
        public int WorkOrderId { get; set; }

        public Product Product { get; set; }

        public WorkOrder WorkOrder { get; set; }

        public int ProductQuantity { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime CreatedAt { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime? UpdatedAt { get; set; }
    }

}
