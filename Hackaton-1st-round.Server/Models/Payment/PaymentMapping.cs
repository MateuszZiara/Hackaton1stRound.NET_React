using FluentNHibernate.Mapping;

namespace Hackaton_1st_round.Server.Models.Payment
{
    public class PaymentMapping : ClassMap<Payment>
    {
        readonly string tablename = nameof(Payment);
        public PaymentMapping() {
            Id(x => x.id);
            Map(x => x.Name).Nullable();
            Map(x => x.Price);
            Map(x => x.IsApproved);
            Map(x => x.Description);
            Map(x => x.TypeOfPayment).CustomType<TypeOfPayment>();
            Map(x => x.TransactionDate);
            Map(x => x.UserId);
            Map(x => x.TeamId);
            
            Table(tablename);
        }
    }
}
