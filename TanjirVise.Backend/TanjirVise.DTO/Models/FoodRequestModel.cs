using System.ComponentModel.DataAnnotations;

namespace TanjirVise.DTO.Models
{
    public class FoodRequestModel
    {
        [Required]
        public int Id { get; set; }
        public int Quantity { get; set; }
        public string Note { get; set; }
        public string Destination { get; set; }
        public RequestStatus Status { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public int? VolunteerId { get; set; }
        public string VolunteerName { get; set; } = string.Empty;
        public int? RestaurantId { get; set; }
        public string RestaurantName { get; set; } = string.Empty;
    }
}
