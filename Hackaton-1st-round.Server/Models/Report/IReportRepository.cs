namespace Hackaton_1st_round.Server.Models.Report
{
    public interface IReportRepository
    {
        public Models.Report.Report Edit(Guid id, string? Url, Guid? TeamEntity_FK2);
    }
}
