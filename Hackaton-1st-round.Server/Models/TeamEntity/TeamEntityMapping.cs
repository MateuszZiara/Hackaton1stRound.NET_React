using FluentNHibernate.Mapping;

namespace Hackaton_1st_round.Server.Models.TeamEntity
{
    public class TeamEntityMapping : ClassMap<TeamEntity>
    {
        readonly string tablename = nameof(TeamEntity);
        public TeamEntityMapping() 
        {
            Id(x => x.id).GeneratedBy.Guid();
            Map(x => x.TeamName);
            Map(x => x.TeamDesc);

            Table(tablename);
        }  
    }
}
