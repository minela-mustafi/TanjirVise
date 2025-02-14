using System.ComponentModel.DataAnnotations;

namespace TanjirVise.EmailService
{
    public class EmailModel
    {
        [Required]
        public string To { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
    }
}
