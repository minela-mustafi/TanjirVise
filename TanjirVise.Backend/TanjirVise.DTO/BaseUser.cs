using System.ComponentModel.DataAnnotations.Schema;

namespace TanjirVise.DTO
{
    public class BaseUser : BaseClass
    {
        public string Email { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
        public string? VerificationToken { get; set; }
        public DateTime? VerifiedAt { get; set; }
        public string? PasswordResetToken { get; set; }
        public DateTime? ResetTokenExpires { get; set; }
        public string Phone { get; set; }
        public Role Role { get; set; }
        public virtual IList<FoodRequest> FoodRequests { get; set; } = new List<FoodRequest>();
    }
}
