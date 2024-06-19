using Hackaton_1st_round.Server.Models.AspNetUsers;
using Microsoft.AspNetCore.Mvc;

namespace Hackaton_1st_round.Server.Persistance.AspNetUsers;

public class AspNetUsersService : IAspNetUsersService
{
    private AspNetUsersRepository _aspNetUsersRepository = new AspNetUsersRepository();
    public ActionResult<AspNetUsersDTO> Edit(string id, string? email, string? phoneNumber, string? firstName,
        string? lastName)
    {
        return _aspNetUsersRepository.Edit(id, email, phoneNumber, firstName, lastName);
    }

    public bool VerifyPassword(string Password)
    {
        return _aspNetUsersRepository.VerifyPassword(Password);
    }
}