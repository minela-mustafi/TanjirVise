using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TanjirVise.DAL.Migrations
{
    /// <inheritdoc />
    public partial class foodrequestpropertyremoved : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OnTheWay",
                table: "FoodRequests");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "OnTheWay",
                table: "FoodRequests",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
