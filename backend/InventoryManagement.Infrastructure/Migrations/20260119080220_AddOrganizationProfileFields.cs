using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InventoryManagement.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddOrganizationProfileFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Add new organization profile columns to the existing profiles table
            migrationBuilder.AddColumn<string>(
                name: "description",
                table: "profiles",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "contact_email",
                table: "profiles",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "phone",
                table: "profiles",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "address",
                table: "profiles",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "website",
                table: "profiles",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "industry",
                table: "profiles",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "logo_url",
                table: "profiles",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "linkedin_url",
                table: "profiles",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "twitter_url",
                table: "profiles",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "facebook_url",
                table: "profiles",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "business_hours",
                table: "profiles",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "company_size",
                table: "profiles",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "description", table: "profiles");
            migrationBuilder.DropColumn(name: "contact_email", table: "profiles");
            migrationBuilder.DropColumn(name: "phone", table: "profiles");
            migrationBuilder.DropColumn(name: "address", table: "profiles");
            migrationBuilder.DropColumn(name: "website", table: "profiles");
            migrationBuilder.DropColumn(name: "industry", table: "profiles");
            migrationBuilder.DropColumn(name: "logo_url", table: "profiles");
            migrationBuilder.DropColumn(name: "linkedin_url", table: "profiles");
            migrationBuilder.DropColumn(name: "twitter_url", table: "profiles");
            migrationBuilder.DropColumn(name: "facebook_url", table: "profiles");
            migrationBuilder.DropColumn(name: "business_hours", table: "profiles");
            migrationBuilder.DropColumn(name: "company_size", table: "profiles");
        }
    }
}
