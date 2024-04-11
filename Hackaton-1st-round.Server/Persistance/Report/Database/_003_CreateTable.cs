using FluentMigrator;

namespace Hackaton_1st_round.Server.Models.Report.Database
{
    [Migration(003)]
    public class _003_CreateTable : Migration
    {
        readonly string tableName = nameof(Models.Report.Report);

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
                    .WithColumn(nameof(Report.id)).AsGuid().NotNullable().PrimaryKey()
                    .WithColumn(nameof(Report.Base64)).AsString(Int32.MaxValue).NotNullable()
                    .WithColumn(nameof(Report.accepted)).AsBoolean().NotNullable()
                    .WithColumn("TeamEntity_FK2").AsGuid().NotNullable();
                ;
                Create.ForeignKey("TeamEntity_FK2").FromTable("Report").ForeignColumn("TeamEntity_FK2").ToTable("TeamEntity").PrimaryColumn("id");
            }
        }
    }
}
