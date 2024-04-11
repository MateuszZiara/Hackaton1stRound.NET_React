using System.Security.Claims;
using Hackaton_1st_round.Server.Controllers.TeamEntity;
using Hackaton_1st_round.Server.Models.AspNetUsers;
using Hackaton_1st_round.Server.Persistance.AspNetUsers;
using Microsoft.AspNetCore.Identity;

namespace Hackaton_1st_round.Server.Controllers.AspNetUsers;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;


    [EnableCors("AllowAllOrigins")]
    [Route("api/[controller]")]
    [ApiController]
    public class AspNetUsersController : ControllerBase
    {
        private AspNetUsersService _aspNetUsersService = new AspNetUsersService();
    [SwaggerOperation(Summary = "Pobierz wszystkich użytkowników")]
    [HttpGet]
        public ActionResult<IEnumerable<Models.AspNetUsers.AspNetUsers>> GetAll()
        {
            using (var session = NHibernateHelper.OpenSession())
            {
                var aspNetUsers = session.Query<Models.AspNetUsers.AspNetUsers>().ToList();
                foreach (var item in aspNetUsers)
                {
                    item.PasswordHash = "***";
                }
                return Ok(aspNetUsers);
            }
        }

        [HttpGet("id/{id}")]
        public ActionResult<Models.AspNetUsers.AspNetUsers> GetById(string id)
        {
            using (var session = NHibernateHelper.OpenSession())
            {
                var aspNetUsers = session.Get<Models.AspNetUsers.AspNetUsers>(id);
                if (aspNetUsers == null)
                {
                    return NotFound();
                }

                return Ok(aspNetUsers);
            }
        }

        [HttpPut("update/{id}")]
        public ActionResult<Models.AspNetUsers.AspNetUsers> Edit(string id, string? email = null,
            string? phoneNumber = null, string? firstName = null,
            string? lastName = null)
        {
            return _aspNetUsersService.Edit(id, email, phoneNumber, firstName,lastName);
        }
        
        [HttpPost("createUser")]
        public ActionResult<Models.AspNetUsers.AspNetUsers> CreateAddressEntity([FromBody] Models.AspNetUsers.AspNetUsers aspNetUsers)
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
                        return CreatedAtAction(nameof(GetById), new { id = aspNetUsers.Id }, aspNetUsers);
                    }
                    catch (Exception ex)
                    {
                        transaction.Rollback();
                        return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
                    }
                }
            }

        }
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

        [HttpPut("LeaveTeam")]
        public ActionResult<Models.AspNetUsers.AspNetUsers> LeaveTeam()
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
                    return userCookies;
                }
            }
        }

        [HttpGet("GetUsersFromTeamCookies")]

        public ActionResult<IEnumerable<Models.AspNetUsers.AspNetUsers>> GetFromTeam()
        {
            using (var session = NHibernateHelper.OpenSession())
            {
                using (var transaction = session.BeginTransaction())
                {
                    Models.AspNetUsers.AspNetUsers userCookies = GetUserInfoAsObject();
                    var query = session.Query<Models.AspNetUsers.AspNetUsers>().Where(x => x.TeamEntity_FK == userCookies.TeamEntity_FK)
                        .ToList();
                    return query;
                }
            }

            return null;
        }
        [HttpGet("GetUsersFromTeamId/{id}")]

        public ActionResult<IEnumerable<Models.AspNetUsers.AspNetUsers>> GetFromTeamId(Guid id)
        {
            using (var session = NHibernateHelper.OpenSession())
            {
                using (var transaction = session.BeginTransaction())
                {
                    var query = session.Query<Models.AspNetUsers.AspNetUsers>().Where(x => x.TeamEntity_FK == id)
                        .ToList();
                    return query;
                }
            }

            return null;
        }
        
        [HttpPut("addToTeam/{email}")]
        public ActionResult<Models.AspNetUsers.AspNetUsers> AddToTeam(string email)
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
                    return findedUserFromEmail[0];
                }
            }
        }
        [HttpPost("registerCustom")]
        public ActionResult<Models.AspNetUsers.AspNetUsers> Register([FromBody] Models.AspNetUsers.AspNetUsers testEntity)
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
                        
                        if (testEntity.Email != null)
                        {
                            testEntity.NormalizedEmail = testEntity.Email.ToUpper();
                            testEntity.UserName = testEntity.Email;
                            testEntity.NormalizedUserName = testEntity.UserName.ToUpper();
                            
                        }

                        testEntity.UserRank = UserRank.User;

                        if (testEntity.FirstName != null)
                            testEntity.FirstName = testEntity.FirstName;
                        if (testEntity.LastName != null)
                            testEntity.LastName = testEntity.LastName;
                        
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
        [HttpGet("checkEmail/{email}")]
        public ActionResult<bool> CheckEmailExists(string email)
        {
            using (var session = NHibernateHelper.OpenSession())
            {
                var existingUser = session.Query<Models.AspNetUsers.AspNetUsers>().FirstOrDefault(u => u.Email == email);
                return existingUser != null;
            }
        }
        
        
        
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
        [HttpPut("updateToAdmin/{id}")]
        public ActionResult<Models.AspNetUsers.AspNetUsers> UpdateToAdmin(string id)
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
                        return query[0];
                    }

                    return NotFound("No user with this id");
                }
            }
        }
        [HttpPut("updateToUser/{id}")]
        public ActionResult<Models.AspNetUsers.AspNetUsers> updateToUser(string id)
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
                        return query[0];
                    }

                    return NotFound("No user with this id");
                }
            }
        }

}
