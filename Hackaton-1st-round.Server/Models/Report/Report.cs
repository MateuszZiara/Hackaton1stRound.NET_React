using Microsoft.AspNetCore.Identity;

namespace Hackaton_1st_round.Server.Models.Report;

public class Report 
{
    public Report() : base()
    {

    }

    public Report(Guid id, string url, Guid teamEntity_FK)
    {
        this.id = id;
        Url = url;
        TeamEntity_FK2 = teamEntity_FK;
        accepted = false;
    }

    public virtual Guid id { get; set; }
    public virtual string Url { get; set; }

    public virtual bool accepted { get; set; }
    public virtual Guid? TeamEntity_FK2 { get; set; }
}