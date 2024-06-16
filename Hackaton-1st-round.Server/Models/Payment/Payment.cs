namespace Hackaton_1st_round.Server.Models.Payment
{
    public class Payment
    {
        public Payment() : base() { }   
        public Payment(Guid id, string name, double price, string description, DateTime transactionDate, bool isApproved, string userId, Guid teamId, TypeOfPayment typeOfPayment)
        {
            this.id = id;
            Name = name;
            Price = price;
            Description = description;
            TransactionDate = transactionDate;
            IsApproved = isApproved;
            UserId = userId;
            TeamId = teamId;
            TypeOfPayment = typeOfPayment;
        }

        public virtual Guid id { get; set; }
        public virtual string? Name { get; set; } //id płatnosci z paypala lub null jeżeli to płatność ręczna
        public virtual double Price { get; set; }
        public virtual string Description { get; set; }//tytuł przelewu
        public virtual DateTime TransactionDate { get; set;}
        public virtual bool IsApproved { get; set; }
        public virtual string UserId { get; set;}
        public virtual Guid TeamId { get; set; }
        public virtual TypeOfPayment TypeOfPayment { get; set;}

    }
}
