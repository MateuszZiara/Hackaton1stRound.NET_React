using FluentMigrator;

namespace Hackaton_1st_round.Server.Persistance.AspNetUsers.Database;

[Migration(005)] // Unique identifier for the migration
public class CreateUserClaimsTable : Migration
{
    public override void Up()
    {
        Create.Table("AspNetUserClaims")
            .WithColumn("Id").AsInt32().PrimaryKey().Identity()
            .WithColumn("UserId").AsString(128).NotNullable()
            .WithColumn("ClaimType").AsString(256).NotNullable()
            .WithColumn("ClaimValue").AsString(256).NotNullable();

        // Add any additional columns here if needed
    }

    public override void Down()
    {
        Delete.Table("AspNetUserClaims");
    }
}