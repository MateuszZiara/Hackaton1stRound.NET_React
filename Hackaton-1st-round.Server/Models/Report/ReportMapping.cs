using FluentNHibernate.Mapping;

namespace Hackaton_1st_round.Server.Models.Report
{
    public class ReportMapping : ClassMap<Report>
    {
        readonly string tablename = nameof(Report);
        public ReportMapping()
        {
            Id(x => x.id).GeneratedBy.Guid();
            Map(x => x.Url);
            Map(x => x.TeamEntity_FK2);
            Map(x => x.accepted);
        
            Table(tablename);
        }
    }
}
