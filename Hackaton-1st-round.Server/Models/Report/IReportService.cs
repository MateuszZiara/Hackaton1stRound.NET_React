namespace Hackaton_1st_round.Server.Models.Report
{
    public interface IReportService
    {
        public Models.Report.Report Edit(Guid id, string? Url, Guid? TeamEntity_FK2);
    }
}
