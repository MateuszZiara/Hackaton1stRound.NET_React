namespace Hackaton_1st_round.Server.Models.AspNetUsers;

public interface IAspNetUsersRepository
{
    public AspNetUsers Edit(string id, string? email, string? phoneNumber, string? firstName,
        string? lastName);

    public bool VerifyPassword(string Password);
}