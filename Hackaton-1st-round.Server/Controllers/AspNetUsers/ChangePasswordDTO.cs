namespace Hackaton_1st_round.Server.Controllers.AspNetUsers
{
    public class ChangePasswordDTO
    {
        public string Id { get; set; }
        public string OldPassword { get; set; }
        public string? NewPassword { get; set; }
        public string? OldEmail { get; set; }
        public string? NewEmail { get; set; }
    }
}
