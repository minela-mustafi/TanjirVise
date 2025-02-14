using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using TanjirVise.DAL;
using TanjirVise.DTO;
using TanjirVise.DTO.Models;
using TanjirVise.Service.Factory;

namespace TanjirVise.Service
{
    public class FoodRequestService
    {
        private readonly UnitOfWork unitOfWork;
        private readonly int userId;

        public FoodRequestService(TanjirViseContext context, IHttpContextAccessor httpContextAccessor)
        {
            this.unitOfWork = new UnitOfWork(context);
            this.userId = int.Parse(httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value);
        }


        #region CREATE FOOD REQUEST
        public async Task<ResponseModel<FoodRequestModel>> RequestFood(FoodRequestModel foodRequestModel)
        {
            var user = unitOfWork.Users.Get(this.userId).Result;
            if (user == null)
            {
                return new ResponseModel<FoodRequestModel>
                {
                    Message = "User not found.",
                    Success = false
                };
            }
            var foodRequest = foodRequestModel.CreateFoodRequest();
            foodRequest.Status = RequestStatus.Open;
            foodRequest.User = user;

            await unitOfWork.FoodRequests.Insert(foodRequest);
            await unitOfWork.Save();

            return new ResponseModel<FoodRequestModel>
            {
                ResponseValue = foodRequest.CreateModel(),
                Message = "Food request created.",
                Success = true
            };
        }
        #endregion

        #region ASSIGN VOLUNTEER AND RESTAURANT
        public async Task<ResponseModel<FoodRequestModel>> AssignVolunteer(int foodRequestId)
        {
            var volunteer = unitOfWork.Volunteers.Get(this.userId).Result;
            if (volunteer == null)
            {
                return new ResponseModel<FoodRequestModel>
                {
                    Message = "User not found.",
                    Success = false
                };
            }

            var foodRequest = await unitOfWork.FoodRequests.Get(foodRequestId);
            if (foodRequest.Volunteer != null)
            {
                return new ResponseModel<FoodRequestModel>
                {
                    Message = "Volunteer already assigned.",
                    Success = false
                };
            }

            foodRequest.Volunteer = volunteer;

            await unitOfWork.FoodRequests.Update(foodRequest, foodRequestId);
            await unitOfWork.Save();

            return new ResponseModel<FoodRequestModel>
            {
                ResponseValue = foodRequest.CreateModel(),
                Message = "Volunteer assigned to the food request.",
                Success = true
            };
        }

        public async Task<ResponseModel<FoodRequestModel>> AssignRestaurant(int foodRequestId)
        {
            var restaurant = unitOfWork.Restaurants.Get(this.userId).Result;
            if (restaurant == null)
            {
                return new ResponseModel<FoodRequestModel>
                {
                    Message = "User not found.",
                    Success = false
                };
            }

            var foodRequest = await unitOfWork.FoodRequests.Get(foodRequestId);
            if (foodRequest.Restaurant != null)
            {
                return new ResponseModel<FoodRequestModel>
                {
                    Message = "Restaurant already assigned.",
                    Success = false
                };
            }

            foodRequest.Restaurant = restaurant;
            await unitOfWork.FoodRequests.Update(foodRequest, foodRequestId);
            await unitOfWork.Save();

            return new ResponseModel<FoodRequestModel>
            {
                ResponseValue = foodRequest.CreateModel(),
                Message = "Restaurant assigned to the food request.",
                Success = true
            };
        }
        #endregion

        #region GET FOOD REQUESTS
        public async Task<ResponseModel<FoodRequestModel>> GetFoodRequest(int requestId)
        {
            var foodRequest = await unitOfWork.FoodRequests.Get(requestId);
            if (foodRequest == null)
            {
                return new ResponseModel<FoodRequestModel>
                {
                    Message = "Food request not found.",
                    Success = false
                };
            }

            return new ResponseModel<FoodRequestModel>
            {
                ResponseValue = foodRequest.CreateModel(),
                Message = "Food request.",
                Success = true
            };
        }

        public async Task<ResponseModel<IList<FoodRequestModel>>> GetAllFoodRequests()
        {
            var foodRequests = await unitOfWork.FoodRequests.Get();
            return new ResponseModel<IList<FoodRequestModel>>
            {
                ResponseValue = foodRequests.Select(fr => fr.CreateModel()).ToList(),
                Message = "A list of all food requests.",
                Success = true
            };
        }

        public async Task<ResponseModel<IList<FoodRequestModel>>> GetFoodRequestsByStatus(RequestStatus requestStatus)
        {
            var foodRequests = await unitOfWork.FoodRequests.Get(fr => fr.Status == requestStatus);
            return new ResponseModel<IList<FoodRequestModel>>
            {
                ResponseValue = foodRequests.Select(fr => fr.CreateModel()).ToList(),
                Message = $"A list of all {requestStatus.ToString().ToLower()} food requests.",
                Success = true
            };
        }

        public async Task<ResponseModel<IList<FoodRequestModel>>> GetAllFoodRequestsWithoutVolunteer()
        {
            var foodRequests = await unitOfWork.FoodRequests.Get(fr => fr.Volunteer == null);
            return new ResponseModel<IList<FoodRequestModel>>
            {
                ResponseValue = foodRequests.Select(fr => fr.CreateModel()).ToList(),
                Message = "A list of all food requests withouot volunteer assigned.",
                Success = true
            };
        }

        public async Task<ResponseModel<IList<FoodRequestModel>>> GetAllFoodRequestsWithoutRestaurant()
        {
            var foodRequests = await unitOfWork.FoodRequests.Get(fr => fr.Restaurant == null);
            return new ResponseModel<IList<FoodRequestModel>>
            {
                ResponseValue = foodRequests.Select(fr => fr.CreateModel()).ToList(),
                Message = "A list of all food requests withouot restaurant assigned.",
                Success = true
            };
        }
        #endregion
    }
}
