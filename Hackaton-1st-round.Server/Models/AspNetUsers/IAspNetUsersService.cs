namespace Hackaton_1st_round.Server.Models.AspNetUsers;

public interface IAspNetUsersService
{
    public AspNetUsers Edit(Guid id, string? email, string? phoneNumber, string? firstName,
        string? lastName);
}