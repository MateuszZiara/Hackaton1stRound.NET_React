using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Swashbuckle.AspNetCore.Annotations;

namespace Hackaton_1st_round.Server.Controllers.Payment
{
    [EnableCors("AllowAllOrigins")]
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {

        [SwaggerOperation(Summary = "Pobranie wszystkich encji płatności z bazy danych")]
        [HttpGet]
        public ActionResult<IEnumerable<Models.Payment.Payment>> GetAll()
        {
            using (var session = NHibernateHelper.OpenSession())
            {
                var paymentEntities = session.Query<Models.Payment.Payment>().ToList();
                return Ok(paymentEntities);
            }
        }


        [SwaggerOperation(Summary = "Wyświetlenie encji z bazy danych na podstawie id")]
        [HttpGet("id/{id}")]
        public ActionResult<Models.Payment.Payment> GetById(Guid id)
        {
            using (var session = NHibernateHelper.OpenSession())
            {
                var payment = session.Get<Models.Payment.Payment>(id);
                if (payment == null)
                {
                    return NotFound();
                }

                return Ok(payment);
            }
        }

        [SwaggerOperation(Summary = "Tworzenie nowej encji płatnosci dla Paypala")]
        [HttpPost("paypal")]
        public ActionResult<Models.Report.Report> CreatePaypalPayment([FromBody] Models.Payment.Payment payment)
        {
            if (payment == null)
            {
                return BadRequest("Invalid data");
            }

            using (var session = NHibernateHelper.OpenSession())
            {
                using (var transaction = session.BeginTransaction())
                {
                    try
                    {
                        payment.TransactionDate = DateTime.Now;
                        payment.TypeOfPayment = Models.Payment.TypeOfPayment.Paypal;
                        session.Save(payment);
                        transaction.Commit();
                        return CreatedAtAction(nameof(GetById), new { id = payment.id }, payment);
                    }
                    catch (Exception ex)
                    {
                        transaction.Rollback();
                        return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
                    }
                }
            }

        }

        [SwaggerOperation(Summary = "Tworzenie nowej encji płatnosci dla płatnosci offline")]
        [HttpPost("offlinepayment")]
        public ActionResult<Models.Report.Report> CreateTraditionalPayment([FromBody] Models.Payment.Payment payment)
        {
            if (payment == null)
            {
                return BadRequest("Invalid data");
            }

            using (var session = NHibernateHelper.OpenSession())
            {
                using (var transaction = session.BeginTransaction())
                {
                    try
                    {
                        payment.TransactionDate = DateTime.Now;
                        payment.TypeOfPayment = Models.Payment.TypeOfPayment.Traditional;
                        session.Save(payment);
                        transaction.Commit();
                        return CreatedAtAction(nameof(GetById), new { id = payment.id }, payment);
                    }
                    catch (Exception ex)
                    {
                        transaction.Rollback();
                        return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
                    }
                }
            }

        }

        [SwaggerOperation(Summary = "Sprawdzanie czy dany zespół dokonał płatności")]
        [HttpGet("checkPayment/{teamId}")]
        public bool CheckTeamPayment(Guid teamId)
        {
            using (var session = NHibernateHelper.OpenSession())
            {
                var paymentExists = session.Query<Models.Payment.Payment>()
                                          .Any(p => p.TeamId == teamId);

                return paymentExists;
            }
        }


        /* 
        * aktualizacja płatności ręcznej
        * aktualizacja płatności PAYPAL - zmiana statusu przez serwer
        * USUWANIE Płatności
        * 
        */
    }
}
