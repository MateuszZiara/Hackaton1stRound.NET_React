using Hackaton_1st_round.Server.Models.Report;

namespace Hackaton_1st_round.Server.Persistance.Report
{

    public class ReportService : IReportService
    {
        private ReportRepository _reportRepository = new ReportRepository();

        public Models.Report.Report Edit(Guid id, string? Url, Guid? TeamEntity_FK2)
        {
            return _reportRepository.Edit(id, Url, TeamEntity_FK2);
        }
    }
}
