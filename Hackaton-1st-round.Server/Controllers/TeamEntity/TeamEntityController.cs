using System.Security.Claims;
using Hackaton_1st_round.Server.Controllers.AspNetUsers;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Hackaton_1st_round.Server.Models.TeamEntity;
using Hackaton_1st_round.Server.Persistance.TeamEntity;

namespace Hackaton_1st_round.Server.Controllers.TeamEntity
{
    [EnableCors("AllowAllOrigins")]
    [Route("api/[controller]")]
    [ApiController]
    public class TeamEntityController : ControllerBase
    {
        private readonly TeamEntityService _teamEntityService = new TeamEntityService();
        private readonly TeamEntityRepository _teamEntityRepository = new TeamEntityRepository();

        [HttpGet]
        public ActionResult<IEnumerable<Models.TeamEntity.TeamEntity>> GetAll()
        {
            using (var session = NHibernateHelper.OpenSession())
            {
                var teamEntities = session.Query<Models.TeamEntity.TeamEntity>().ToList();
                return Ok(teamEntities);
            }
        }

        [HttpGet("id/{id}")]
        public ActionResult<Models.TeamEntity.TeamEntity> GetById(Guid id)
        {
            using (var session = NHibernateHelper.OpenSession())
            {
                var teamEntity = session.Get<Models.TeamEntity.TeamEntity>(id);
                if (teamEntity == null)
                {
                    return NotFound();
                }

                return Ok(teamEntity);
            }
        }

        [HttpPost("createTeamByUser")]
        public ActionResult<Models.TeamEntity.TeamEntity> CreateTeamByUser([FromBody] Models.TeamEntity.TeamEntity teamEntity)
        {
            using (var session = NHibernateHelper.OpenSession())
            {
                using (var transaction = session.BeginTransaction())
                {
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

                        var userEntity = session.Get<Models.AspNetUsers.AspNetUsers>(userIdClaim.Value);
                        if (userEntity == null)
                        {
                            throw new Exception("User not found.");
                        }

                        var checkName = session.Query<Models.TeamEntity.TeamEntity>()
                            .Where(x => x.TeamName == teamEntity.TeamName).ToList();
                        if (checkName.Count > 0)
                            throw new Exception("There is a team with this name");
                        session.Save(teamEntity);
                        var query = session.Query<Models.AspNetUsers.AspNetUsers>().Where(x => x.Id == userEntity.Id)
                            .ToList();
                        query[0].TeamEntity_FK = teamEntity.id;
                        session.Save(query[0]);
                        transaction.Commit();
                        return CreatedAtAction(nameof(GetById), new { id = teamEntity.id }, teamEntity);
                    }
                }
            }

            throw new Exception("There is problem with your cookies settings contact with administrator");
        }
        
        [HttpPost]
        public ActionResult<Models.TeamEntity.TeamEntity> CreateAddressEntity([FromBody] Models.TeamEntity.TeamEntity teamEntity)
        {
            if (teamEntity == null)
            {
                return BadRequest("Invalid data");
            }

            using (var session = NHibernateHelper.OpenSession())
            {
                using (var transaction = session.BeginTransaction())
                {
                    try
                    {
                        session.Save(teamEntity);
                        transaction.Commit();
                        return CreatedAtAction(nameof(GetById), new { id = teamEntity.id }, teamEntity);
                    }
                    catch (Exception ex)
                    {
                        transaction.Rollback();
                        return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
                    }
                }
            }

        }
        
        [HttpGet("AmmountOfMembers/{id}")]
        public int GetAmmountOfMembers(Guid id)
        {
            using (var session = NHibernateHelper.OpenSession())
            {
                var query = session.Query<Models.TeamEntity.TeamEntity>().Where(x => x.id == id).ToList();
                return query.Count;
            }
        }
        

        [HttpPut("update/{id}")]
        public ActionResult<Models.TeamEntity.TeamEntity> Edit(Guid id, string TeamName = null, string TeamDesc = null)
        {
            return _teamEntityRepository.Edit(id, TeamName, TeamDesc);
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
                        var teamEntity = session.Get<Models.TeamEntity.TeamEntity>(id);

                        if (teamEntity == null)
                        {
                            return NotFound();
                        }


                        session.Delete(teamEntity);


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
}
