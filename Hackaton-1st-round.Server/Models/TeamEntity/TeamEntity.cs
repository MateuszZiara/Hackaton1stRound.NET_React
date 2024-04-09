namespace Hackaton_1st_round.Server.Models.TeamEntity
{
    public class TeamEntity
    {
        public TeamEntity() :base()
        { }

        public TeamEntity(Guid id, string teamName, string teamDesc)
        {
            this.id = id;
            TeamName = teamName;
            TeamDesc = teamDesc;
        }

        public virtual Guid id { get; set; }
        public virtual string TeamName { get; set; }
        public virtual string TeamDesc { get; set; }
    }
}
