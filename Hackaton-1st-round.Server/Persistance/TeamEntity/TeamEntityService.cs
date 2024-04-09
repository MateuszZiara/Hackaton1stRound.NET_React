using Hackaton_1st_round.Server.Models.TeamEntity;

namespace Hackaton_1st_round.Server.Persistance.TeamEntity
{
    
    public class TeamEntityService : ITeamEntityService
    {
        private TeamEntityRepository _teamEntityRepository = new TeamEntityRepository();

        public Models.TeamEntity.TeamEntity Edit(Guid id, string? TeamName, string? TeamDesc)
        {
            return _teamEntityRepository.Edit(id, TeamName, TeamDesc);
        }
    }
}
