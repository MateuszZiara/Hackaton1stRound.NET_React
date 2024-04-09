using Hackaton_1st_round.Server.Models.TeamEntity;

namespace Hackaton_1st_round.Server.Persistance.TeamEntity
{
    public class TeamEntityRepository : ITeamEntityRepository
    {
        public Models.TeamEntity.TeamEntity Edit(Guid id, string? TeamName, string? TeamDesc)
        {
            using (var session = NHibernateHelper.OpenSession())
            {
                using (var transaction = session.BeginTransaction())
                {
                    var query = session.Query<Models.TeamEntity.TeamEntity>().Where(x => x.id == id).ToList();
                    if (query.Count == 0)
                    {
                        throw new Exception("No Team with such id");
                    }

                    if (TeamName != null)
                        query[0].TeamName = TeamName;
                    if (TeamDesc != null)
                        query[0].TeamDesc = TeamDesc;
                    session.SaveOrUpdate(query[0]);
                    transaction.Commit();
                    
                    return query[0];

                }
            }
        }
    }
}
