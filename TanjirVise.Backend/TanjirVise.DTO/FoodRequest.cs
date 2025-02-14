using System.ComponentModel.DataAnnotations;

namespace TanjirVise.DTO
{
    public class FoodRequest : BaseClass
    {
        [Required]
        public int Quantity { get; set; }
        public string Note { get; set; } = string.Empty;
        [Required]
        public string Destination { get; set; }
        public RequestStatus Status { get; set; }
        public virtual User User { get; set; }
        public virtual Volunteer? Volunteer { get; set; }
        public virtual Restaurant? Restaurant { get; set; }
    }
}
