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
