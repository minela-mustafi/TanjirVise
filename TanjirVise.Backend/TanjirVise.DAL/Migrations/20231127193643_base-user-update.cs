using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TanjirVise.DAL.Migrations
{
    /// <inheritdoc />
    public partial class baseuserupdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Creator",
                table: "Volunteers");

            migrationBuilder.DropColumn(
                name: "Creator",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Creator",
                table: "Restaurants");

            migrationBuilder.DropColumn(
                name: "Creator",
                table: "FoodRequests");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Creator",
                table: "Volunteers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Creator",
                table: "Users",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Creator",
                table: "Restaurants",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Creator",
                table: "FoodRequests",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
