using System.Security.Cryptography;
using Hackaton_1st_round.Server.Models.AspNetUsers;

namespace Hackaton_1st_round.Server.Persistance.AspNetUsers;

public class AspNetUsersRepository : IAspNetUsersRepository
{
    public bool VerifyPassword(string Password)
    {
        if (Password.Length <  8) return false;
        return true;
    }
    public Models.AspNetUsers.AspNetUsers Edit(Guid id, string? email, string? phoneNumber, string? firstName,
        string? lastName)
    {
        using (var session = NHibernateHelper.OpenSession())
        {
            using (var transaction = session.BeginTransaction())
            {
                
                var query = session.Query<Models.AspNetUsers.AspNetUsers>()
                    .Where(x => x.Id == id.ToString())
                    .ToList();
                if (query.Count == 0)
                    throw new Exception("No user with this id");
                if (email != null)
                {
                    query[0].Email = email;
                    query[0].EmailConfirmed = false;
                    query[0].UserName = email;
                    query[0].NormalizedEmail = email.ToUpper();
                    query[0].NormalizedUserName = email.ToUpper();
                }

                if (phoneNumber != null)
                {
                    query[0].PhoneNumber = phoneNumber;
                    query[0].PhoneNumberConfirmed = false;
                }

                if (firstName != null)
                    query[0].FirstName = firstName;
                if (lastName != null)
                    query[0].LastName = lastName;
                session.SaveOrUpdate(query[0]);
                transaction.Commit();
                return query[0];
            }
        }
        
    }

    
    
}