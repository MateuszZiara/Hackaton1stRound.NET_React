using System.Net.Http.Headers;
using System.Security.Claims;
using FluentNHibernate.Conventions;
using Google.Apis.Auth;
using Hackaton_1st_round.Server.Controllers.TeamEntity;
using Hackaton_1st_round.Server.Models.AspNetUsers;
using Hackaton_1st_round.Server.Persistance.AspNetUsers;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;

namespace Hackaton_1st_round.Server.Controllers.AspNetUsers;

using Hackaton_1st_round.Server.Models.TeamEntity;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Text.RegularExpressions;
using static NHibernate.Engine.Query.CallableParser;

[EnableCors("AllowAllOrigins")]
    [Route("api/[controller]")]
    [ApiController]
    public class AspNetUsersController : ControllerBase
    {
        private AspNetUsersService _aspNetUsersService = new AspNetUsersService();

        private SignInManager<Models.AspNetUsers.AspNetUsers> _signInManager;
        
    [SwaggerOperation(Summary = "Pobierz wszystkich użytkowników")]
    [HttpGet]
        public ActionResult<IEnumerable<Models.AspNetUsers.AspNetUsersDTO>> GetAll()
        {
            using (var session = NHibernateHelper.OpenSession())
            {
                var aspNetUsers = session.Query<Models.AspNetUsers.AspNetUsers>().ToList();
                var aspNetUsersDtos = aspNetUsers.Select(user => user.ToDto()).ToList();
                return Ok(aspNetUsersDtos);
            }
        }
        
        
    [SwaggerOperation(Summary = "Pobierz dane użytkownika o wybranym id")]
    [HttpGet("id/{id}")]
        public ActionResult<Models.AspNetUsers.AspNetUsersDTO> GetById(string id)
        {
            using (var session = NHibernateHelper.OpenSession())
            {
                var aspNetUsers = session.Get<Models.AspNetUsers.AspNetUsers>(id);
                if (aspNetUsers == null)
                {
                    return NotFound();
                }

                AspNetUsersDTOMapping.ToDto(aspNetUsers);
                return Ok(aspNetUsers.ToDto());
            }
        }
    
    [SwaggerOperation(Summary = "Zaktualizuj wybranego użytkownika o danym id")]
    [HttpPut("update/{id}")]
        public ActionResult<Models.AspNetUsers.AspNetUsersDTO> Edit(string id, string? email = null,
            string? phoneNumber = null, string? firstName = null,
            string? lastName = null)
        {
            return _aspNetUsersService.Edit(id, email, phoneNumber, firstName,lastName);
        }

    [SwaggerOperation(Summary = "Stwórz nowego użytkownika")]
    [HttpPost("createUser")]
        public ActionResult<Models.AspNetUsers.AspNetUsersDTO> CreateAddressEntity([FromBody] Models.AspNetUsers.AspNetUsers aspNetUsers)
        {
            if (aspNetUsers == null)
            {
                return BadRequest("Invalid data");
            }

            using (var session = NHibernateHelper.OpenSession())
            {
                using (var transaction = session.BeginTransaction())
                {
                    try
                    {
                        session.Save(aspNetUsers);
                        transaction.Commit();
                        return aspNetUsers.ToDto();
                    }
                    catch (Exception ex)
                    {
                        transaction.Rollback();
                        return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
                    }
                }
            }

        }

    [SwaggerOperation(Summary = "Wyloguj użytkownika")]
    [HttpGet("logout")]
        public async Task<IActionResult> Logout()
        {
            foreach (var cookie in Request.Cookies.Keys)
            {
                if (cookie.StartsWith(".AspNetCore.Identity.Application"))
                {
                    Response.Cookies.Delete(cookie);
                }
            }
            
            return Ok("Identity cookies deleted successfully.");
        }

    [SwaggerOperation(Summary = "Pobierz info o użytkowniku z danym tokenem sesji")]
    [HttpGet("info")]
        public async Task<IActionResult> GetUserInfo()
        {
            // Check if user is authenticated
            var user = HttpContext.User;
            if (user.Identity != null && user.Identity.IsAuthenticated)
            {
                // Retrieve user ID from claims
                var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return BadRequest("User ID claim not found.");
                }

                // Parse user ID
                if (!Guid.TryParse(userIdClaim.Value, out Guid userId))
                {
                    return BadRequest("Invalid user ID format.");
                }

                // Retrieve user entity by ID
                using (var session = NHibernateHelper.OpenSession())
                {
                    var userEntity = session.Get<Models.AspNetUsers.AspNetUsers>(userIdClaim.Value);
                    if (userEntity == null)
                    {
                        return NotFound("User not found.");
                    }

                    return Ok(userEntity);
                }
            }
            else
            {
                // User is not authenticated
                return Unauthorized();
            }
        }
        [SwaggerOperation(Summary = "Pobierz Pieniadze uzytkownika do zaplaty po ciasteczkach")]
        [HttpGet("getcash")]
        public float GetCash()
        {
            var user = GetUserInfoAsObject();
            return user.Cash;
        }
        [SwaggerOperation(Summary = "Dodaj do zaplaty uzytkownikowi w ciasteczkach")]
        [HttpPut("addCash")]
        public bool AddCash(float money)
        {
            var user = GetUserInfoAsObject();
            user.Cash += money;
            user.Cash = (float)Math.Round(user.Cash, 2);
            using (var session = NHibernateHelper.OpenSession())
            {
                using (var transaction = session.BeginTransaction())
                {
                    session.SaveOrUpdate(user);
                    transaction.Commit();
                    return true;
                }
            }
        }
        [SwaggerOperation(Summary = "Dodaj do zaplaty uzytkownikowi w ciasteczkach")]
        [HttpPut("resetCash")]
        public bool resetCash()
        {
            var user = GetUserInfoAsObject();
            user.Cash = 0;
            using (var session = NHibernateHelper.OpenSession())
            {
                using (var transaction = session.BeginTransaction())
                {
                    session.SaveOrUpdate(user);
                    transaction.Commit();
                    return true;
                }
            }
        }
    [SwaggerOperation(Summary = "Pobierz info o użytkowniku z danym tokenem sesji jako obiekt")]
    [HttpGet("info/object")]
        public Models.AspNetUsers.AspNetUsers GetUserInfoAsObject()
        {
            // Check if user is authenticated
            var user = HttpContext.User;
            if (user.Identity != null && user.Identity.IsAuthenticated)
            {
                // Retrieve user ID from claims
                var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    throw new Exception("User ID claim not found.");
                }

                // Parse user ID
                if (!Guid.TryParse(userIdClaim.Value, out Guid userId))
                {
                    throw new Exception("Invalid user ID format.");
                }

                // Retrieve user entity by ID
                using (var session = NHibernateHelper.OpenSession())
                {
                    var userEntity = session.Get<Models.AspNetUsers.AspNetUsers>(userIdClaim.Value);
                    if (userEntity == null)
                    {
                        throw new Exception("User not found.");
                    }

                    return userEntity;
                }
            }
            else
            {
                // User is not authenticated
                throw new Exception("Not authorized");
            }
        }

    [SwaggerOperation(Summary = "Usunięcie użytkownika z zespołu")]
    [HttpPut("LeaveTeam")]
        public ActionResult<Models.AspNetUsers.AspNetUsersDTO> LeaveTeam()
        {
            using (var session = NHibernateHelper.OpenSession())
            {
                using (var transaction = session.BeginTransaction())
                {
                    Models.AspNetUsers.AspNetUsers userCookies = GetUserInfoAsObject();
                    Guid? id = userCookies.TeamEntity_FK;
                    if (id == null)
                    {
                        throw new Exception("Something is wrong with your TeamEntity id.");
                    }
                    
                    userCookies.TeamEntity_FK = null;
                    if (session.Query<Models.AspNetUsers.AspNetUsers>().Count(x => x.TeamEntity_FK == id) == 1)
                    {
                        var teamEntity = session.Get<Models.TeamEntity.TeamEntity>(id);
                        session.Delete(teamEntity);
                    }
                    session.Update(userCookies);
                    transaction.Commit();
                    return userCookies.ToDto();
                }
            }
        }

    [SwaggerOperation(Summary = "Pobranie listy użytkowników należących do tego samego zespołu co zalogowany użytkownik")]
    [HttpGet("GetUsersFromTeamCookies")]

        public ActionResult<IEnumerable<Models.AspNetUsers.AspNetUsersDTO>> GetFromTeam()
        {
            using (var session = NHibernateHelper.OpenSession())
            {
                using (var transaction = session.BeginTransaction())
                {
                    Models.AspNetUsers.AspNetUsers userCookies = GetUserInfoAsObject();
                    var query = session.Query<Models.AspNetUsers.AspNetUsers>().Where(x => x.TeamEntity_FK == userCookies.TeamEntity_FK)
                        .ToList();
                    var aspNetUsersDtos = query.Select(user => user.ToDto()).ToList();
                    return aspNetUsersDtos;
                }
            }

            return null;
        }

    [SwaggerOperation(Summary = "Pobranie listy użytkowników na podstawie identyfikatora zespołu")]
    [HttpGet("GetUsersFromTeamId/{id}")]

        public ActionResult<IEnumerable<Models.AspNetUsers.AspNetUsersDTO>> GetFromTeamId(Guid id)
        {
            using (var session = NHibernateHelper.OpenSession())
            {
                using (var transaction = session.BeginTransaction())
                {
                    var query = session.Query<Models.AspNetUsers.AspNetUsers>().Where(x => x.TeamEntity_FK == id)
                        .ToList();
                    var aspNetUsersDtos = query.Select(user => user.ToDto()).ToList();
                    return aspNetUsersDtos;
                }
            }

            return null;
        }

    [SwaggerOperation(Summary = "Dodanie nowego użytkownika do zespołu")]
    [HttpPut("addToTeam/{email}")]
        public ActionResult<Models.AspNetUsers.AspNetUsersDTO> AddToTeam(string email)
        {
            using (var session = NHibernateHelper.OpenSession())
            {
                using (var transaction = session.BeginTransaction())
                {
                    var findedUserFromEmail = session.Query<Models.AspNetUsers.AspNetUsers>()
                        .Where(x => x.Email == email).ToList();
                    if (findedUserFromEmail.Count > 1)
                    {
                        return BadRequest("There is more than 1 user in database with this email");
                    }

                    if (findedUserFromEmail.Count == 0)
                    {
                        throw new Exception("There is no user with this email in the database");
                    }

                    
                    if (findedUserFromEmail[0].TeamEntity_FK != null)
                    {
                        throw new Exception("This user has got a team");
                    }
                    
                    Models.AspNetUsers.AspNetUsers cookieUser = GetUserInfoAsObject();
                    findedUserFromEmail[0].TeamEntity_FK = cookieUser.TeamEntity_FK;
                    session.SaveOrUpdate(findedUserFromEmail[0]);
                    transaction.Commit();
                    return findedUserFromEmail[0].ToDto();
                }
            }
        }

        
        [HttpPost("Facebook")]
        public ActionResult<Models.AspNetUsers.AspNetUsersDTO> Facebook([FromBody] Models.AspNetUsers.AspNetUsers facebookEntity)
        {
            using (var session = NHibernateHelper.OpenSession())
            {
                var query = session.Query<Models.AspNetUsers.AspNetUsers>().Where(x => x.Email == facebookEntity.Email)
                    .ToList();
                if (query.Count() > 0) // Created user
                {
                    return StatusCode(201);
                }
                else
                {
                    using (var transaction = session.BeginTransaction())
                    {
                        
                            if (facebookEntity.Email != null)
                            {
                                facebookEntity.NormalizedEmail = facebookEntity.Email.ToUpper();
                                facebookEntity.UserName = facebookEntity.Email;
                                facebookEntity.NormalizedUserName = facebookEntity.UserName.ToUpper();
                            
                            }

                            var passwordHasher = new PasswordHasher<Models.AspNetUsers.AspNetUsers>();
                            string hashedPassword = passwordHasher.HashPassword(null, "");
                            facebookEntity.PasswordHash = hashedPassword;
                            facebookEntity.UserRank = UserRank.User;
                            facebookEntity.Provider = "Facebook";
                            facebookEntity.Cash = 0.0f;
                            try
                            {
                                session.Save(facebookEntity);
                                transaction.Commit();
                                session.Close();
                                return StatusCode(201);
                            }
                            catch (Exception ex)
                            {
                                transaction.Rollback();
                                return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
                            }
                    }
                }

            }
        }
        
        
        [HttpPost("Google")]        
public async Task<ActionResult<Models.AspNetUsers.AspNetUsersDTO>> Google([FromBody] Models.AspNetUsers.AspNetUsers googleEntity)
{
   
    try
    {
        using (var session = NHibernateHelper.OpenSession())    
        {
            var query = session.Query<Models.AspNetUsers.AspNetUsers>().Where(x => x.Email == googleEntity.Email).ToList();
            if (query.Count() > 0) // Created user
            {
                return StatusCode(201);
            }
            else
            {
                using (var transaction = session.BeginTransaction())
                {
                    if (!string.IsNullOrEmpty(googleEntity.Email))
                    {
                        googleEntity.NormalizedEmail = googleEntity.Email.ToUpper();
                        googleEntity.UserName = googleEntity.Email;
                        googleEntity.NormalizedUserName = googleEntity.UserName.ToUpper();
                    }

                    var passwordHasher = new PasswordHasher<Models.AspNetUsers.AspNetUsers>();
                    string hashedPassword = passwordHasher.HashPassword(null, "");
                    googleEntity.PasswordHash = hashedPassword;
                    googleEntity.UserRank = UserRank.User;
                    googleEntity.Cash = 0.0f;
                    if (string.IsNullOrEmpty(googleEntity.LastName))
                    {
                        googleEntity.LastName = googleEntity.FirstName;
                    }
                    googleEntity.Provider = "Google";

                    try
                    {
                        session.Save(googleEntity);
                        transaction.Commit();
                        return StatusCode(201);
                    }
                    catch (Exception ex)
                    {
                        transaction.Rollback();
                        return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
                    }
                }
            }
        }
    }
    catch (InvalidJwtException)
    {
        return Unauthorized("Invalid Google token.");
    }
}
    [SwaggerOperation(Summary = "Rejestracja nowego uzytkownika")]
    [HttpPost("registerCustom")]
        public ActionResult<Models.AspNetUsers.AspNetUsersDTO> Register([FromBody] Models.AspNetUsers.AspNetUsers testEntity)
        {
            if (testEntity == null)
            {
                return BadRequest("Invalid data");
            }

            using (var session = NHibernateHelper.OpenSession())
            {
                using (var transaction = session.BeginTransaction())
                {
                    try
                    {
                        if (!_aspNetUsersService.VerifyPassword(testEntity.PasswordHash))
                        {
                            return Conflict("Password is too short");
                        }
                        var passwordHasher = new PasswordHasher<Models.AspNetUsers.AspNetUsers>();
                        string hashedPassword = passwordHasher.HashPassword(null, testEntity.PasswordHash);
                        testEntity.PasswordHash = hashedPassword;
                        testEntity.Provider = "Website";
                        if (testEntity.Email != null)
                        {
                            testEntity.NormalizedEmail = testEntity.Email.ToUpper();
                            testEntity.UserName = testEntity.Email;
                            testEntity.NormalizedUserName = testEntity.UserName.ToUpper();
                            
                        }

                        testEntity.Cash = 0.0f;
                        testEntity.UserRank = UserRank.User;
                        session.Save(testEntity);
                        transaction.Commit();
                        return CreatedAtAction(nameof(GetById), new { id = testEntity.Id }, testEntity);
                    }
                    catch (Exception ex)
                    {
                        transaction.Rollback();
                        return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
                    }
                }
            }

        }

    [SwaggerOperation(Summary = "Sprawdzenie czy e-mail istnieje w bazie danych")]
    [HttpGet("checkEmail/{email}")]
        public bool CheckEmailExists(string email)
        {
            using (var session = NHibernateHelper.OpenSession())
            {
                var existingUser = session.Query<Models.AspNetUsers.AspNetUsers>().FirstOrDefault(u => u.Email == email);
                return existingUser != null;
            }
        }


    [SwaggerOperation(Summary = "Usuwanie użytkownika")]
    [HttpDelete("{id}")]
        public ActionResult DeleteAddressEntity(string id)
        {
            using (var session = NHibernateHelper.OpenSession())
            {
                using (var transaction = session.BeginTransaction())
                {
                    try
                    {
                        var aspNetUsers = session.Get<Models.AspNetUsers.AspNetUsers>(id);

                        if (aspNetUsers == null)
                        {
                            return NotFound();
                        }


                        session.Delete(aspNetUsers);


                        transaction.Commit();

                        return NoContent();
                    }
                    catch (Exception ex)
                    {

                        transaction.Rollback();
                        return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
                    }
                }
            }
        }

    [SwaggerOperation(Summary = "Nadanie statusu Admina")]
    [HttpPut("updateToAdmin/{id}")]
        public ActionResult<Models.AspNetUsers.AspNetUsersDTO> UpdateToAdmin(string id)
        {
            using (var session = NHibernateHelper.OpenSession())
            {
                using (var transaction = session.BeginTransaction())
                {
                    var query = session.Query<Models.AspNetUsers.AspNetUsers>().Where(x => x.Id == id).ToList();
                    if (query.Count == 1)
                    {
                        query[0].UserRank = UserRank.Admin;
                        session.SaveOrUpdate(query[0]);
                        transaction.Commit();
                        return query[0].ToDto();
                    }

                    return NotFound("No user with this id");
                }
            }
        }

    [SwaggerOperation(Summary = "Nadanie statusu Usera")]
    [HttpPut("updateToUser/{id}")]
        public ActionResult<Models.AspNetUsers.AspNetUsersDTO> updateToUser(string id)
        {
            using (var session = NHibernateHelper.OpenSession())
            {
                using (var transaction = session.BeginTransaction())
                {
                    var query = session.Query<Models.AspNetUsers.AspNetUsers>().Where(x => x.Id == id).ToList();
                    if (query.Count == 1)
                    {
                        query[0].UserRank = UserRank.User;
                        session.SaveOrUpdate(query[0]);
                        transaction.Commit();
                        return query[0].ToDto();
                    }

                    return NotFound("No user with this id");
                }
            }
        }


    [SwaggerOperation(Summary = "Zmiana hasła użytkownika")]
    [HttpPut("changePassword")]
    public ActionResult<Models.AspNetUsers.AspNetUsersDTO> ChangePassword([FromBody] ChangePasswordDTO request)
    {
        using (var session = NHibernateHelper.OpenSession())
        {
            using (var transaction = session.BeginTransaction())
            {
                var query = session.Query<Models.AspNetUsers.AspNetUsers>().Where(x => x.Id == request.Id).ToList();
                if (query.Count == 1)
                {
                    var passwordHasher = new PasswordHasher<Models.AspNetUsers.AspNetUsers>();
                    // Sprawdź hasło
                    if (passwordHasher.VerifyHashedPassword(null, query[0].PasswordHash, request.OldPassword) != PasswordVerificationResult.Success)
                    {
                        return Unauthorized("Wrong password. Try again");
                    }
                    if (request.NewPassword.Length < 8 || request.NewPassword == null)
                    {
                        return Unauthorized("New password doesn't meet criteria. Password must be at least 8 characters long.");
                    }
                    // Zaktualizuj hasło
                    query[0].PasswordHash = passwordHasher.HashPassword(null, request.NewPassword);
                    session.SaveOrUpdate(query[0]);
                    transaction.Commit();
                    return query[0].ToDto();
                }

                return NotFound("No user with this id");
            }
        }
    }


    [SwaggerOperation(Summary = "Zmiana maila użytkownika")]
    [HttpPut("changeEmail")]
    public ActionResult<Models.AspNetUsers.AspNetUsersDTO> ChangeEmail([FromBody] ChangePasswordDTO request)
    {
        using (var session = NHibernateHelper.OpenSession())
        {
            using (var transaction = session.BeginTransaction())
            {
                var query = session.Query<Models.AspNetUsers.AspNetUsers>().Where(x => x.Id == request.Id).ToList();
                if (query.Count == 1)
                {
                    var passwordHasher = new PasswordHasher<Models.AspNetUsers.AspNetUsers>();
                    // Sprawdź hasło czy się zgadza, czy mail jest poprawny, czy mail istnieje
                    if (
                        (passwordHasher.VerifyHashedPassword(null, query[0].PasswordHash, request.OldPassword) != PasswordVerificationResult.Success) ||
                        (!Regex.IsMatch(request.NewEmail, "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")) ||
                        (session.Query<Models.AspNetUsers.AspNetUsers>().FirstOrDefault(u => u.Email == request.NewEmail).IsAny())
                        )
                    {
                        return Unauthorized("Wrong data. Try again");
                    }
                    
                    // Zaktualizuj hasło
                    query[0].Email = request.NewEmail;
                    query[0].NormalizedEmail = request.NewEmail.ToUpper();
                    query[0].UserName = request.NewEmail;
                    query[0].NormalizedUserName = request.NewEmail.ToUpper();
                    session.SaveOrUpdate(query[0]);
                    transaction.Commit();
                    return query[0].ToDto();
                }

                return NotFound("No user with this id");
            }
        }
    }
}
