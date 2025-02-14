using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TanjirVise.DAL.Migrations
{
    /// <inheritdoc />
    public partial class foodrequestvandrnull : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FoodRequests_Restaurants_RestaurantId",
                table: "FoodRequests");

            migrationBuilder.DropForeignKey(
                name: "FK_FoodRequests_Volunteers_VolunteerId",
                table: "FoodRequests");

            migrationBuilder.AlterColumn<int>(
                name: "VolunteerId",
                table: "FoodRequests",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "RestaurantId",
                table: "FoodRequests",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_FoodRequests_Restaurants_RestaurantId",
                table: "FoodRequests",
                column: "RestaurantId",
                principalTable: "Restaurants",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_FoodRequests_Volunteers_VolunteerId",
                table: "FoodRequests",
                column: "VolunteerId",
                principalTable: "Volunteers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FoodRequests_Restaurants_RestaurantId",
                table: "FoodRequests");

            migrationBuilder.DropForeignKey(
                name: "FK_FoodRequests_Volunteers_VolunteerId",
                table: "FoodRequests");

            migrationBuilder.AlterColumn<int>(
                name: "VolunteerId",
                table: "FoodRequests",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "RestaurantId",
                table: "FoodRequests",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_FoodRequests_Restaurants_RestaurantId",
                table: "FoodRequests",
                column: "RestaurantId",
                principalTable: "Restaurants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FoodRequests_Volunteers_VolunteerId",
                table: "FoodRequests",
                column: "VolunteerId",
                principalTable: "Volunteers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
