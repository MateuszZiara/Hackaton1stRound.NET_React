using FluentMigrator;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace Hackaton_1st_round.Server.Models.Payment.Database
{
    [Migration(006)]
    public class _006_CreateTable : Migration
    {
        readonly string tableName = nameof(Models.Payment.Payment);

        public override void Down()
        {
            if (Schema.Table(tableName).Exists())
            {
                Delete.Table(tableName);
            };
        }

        public override void Up()
        {
            if (!Schema.Table(tableName).Exists())
            {
                Create.Table(tableName)
                    .WithColumn(nameof(Payment.id)).AsGuid().NotNullable().PrimaryKey()
                    .WithColumn(nameof(Payment.Price)).AsDouble().NotNullable()
                    .WithColumn(nameof(Payment.Description)).AsString().NotNullable()
                    .WithColumn(nameof(Payment.Name)).AsString().NotNullable()
                    .WithColumn(nameof(Payment.TransactionDate)).AsDateTime().NotNullable()
                    .WithColumn(nameof(Payment.IsApproved)).AsBoolean().NotNullable()
                    .WithColumn(nameof(Payment.TypeOfPayment)).AsInt32().NotNullable()
                    .WithColumn(nameof(Payment.TeamId)).AsGuid().NotNullable()
                    .WithColumn(nameof(Payment.UserId)).AsString().NotNullable()

                    //.WithColumn("TeamEntity_FK2").AsGuid().NotNullable();
                ;
                Create.ForeignKey("PaymentEntity_FK1").FromTable("Payment").ForeignColumn("TeamId").ToTable("TeamEntity").PrimaryColumn("id");
                Create.ForeignKey("PaymentEntity_FK2").FromTable("Payment").ForeignColumn("UserId").ToTable("AspNetUsers").PrimaryColumn("id");
            }
        }
    }
}
