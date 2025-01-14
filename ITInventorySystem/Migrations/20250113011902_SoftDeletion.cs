using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ITInventorySystem.Migrations
{
    /// <inheritdoc />
    public partial class SoftDeletion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProductsInWorkOrder_Products_ProductId",
                table: "ProductsInWorkOrder");

            migrationBuilder.DropForeignKey(
                name: "FK_WorkOrders_Clients_ClientId",
                table: "WorkOrders");

            migrationBuilder.DropForeignKey(
                name: "FK_WorkOrders_Users_UserInChargeId",
                table: "WorkOrders");

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Users",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Clients",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddForeignKey(
                name: "FK_ProductsInWorkOrder_Products_ProductId",
                table: "ProductsInWorkOrder",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_WorkOrders_Clients_ClientId",
                table: "WorkOrders",
                column: "ClientId",
                principalTable: "Clients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_WorkOrders_Users_UserInChargeId",
                table: "WorkOrders",
                column: "UserInChargeId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProductsInWorkOrder_Products_ProductId",
                table: "ProductsInWorkOrder");

            migrationBuilder.DropForeignKey(
                name: "FK_WorkOrders_Clients_ClientId",
                table: "WorkOrders");

            migrationBuilder.DropForeignKey(
                name: "FK_WorkOrders_Users_UserInChargeId",
                table: "WorkOrders");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Clients");

            migrationBuilder.AddForeignKey(
                name: "FK_ProductsInWorkOrder_Products_ProductId",
                table: "ProductsInWorkOrder",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_WorkOrders_Clients_ClientId",
                table: "WorkOrders",
                column: "ClientId",
                principalTable: "Clients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_WorkOrders_Users_UserInChargeId",
                table: "WorkOrders",
                column: "UserInChargeId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
