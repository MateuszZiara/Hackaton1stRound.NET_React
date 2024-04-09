using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Hackaton_1st_round.Server.Models.Report;
using Hackaton_1st_round.Server.Persistance.Report;

namespace Hackaton_1st_round.Server.Controllers.Report
{
    [EnableCors("AllowAllOrigins")]
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private readonly ReportService _ReportService = new ReportService();
        private readonly ReportRepository _ReportRepository = new ReportRepository();

        [HttpGet]
        public ActionResult<IEnumerable<Models.Report.Report>> GetAll()
        {
            using (var session = NHibernateHelper.OpenSession())
            {
                var teamEntities = session.Query<Models.Report.Report>().ToList();
                return Ok(teamEntities);
            }
        }

        [HttpGet("id/{id}")]
        public ActionResult<Models.Report.Report> GetById(Guid id)
        {
            using (var session = NHibernateHelper.OpenSession())
            {
                var Report = session.Get<Models.Report.Report>(id);
                if (Report == null)
                {
                    return NotFound();
                }

                return Ok(Report);
            }
        }

        [HttpPost]
        public ActionResult<Models.Report.Report> CreateAddressEntity([FromBody] Models.Report.Report Report)
        {
            if (Report == null)
            {
                return BadRequest("Invalid data");
            }

            using (var session = NHibernateHelper.OpenSession())
            {
                using (var transaction = session.BeginTransaction())
                {
                    try
                    {
                        session.Save(Report);
                        transaction.Commit();
                        return CreatedAtAction(nameof(GetById), new { id = Report.id }, Report);
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
        public ActionResult<Models.Report.Report> Edit(Guid id, string? Url = null, Guid? TeamEntity_FK2 = null)
        {
            Guid guid = Guid.NewGuid();
            if (TeamEntity_FK2 == null)
            {

                guid = Guid.Empty;
            }
            else
                guid = TeamEntity_FK2.Value;

            return _ReportService.Edit(id, Url, TeamEntity_FK2);
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
                        var Report = session.Get<Models.Report.Report>(id);

                        if (Report == null)
                        {
                            return NotFound();
                        }


                        session.Delete(Report);


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
