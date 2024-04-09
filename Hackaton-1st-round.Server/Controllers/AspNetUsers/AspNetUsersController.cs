using System.Security.Claims;
using Hackaton_1st_round.Server.Models.AspNetUsers;
using Hackaton_1st_round.Server.Persistance.AspNetUsers;
using Microsoft.AspNetCore.Identity;

namespace Hackaton_1st_round.Server.Controllers.AspNetUsers;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;


    [EnableCors("AllowAllOrigins")]
    [Route("api/[controller]")]
    [ApiController]
    public class AspNetUsersController : ControllerBase
    {
        private AspNetUsersService _aspNetUsersService = new AspNetUsersService();
        [HttpGet]
        public ActionResult<IEnumerable<Models.AspNetUsers.AspNetUsers>> GetAll()
        {
            using (var session = NHibernateHelper.OpenSession())
            {
                var aspNetUsers = session.Query<Models.AspNetUsers.AspNetUsers>().ToList();
                return Ok(aspNetUsers);
            }
        }

        [HttpGet("id/{id}")]
        public ActionResult<Models.AspNetUsers.AspNetUsers> GetById(Guid id)
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
        public ActionResult<Models.AspNetUsers.AspNetUsers> Edit(Guid id, string? email = null,
            string? phoneNumber = null, string? firstName = null,
            string? lastName = null)
        {
            return _aspNetUsersService.Edit(id, email, phoneNumber, firstName,lastName);
        }
        
        [HttpPost]
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
        
        
        [HttpDelete("{id}")]
        public ActionResult DeleteAddressEntity(Guid id)
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

    }
