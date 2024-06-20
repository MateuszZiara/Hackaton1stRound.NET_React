namespace Hackaton_1st_round.Server.Models.AspNetUsers;

public class AspNetUsersDTO
{
    public AspNetUsersDTO(string firstName, string? lastName, UserRank userRank, string provider, string Id, string email)
    {
        FirstName = firstName;
        LastName = lastName;
        UserRank = userRank;
        Provider = provider;
        this.Id = Id;
        this.Email = email;
    }

    public virtual string FirstName { get; set; }
    public virtual string Email { get; set; }
    public virtual string Id { get; set; }
    public virtual string? LastName { get; set; }

    public virtual UserRank UserRank { get; set; }
    
    public virtual string Provider { get; set; }

}