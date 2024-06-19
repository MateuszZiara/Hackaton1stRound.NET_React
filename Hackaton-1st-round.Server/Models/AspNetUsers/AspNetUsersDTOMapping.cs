namespace Hackaton_1st_round.Server.Models.AspNetUsers;

public static class AspNetUsersDTOMapping
{
    public static AspNetUsersDTO ToDto(this AspNetUsers user)
    {
        return new AspNetUsersDTO(
            user.FirstName,
            user.LastName,
            user.UserRank,
            user.Provider
        );
    }
}