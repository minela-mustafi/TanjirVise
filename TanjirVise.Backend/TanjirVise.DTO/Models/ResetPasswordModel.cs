using System.ComponentModel.DataAnnotations;

namespace TanjirVise.DTO.Models
{
    public class ResetPasswordModel
    {
        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;
        [Required]
        public Role Role { get; set; } = Role.Undefined;
        [Required]
        public string Token { get; set; } = string.Empty;
        [Required, MinLength(8, ErrorMessage = "Password needs to be at least 8 characters long.")]
        public string Password { get; set; } = string.Empty;
        [Required, Compare("Password")]
        public string ConfirmPassword { get; set; } = string.Empty;
    }
}
