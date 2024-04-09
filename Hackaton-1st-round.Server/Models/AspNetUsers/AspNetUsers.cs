using Microsoft.AspNetCore.Identity;

namespace Hackaton_1st_round.Server.Models.AspNetUsers;

public class AspNetUsers: IdentityUser
{
    public AspNetUsers() : base()
    {
        
    }

    public AspNetUsers(string firstName, string lastName)
    {
        FirstName = firstName;
        LastName = lastName;
    }

    public virtual string FirstName { get; set; }
    public virtual string LastName { get; set; }
    
    public virtual UserRank UserRank { get; set; }
}