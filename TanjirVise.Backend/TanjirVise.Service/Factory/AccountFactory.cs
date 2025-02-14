using TanjirVise.DTO;
using TanjirVise.DTO.Models;

namespace TanjirVise.Service.Factory
{
    public static class AccountFactory
    {
        public static ProfileModel CreateModel(this User user)
        {
            return new ProfileModel
            {
                Email = user.Email,
                Name = user.Name,
                Surname = user.Surname,
                FullName = user.FullName,
                Phone = user.Phone,
                Role = user.Role,
                FoodRequests = user.FoodRequests.Select(fr => fr.CreateModel()).ToList()
            };
        }

        public static ProfileModel CreateModel(this Volunteer volunteer)
        {
            return new ProfileModel
            {
                Email = volunteer.Email,
                Name = volunteer.Name,
                Surname = volunteer.Surname,
                FullName = volunteer.FullName,
                Phone = volunteer.Phone,
                Role = volunteer.Role,
                FoodRequests = volunteer.FoodRequests.Select(fr => fr.CreateModel()).ToList()
            };
        }

        public static ProfileModel CreateModel(this Restaurant restaurant)
        {
            return new ProfileModel
            {
                Email = restaurant.Email,
                RestaurantName = restaurant.Name,
                Address = restaurant.Address,
                Phone = restaurant.Phone,
                Role = restaurant.Role,
                FoodRequests = restaurant.FoodRequests.Select(fr => fr.CreateModel()).ToList()
            };
        }
    }
}
