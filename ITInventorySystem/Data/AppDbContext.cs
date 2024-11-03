using ITInventorySystem.Models;
using Microsoft.EntityFrameworkCore;
namespace ITInventorySystem.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> option)
            : base(option) { }


        public DbSet<User> Users { get; set; }
        public DbSet<Client> Clients { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<WorkOrder> WorkOrders { get; set; }
        public DbSet<ProductsInWorkOrder> ProductsInWorkOrder { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ProductsInWorkOrder>()
                .HasKey(pw => new { pw.ProductId, pw.WorkOrderId }); //Define chave composta

            modelBuilder.Entity<ProductsInWorkOrder>()
                .HasOne(pw => pw.Product)
                .WithMany(p => p.ProductsInWorkOrder)
                .HasForeignKey(pw => pw.ProductId);

            modelBuilder.Entity<ProductsInWorkOrder>()
                .HasOne(pw => pw.WorkOrder)
                .WithMany(w => w.ProductsInWorkOrder)
                .HasForeignKey(pw => pw.WorkOrderId);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique(); // Define o índice único para o campo Email

            modelBuilder.Entity<Product>()
                .Property(p => p.CostPrice)
                .HasColumnType("decimal(18, 2)");

            modelBuilder.Entity<Product>()
                .Property(p => p.SalePrice)
                .HasColumnType("decimal(18, 2)");

            modelBuilder.Entity<WorkOrder>()
                .Property(w => w.WorkHours)
                .HasColumnType("decimal(18, 2)");

            base.OnModelCreating(modelBuilder);
        }

    }
}
