using Microsoft.AspNetCore.Mvc;

namespace Hackaton_1st_round.Server.Models.AspNetUsers;

public interface IAspNetUsersService
{
    public ActionResult<AspNetUsersDTO> Edit(string id, string? email, string? phoneNumber, string? firstName,
        string? lastName);

    public bool VerifyPassword(string Password);
}