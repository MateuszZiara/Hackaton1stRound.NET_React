namespace Hackaton_1st_round.Server.Persistance.AspNetUsers.Database;
using FluentMigrator;
[Migration(002)]
public class _002_CreateTable : Migration
{
    public override void Up()
    {
        Create.Table("AspNetUsers")
            .WithColumn("Id").AsString().NotNullable().PrimaryKey()
            .WithColumn("UserName").AsString().Nullable()
            .WithColumn("NormalizedUserName").AsString().Nullable()
            .WithColumn("Email").AsString().Nullable()
            .WithColumn("NormalizedEmail").AsString().Nullable()
            .WithColumn("EmailConfirmed").AsBoolean().Nullable()
            .WithColumn("PasswordHash").AsString().Nullable()
            .WithColumn("SecurityStamp").AsString().Nullable()
            .WithColumn("ConcurrencyStamp").AsString().Nullable()
            .WithColumn("PhoneNumber").AsString().Nullable().Nullable()
            .WithColumn("PhoneNumberConfirmed").AsBoolean().Nullable()
            .WithColumn("TwoFactorEnabled").AsBoolean().Nullable()
            .WithColumn("LockoutEnd").AsDateTimeOffset().Nullable()
            .WithColumn("LockoutEnabled").AsBoolean().Nullable()
            .WithColumn("AccessFailedCount").AsInt32().Nullable()
            .WithColumn(nameof(Models.AspNetUsers.AspNetUsers.FirstName)).AsString().NotNullable()
            .WithColumn(nameof(Models.AspNetUsers.AspNetUsers.LastName)).AsString().NotNullable()
            .WithColumn(nameof(Models.AspNetUsers.AspNetUsers.UserRank)).AsInt32().NotNullable()
            .WithColumn("TeamEntity_FK").AsGuid().Nullable();
            Create.ForeignKey("TeamEntity_FK").FromTable("AspNetUsers").ForeignColumn("TeamEntity_FK").ToTable("TeamEntity").PrimaryColumn("id");

    }
    public override void Down()
    {
        if (Schema.Table("AspNetUsers").Exists())
        {
            Delete.Table("AspNetUsers");
        }
    }
}