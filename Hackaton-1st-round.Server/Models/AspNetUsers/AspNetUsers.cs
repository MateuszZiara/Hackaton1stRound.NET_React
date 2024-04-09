using Microsoft.AspNetCore.Identity;

namespace Hackaton_1st_round.Server.Models.AspNetUsers;

public class AspNetUsers: IdentityUser
{
    public AspNetUsers() : base()
    {
        
    }

    public AspNetUsers(string firstName, string lastName, Guid teamEntityFk)
    {
        FirstName = firstName;
        LastName = lastName;
        TeamEntity_FK = teamEntityFk;
    }

    public virtual string FirstName { get; set; }
    public virtual string LastName { get; set; }
    
    public virtual Guid? TeamEntity_FK { get; set; }
    public virtual UserRank UserRank { get; set; }
}