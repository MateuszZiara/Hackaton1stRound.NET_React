namespace Hackaton_1st_round.Server.Models.TeamEntity
{
    public interface ITeamEntityRepository
    {
        public TeamEntity Edit(Guid id, string? TeamName, string? TeamDesc);
    }
}
