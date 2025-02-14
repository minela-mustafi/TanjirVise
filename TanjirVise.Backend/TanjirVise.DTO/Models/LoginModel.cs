using System.ComponentModel.DataAnnotations;

namespace TanjirVise.DTO.Models
{
    public class LoginModel
    {
        //[Required]
        //public Role Role { get; set; } = Role.Undefined;
        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;
        [Required]
        public string Password { get; set; } = string.Empty;
    }
}
