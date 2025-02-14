namespace TanjirVise.DTO.Models
{
    public class ProfileModel
    {
        public string Email { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Surname { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string RestaurantName { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public Role Role { get; set; }
        public virtual IList<FoodRequestModel> FoodRequests { get; set; } = new List<FoodRequestModel>();
    }
}
