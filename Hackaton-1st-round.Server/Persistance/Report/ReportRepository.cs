using Hackaton_1st_round.Server.Models.Report;

namespace Hackaton_1st_round.Server.Persistance.Report
{
    public class ReportRepository : IReportRepository
    {
        public Models.Report.Report Edit(Guid id, string? Url, Guid? TeamEntity_FK2)
        {
            using (var session = NHibernateHelper.OpenSession())
            {
                using (var transaction = session.BeginTransaction())
                {
                    var query = session.Query<Models.Report.Report>().Where(x => x.id == id).ToList();
                    if (query.Count == 0)
                    {
                        throw new Exception("No Report with such id");
                    }
                    if(Url != null)
                    {
                        query[0].Url = Url;
                    }
                    if(TeamEntity_FK2 != null)
                    {
                        query[0].TeamEntity_FK2 = TeamEntity_FK2;
                    }

                    session.SaveOrUpdate(query[0]);
                    transaction.Commit();
                    return query[0];
                }
            }
        }
    }
}
