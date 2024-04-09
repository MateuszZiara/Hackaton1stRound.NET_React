using FluentMigrator;

namespace Hackaton_1st_round.Server.Models.TeamEntity.Database
{
    [Migration(001)]
    public class _001_CreateTable : Migration
    {
        readonly string tableName = nameof(Models.TeamEntity.TeamEntity);

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
                    .WithColumn(nameof(TeamEntity.id)).AsGuid().NotNullable().PrimaryKey()
                    .WithColumn(nameof(TeamEntity.TeamName)).AsString().NotNullable()
                    .WithColumn(nameof(TeamEntity.TeamDesc)).AsDouble().NotNullable()
                ;
            }
        }
    }
}
