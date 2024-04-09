namespace Hackaton_1st_round.Server.Controllers.AspNetUsers;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;


    [EnableCors("AllowAllOrigins")]
    [Route("api/[controller]")]
    [ApiController]
    public class AspNetUsersController : ControllerBase
    {
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
