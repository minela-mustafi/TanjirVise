using System.ComponentModel.DataAnnotations;

namespace TanjirVise.DTO.Models
{
    public class ChangePasswordModel
    {
        [Required]
        public string OldPassword { get; set; }

        [Required/*, MinLength(8, ErrorMessage = "Password needs to be at least 8 characters long.")*/]
        public string Password { get; set; } = string.Empty;

        [Required/*, Compare("Password")*/]
        public string ConfirmPassword { get; set; } = string.Empty;
    }
}
