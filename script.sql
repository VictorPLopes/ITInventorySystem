IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
GO

CREATE TABLE [Clients] (
    [Id] int NOT NULL IDENTITY,
    [IdDoc] nvarchar(14) NOT NULL,
    [Name] nvarchar(100) NOT NULL,
    [Email] nvarchar(450) NOT NULL,
    [Street] nvarchar(200) NOT NULL,
    [City] nvarchar(100) NOT NULL,
    [State] nvarchar(50) NOT NULL,
    [PostalCode] nvarchar(10) NOT NULL,
    [PhoneNumber] nvarchar(max) NOT NULL,
    [CreatedAt] datetime2 NOT NULL DEFAULT (GETDATE()),
    [UpdatedAt] datetime2 NULL,
    CONSTRAINT [PK_Clients] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [Products] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(100) NOT NULL,
    [Quantity] int NOT NULL,
    [Description] nvarchar(500) NULL,
    [Category] nvarchar(100) NULL,
    [CostPrice] decimal(18,2) NOT NULL,
    [SalePrice] decimal(18,2) NOT NULL,
    [BrandManufacturerName] nvarchar(100) NULL,
    [CreatedAt] datetime2 NOT NULL DEFAULT (GETDATE()),
    [UpdatedAt] datetime2 NULL,
    CONSTRAINT [PK_Products] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [Users] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(100) NOT NULL,
    [Email] nvarchar(100) NOT NULL,
    [PasswordHash] varbinary(max) NOT NULL,
    [PasswordSalt] varbinary(max) NOT NULL,
    [Token] nvarchar(max) NOT NULL,
    [Type] int NOT NULL,
    [Status] bit NOT NULL,
    [CreatedAt] datetime2 NOT NULL DEFAULT (GETDATE()),
    [UpdatedAt] datetime2 NULL,
    CONSTRAINT [PK_Users] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [WorkOrders] (
    [Id] int NOT NULL IDENTITY,
    [StartDate] datetime2 NOT NULL,
    [UserInChargeId] int NOT NULL,
    [ClientId] int NOT NULL,
    [Description] nvarchar(1000) NULL,
    [WorkHours] decimal(18,2) NOT NULL,
    [Status] int NOT NULL,
    [CreatedAt] datetime2 NOT NULL DEFAULT (GETDATE()),
    [UpdatedAt] datetime2 NULL,
    CONSTRAINT [PK_WorkOrders] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_WorkOrders_Clients_ClientId] FOREIGN KEY ([ClientId]) REFERENCES [Clients] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_WorkOrders_Users_UserInChargeId] FOREIGN KEY ([UserInChargeId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [ProductsInWorkOrder] (
    [ProductId] int NOT NULL,
    [WorkOrderId] int NOT NULL,
    [Quantity] int NOT NULL,
    [CreatedAt] datetime2 NOT NULL DEFAULT (GETDATE()),
    [UpdatedAt] datetime2 NULL,
    CONSTRAINT [PK_ProductsInWorkOrder] PRIMARY KEY ([ProductId], [WorkOrderId]),
    CONSTRAINT [FK_ProductsInWorkOrder_Products_ProductId] FOREIGN KEY ([ProductId]) REFERENCES [Products] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_ProductsInWorkOrder_WorkOrders_WorkOrderId] FOREIGN KEY ([WorkOrderId]) REFERENCES [WorkOrders] ([Id]) ON DELETE CASCADE
);
GO

CREATE UNIQUE INDEX [IX_Clients_Email] ON [Clients] ([Email]);
GO

CREATE UNIQUE INDEX [IX_Clients_IdDoc] ON [Clients] ([IdDoc]);
GO

CREATE INDEX [IX_ProductsInWorkOrder_WorkOrderId] ON [ProductsInWorkOrder] ([WorkOrderId]);
GO

CREATE UNIQUE INDEX [IX_Users_Email] ON [Users] ([Email]);
GO

CREATE INDEX [IX_WorkOrders_ClientId] ON [WorkOrders] ([ClientId]);
GO

CREATE INDEX [IX_WorkOrders_UserInChargeId] ON [WorkOrders] ([UserInChargeId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241208200336_Initial', N'8.0.10');
GO

COMMIT;
GO

