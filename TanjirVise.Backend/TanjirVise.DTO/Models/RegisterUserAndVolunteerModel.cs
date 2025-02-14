using System.ComponentModel.DataAnnotations;

namespace TanjirVise.DTO.Models
{
    public class RegisterUserAndVolunteerModel
    {
        [Required]
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Phone { get; set; }
        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;
        [Required/*, MinLength(8, ErrorMessage = "Password needs to be at least 8 characters long.")*/]
        public string Password { get; set; } = string.Empty;
        [Required/*, Compare("Password")*/]
        public string ConfirmPassword { get; set; } = string.Empty;
    }
}
