using TanjirVise.DTO;
using TanjirVise.DTO.Models;

namespace TanjirVise.Service.Factory
{
    public static class FoodRequestFactory
    {
        public static FoodRequest CreateFoodRequest(this FoodRequestModel foodRequestModel)
        {
            return new FoodRequest
            {
                Quantity = foodRequestModel.Quantity,
                Note = foodRequestModel.Note,
                Destination = foodRequestModel.Destination,
                Status = RequestStatus.Open
            };
        }

        public static FoodRequestModel CreateModel(this FoodRequest foodRequest)
        {
            var foodRequestModel = new FoodRequestModel
            {
                Id = foodRequest.Id,
                Quantity = foodRequest.Quantity,
                Note = foodRequest.Note,
                Destination = foodRequest.Destination,
                Status = foodRequest.Status,
                UserId = foodRequest.User.Id,
                UserName = foodRequest.User.Name
            };

            if (foodRequest.Volunteer != null)
            {
                foodRequestModel.VolunteerId = foodRequest.Volunteer.Id;
                foodRequestModel.VolunteerName = foodRequest.Volunteer.Name;
            }

            if (foodRequest.Restaurant != null)
            {
                foodRequestModel.RestaurantId = foodRequest.Restaurant.Id;
                foodRequestModel.RestaurantName = foodRequest.Restaurant.Name;
            }

            return foodRequestModel;
        }
    }
}
