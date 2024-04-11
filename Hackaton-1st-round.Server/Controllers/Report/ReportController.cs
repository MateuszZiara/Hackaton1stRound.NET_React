using System.Reflection.Metadata;
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
        [HttpGet("CheckAccepted/{id}")]
        public bool CheckIfTeamAccepted(Guid id)
        {
            using (var session = NHibernateHelper.OpenSession())
            {
                var query = session.Query<Models.Report.Report>().Where(x => x.TeamEntity_FK2 == id && x.accepted).ToList();
                if (query == null)
                    return false;
                if (query.Count > 0)
                {
                    return true;
                }

                return false;
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
        

        
        [HttpPost("upload/{name}/{FK}")]
        public async Task<IActionResult> Upload(string name, Guid FK, [FromForm] Microsoft.AspNetCore.Http.IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("Nieprawidłowy plik");
            }

            try
            {
                string _uploadsDirectory = @"uploads\" + name;
                var uploadsPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, _uploadsDirectory);
                var filePath = Path.Combine(uploadsPath, "zgloszenie.pdf");
                string base64String = ""; // Variable to store base64 string

                // Jeśli katalog nie istnieje, utwórz go
                if (!Directory.Exists(uploadsPath))
                {
                    Directory.CreateDirectory(uploadsPath);
                }

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Convert PDF file to base64
                using (var stream = new FileStream(filePath, FileMode.Open))
                {
                    byte[] bytes = new byte[stream.Length];
                    await stream.ReadAsync(bytes, 0, (int)stream.Length);
                    base64String = Convert.ToBase64String(bytes);
                }

                using (var session = NHibernateHelper.OpenSession())
                {
                    using (var transaction = session.BeginTransaction())
                    {
                        Models.Report.Report report = new Models.Report.Report();
                        report.TeamEntity_FK2 = FK;
                        report.accepted = false;
                        report.Base64 = base64String; // Assuming there's a property named Base64Data in the Report model
                        session.Save(report);
                        transaction.Commit();
                    }
                }

                return Ok("Plik został pomyślnie zapisany.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Wystąpił błąd podczas zapisywania pliku: {ex.Message}");
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
        
        [HttpPut("acccept/{id}")]
        public ActionResult<Models.Report.Report> Accept(Guid id)
        {
            using (var session = NHibernateHelper.OpenSession())
            {
                using (var transaction = session.BeginTransaction())
                {
                    var query = session.Get<Models.Report.Report>(id);
                    query.accepted = true;
                    session.SaveOrUpdate(query);
                    transaction.Commit();
                    return query;
                }
            }
        }
        [HttpPut("reject/{id}")]
        public ActionResult<Models.Report.Report> Reject(Guid id)
        {
            using (var session = NHibernateHelper.OpenSession())
            {
                using (var transaction = session.BeginTransaction())
                {
                    var query = session.Get<Models.Report.Report>(id);
                    query.accepted = false;
                    session.SaveOrUpdate(query);
                    transaction.Commit();
                    return query;
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
