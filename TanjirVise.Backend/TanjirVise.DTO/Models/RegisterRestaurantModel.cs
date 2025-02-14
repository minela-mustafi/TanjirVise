using System.ComponentModel.DataAnnotations;

namespace TanjirVise.DTO.Models
{
    public class RegisterRestaurantModel
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string Address { get; set; }
        public string Phone { get; set; }
        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;
        [Required/*, MinLength(8, ErrorMessage = "Password needs to be at least 8 characters long.")*/]
        public string Password { get; set; } = string.Empty;
        [Required/*, Compare("Password")*/]
        public string ConfirmPassword { get; set; } = string.Empty;
    }
}
