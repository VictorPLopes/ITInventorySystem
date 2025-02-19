﻿using ITInventorySystem.Models;
using Microsoft.EntityFrameworkCore;

namespace ITInventorySystem.Data;

public class AppDbContext(DbContextOptions<AppDbContext> option) : DbContext(option)
{
    public DbSet<User>                Users               { get; set; }
    public DbSet<Client>              Clients             { get; set; }
    public DbSet<Product>             Products            { get; set; }
    public DbSet<WorkOrder>           WorkOrders          { get; set; }
    public DbSet<ProductsInWorkOrder> ProductsInWorkOrder { get; set; }
    public DbSet<StockMovement>       StockMovements      { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configuração da tabela de junção Products
        modelBuilder.Entity<ProductsInWorkOrder>()
                    .HasKey(pw => new { pw.ProductId, pw.WorkOrderId }); // Define chave composta

        modelBuilder.Entity<ProductsInWorkOrder>()
                    .HasOne(pw => pw.Product)
                    .WithMany(p => p.ProductsInWorkOrder)
                    .HasForeignKey(pw => pw.ProductId)
                    .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<ProductsInWorkOrder>()
                    .HasOne(pw => pw.WorkOrder)
                    .WithMany(w => w.Products)
                    .HasForeignKey(pw => pw.WorkOrderId);

        modelBuilder.Entity<Client>()
                    .HasIndex(c => c.Email)
                    .IsUnique(); // Define o índice único para o campo Email

        modelBuilder.Entity<Client>()
                    .HasIndex(c => c.IdDoc)
                    .IsUnique(); // Define o índice único para o campo IdDoc (CPF/CNPJ)

        modelBuilder.Entity<Client>()
                    .HasMany(c => c.WorkOrders)
                    .WithOne(w => w.Client)
                    .HasForeignKey(w => w.ClientId)
                    .OnDelete(DeleteBehavior.Restrict); // Define a relação de um para muitos entre Client e WorkOrder

        modelBuilder.Entity<User>()
                    .HasIndex(u => u.Email)
                    .IsUnique(); // Define o índice único para o campo Email

        modelBuilder.Entity<User>()
                    .HasMany(u => u.WorkOrders)
                    .WithOne(w => w.UserInCharge)
                    .HasForeignKey(w => w.UserInChargeId)
                    .OnDelete(DeleteBehavior.Restrict); // Define a relação de um para muitos entre User e WorkOrder


        modelBuilder.Entity<Product>()
                    .Property(p => p.CostPrice)
                    .HasColumnType("decimal(18, 2)"); // Define o tipo de dado para o campo CostPrice

        modelBuilder.Entity<Product>()
                    .Property(p => p.SalePrice)
                    .HasColumnType("decimal(18, 2)"); // Define o tipo de dado para o campo SalePrice

        modelBuilder.Entity<WorkOrder>()
                    .Property(w => w.WorkHours)
                    .HasColumnType("decimal(18, 2)"); // Define o tipo de dado para o campo WorkHours

        modelBuilder.Entity<Product>()
                    .Property(p => p.CreatedAt)
                    .HasDefaultValueSql("GETDATE()");

        modelBuilder.Entity<User>()
                    .Property(p => p.CreatedAt)
                    .HasDefaultValueSql("GETDATE()");

        modelBuilder.Entity<WorkOrder>()
                    .Property(p => p.CreatedAt)
                    .HasDefaultValueSql("GETDATE()");

        modelBuilder.Entity<Client>()
                    .Property(p => p.CreatedAt)
                    .HasDefaultValueSql("GETDATE()");

        modelBuilder.Entity<ProductsInWorkOrder>()
                    .Property(p => p.CreatedAt)
                    .HasDefaultValueSql("GETDATE()");

        base.OnModelCreating(modelBuilder);
    }
}