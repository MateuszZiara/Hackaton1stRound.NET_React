using System.Reflection.Metadata;
using Microsoft.AspNetCore.Identity;

namespace Hackaton_1st_round.Server.Models.Report;

public class Report 
{
    public Report() : base()
    {

    }

    public Report(Guid id, Guid teamEntity_FK)
    {
        this.id = id;
        TeamEntity_FK2 = teamEntity_FK;
        accepted = false;
    }

    public virtual Guid id { get; set; }
    public virtual String Base64 { get; set; }

    public virtual bool accepted { get; set; }
    public virtual Guid? TeamEntity_FK2 { get; set; }
}