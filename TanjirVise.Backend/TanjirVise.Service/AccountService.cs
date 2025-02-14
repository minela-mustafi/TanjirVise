using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System.Linq;
using System.Security.Claims;
using TanjirVise.DAL;
using TanjirVise.DTO;
using TanjirVise.DTO.Models;
using TanjirVise.Service.Factory;

namespace TanjirVise.Service
{
    public class AccountService
    {
        private readonly UnitOfWork unitOfWork;
        private readonly Helper helper;
        private readonly int userId;
        private readonly Role role;

        public AccountService(IConfiguration configuration, TanjirViseContext context, IHttpContextAccessor httpContextAccessor)
        {
            this.unitOfWork = new UnitOfWork(context);
            this.helper = new Helper(configuration);
            this.userId = int.Parse(httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value);
            this.role = Enum.Parse<Role>(httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Role).Value);
        }


        #region MY FOOD REQUEST BY ID
        public async Task<ResponseModel<FoodRequestModel>> GetMyFoodRequestById(int requestId)
        {
            if (this.role == Role.User)
                return await GetFoodRequestByIdForUser(requestId);

            if (this.role == Role.Volunteer)
                return await GetFoodRequestByIdForVoluteer(requestId);

            if (this.role == Role.Restaurant)
                return await GetFoodRequestByIdForRestaurant(requestId);

            return new ResponseModel<FoodRequestModel>
            {
                Message = "Something went wrong.",
                Success = false
            };
        }

        private async Task<ResponseModel<FoodRequestModel>> GetFoodRequestByIdForUser(int requestId)
        {
            var user = await unitOfWork.Users.Get(this.userId);
            if (user == null)
            {
                return new ResponseModel<FoodRequestModel>
                {
                    Message = "User not found.",
                    Success = false
                };
            }

            var foodRequest = user.FoodRequests.FirstOrDefault(fr => fr.Id == requestId);
            if (foodRequest == null)
            {
                return new ResponseModel<FoodRequestModel>
                {
                    Message = "Food request not found in your food requests.",
                    Success = false
                };
            }

            return new ResponseModel<FoodRequestModel>
            {
                ResponseValue = foodRequest.CreateModel(),
                Message = "All my food requests.",
                Success = true
            };
        }

        private async Task<ResponseModel<FoodRequestModel>> GetFoodRequestByIdForVoluteer(int requestId)
        {
            var volunteer = await unitOfWork.Volunteers.Get(this.userId);
            if (volunteer == null)
            {
                return new ResponseModel<FoodRequestModel>
                {
                    Message = "User not found.",
                    Success = false
                };
            }

            var foodRequest = volunteer.FoodRequests.FirstOrDefault(fr => fr.Id == requestId);
            if (foodRequest == null)
            {
                return new ResponseModel<FoodRequestModel>
                {
                    Message = "Food request not found in your food requests.",
                    Success = false
                };
            }

            return new ResponseModel<FoodRequestModel>
            {
                ResponseValue = foodRequest.CreateModel(),
                Message = "All my food requests.",
                Success = true
            };
        }

        private async Task<ResponseModel<FoodRequestModel>> GetFoodRequestByIdForRestaurant(int requestId)
        {
            var restaurant = await unitOfWork.Restaurants.Get(this.userId);
            if (restaurant == null)
            {
                return new ResponseModel<FoodRequestModel>
                {
                    Message = "User not found.",
                    Success = false
                };
            }

            var foodRequest = restaurant.FoodRequests.FirstOrDefault(fr => fr.Id == requestId);
            if (foodRequest == null)
            {
                return new ResponseModel<FoodRequestModel>
                {
                    Message = "Food request not found in your food requests.",
                    Success = false
                };
            }

            return new ResponseModel<FoodRequestModel>
            {
                ResponseValue = foodRequest.CreateModel(),
                Message = "All my food requests.",
                Success = true
            };
        }
        #endregion

        #region MY FOOD REQUESTS
        public async Task<ResponseModel<IList<FoodRequestModel>>> GetMyFoodRequests()
        {
            if (this.role == Role.User)
                return await GetMyFoodRequestsForUser();

            if (this.role == Role.Volunteer)
                return await GetMyFoodRequestsForVoluteer();

            if (this.role == Role.Restaurant)
                return await GetMyFoodRequestsForRestaurant();

            return new ResponseModel<IList<FoodRequestModel>>
            {
                Message = "Something went wrong.",
                Success = false
            };
        }

        private async Task<ResponseModel<IList<FoodRequestModel>>> GetMyFoodRequestsForUser()
        {
            var user = await unitOfWork.Users.Get(this.userId);
            if (user == null)
            {
                return new ResponseModel<IList<FoodRequestModel>>
                {
                    Message = "User not found.",
                    Success = false
                };
            }

            return new ResponseModel<IList<FoodRequestModel>>
            {
                ResponseValue = user.FoodRequests.Select(fr => fr.CreateModel()).ToList(),
                Message = "All my food requests.",
                Success = true
            };
        }

        private async Task<ResponseModel<IList<FoodRequestModel>>> GetMyFoodRequestsForVoluteer()
        {
            var volunteer = await unitOfWork.Volunteers.Get(this.userId);
            if (volunteer == null)
            {
                return new ResponseModel<IList<FoodRequestModel>>
                {
                    Message = "User not found.",
                    Success = false
                };
            }

            return new ResponseModel<IList<FoodRequestModel>>
            {
                ResponseValue = volunteer.FoodRequests.Select(fr => fr.CreateModel()).ToList(),
                Message = "All my food requests.",
                Success = true
            };
        }

        private async Task<ResponseModel<IList<FoodRequestModel>>> GetMyFoodRequestsForRestaurant()
        {
            var restaurant = await unitOfWork.Restaurants.Get(this.userId);
            if (restaurant == null)
            {
                return new ResponseModel<IList<FoodRequestModel>>
                {
                    Message = "User not found.",
                    Success = false
                };
            }

            return new ResponseModel<IList<FoodRequestModel>>
            {
                ResponseValue = restaurant.FoodRequests.Select(fr => fr.CreateModel()).ToList(),
                Message = "All my food requests.",
                Success = true
            };
        }
        #endregion

        #region MY FOOD REQUESTS BY STATUS
        public async Task<ResponseModel<IList<FoodRequestModel>>> GetMyFoodRequestsByStatus(RequestStatus requestStatus)
        {
            if (this.role == Role.User)
                return await GetMyFoodRequestsForUserByStatus(requestStatus);

            if (this.role == Role.Volunteer)
                return await GetMyFoodRequestsForVoluteerByStatus(requestStatus);

            if (this.role == Role.Restaurant)
                return await GetMyFoodRequestsForRestaurantByStatus(requestStatus);

            return new ResponseModel<IList<FoodRequestModel>>
            {
                Message = "Something went wrong.",
                Success = false
            };
        }

        private async Task<ResponseModel<IList<FoodRequestModel>>> GetMyFoodRequestsForUserByStatus(RequestStatus requestStatus)
        {
            var user = await unitOfWork.Users.Get(this.userId);
            if (user == null)
            {
                return new ResponseModel<IList<FoodRequestModel>>
                {
                    Message = "User not found.",
                    Success = false
                };
            }

            return new ResponseModel<IList<FoodRequestModel>>
            {
                ResponseValue = user.FoodRequests.Where(fr => fr.Status == requestStatus)
                                                 .Select(fr => fr.CreateModel())
                                                 .ToList(),
                Message = "All my food requests.",
                Success = true
            };
        }

        private async Task<ResponseModel<IList<FoodRequestModel>>> GetMyFoodRequestsForVoluteerByStatus(RequestStatus requestStatus)
        {
            var volunteer = await unitOfWork.Volunteers.Get(this.userId);
            if (volunteer == null)
            {
                return new ResponseModel<IList<FoodRequestModel>>
                {
                    Message = "User not found.",
                    Success = false
                };
            }

            return new ResponseModel<IList<FoodRequestModel>>
            {
                ResponseValue = volunteer.FoodRequests.Where(fr => fr.Status == requestStatus)
                                                      .Select(fr => fr.CreateModel())
                                                      .ToList(),
                Message = "All my food requests.",
                Success = true
            };
        }

        private async Task<ResponseModel<IList<FoodRequestModel>>> GetMyFoodRequestsForRestaurantByStatus(RequestStatus requestStatus)
        {
            var restaurant = await unitOfWork.Restaurants.Get(this.userId);
            if (restaurant == null)
            {
                return new ResponseModel<IList<FoodRequestModel>>
                {
                    Message = "User not found.",
                    Success = false
                };
            }

            return new ResponseModel<IList<FoodRequestModel>>
            {
                ResponseValue = restaurant.FoodRequests.Where(fr => fr.Status == requestStatus)
                                                       .Select(fr => fr.CreateModel())
                                                       .ToList(),
                Message = "All my food requests.",
                Success = true
            };
        }
        #endregion

        #region UNASSIGN FROM FOOD REQUEST
        public async Task<ResponseModel<FoodRequestModel>> UnassignFromFoodRequest(int foodRequestId)
        {
            if (this.role == Role.Volunteer)
                return await UnaasignVolunteer(foodRequestId);

            if (this.role == Role.Restaurant)
                return await UnassignRestaurant(foodRequestId);

            return new ResponseModel<FoodRequestModel>
            {
                Message = "Something went wrong.",
                Success = false
            };
        }

        private async Task<ResponseModel<FoodRequestModel>> UnaasignVolunteer(int foodRequestId)
        {
            var foodRequest = await unitOfWork.FoodRequests.Get(foodRequestId);
            if (foodRequest == null)
            {
                return new ResponseModel<FoodRequestModel>
                {
                    Message = "FoodRequest not found.",
                    Success = false
                };
            }

            if (foodRequest.Volunteer == null || foodRequest.Volunteer.Id != this.userId)
            {
                return new ResponseModel<FoodRequestModel>
                {
                    Message = "You're not assigned to this food request.",
                    Success = false
                };
            }

            foodRequest.Volunteer = null;
            await unitOfWork.FoodRequests.Update(foodRequest, foodRequestId);
            await unitOfWork.Save();

            return new ResponseModel<FoodRequestModel>
            {
                ResponseValue = foodRequest.CreateModel(),
                Message = "You were successfully unassigned from the food request.",
                Success = true
            };
        }

        private async Task<ResponseModel<FoodRequestModel>> UnassignRestaurant(int foodRequestId)
        {
            var foodRequest = await unitOfWork.FoodRequests.Get(foodRequestId);
            if (foodRequest == null)
            {
                return new ResponseModel<FoodRequestModel>
                {
                    Message = "FoodRequest not found.",
                    Success = false
                };
            }

            if (foodRequest.Restaurant == null || foodRequest.Restaurant.Id != this.userId)
            {
                return new ResponseModel<FoodRequestModel>
                {
                    Message = "You're not assigned to this food request.",
                    Success = false
                };
            }

            foodRequest.Restaurant = null;
            await unitOfWork.FoodRequests.Update(foodRequest, foodRequestId);
            await unitOfWork.Save();

            return new ResponseModel<FoodRequestModel>
            {
                ResponseValue = foodRequest.CreateModel(),
                Message = "You were successfully unassigned from the food request.",
                Success = true
            };
        }

        #endregion

        #region CHANGE FOOD REQUEST STATUS
        public async Task<bool> ChangeFoodRequestStatus(int foodRequestId, RequestStatus requestStatus)
        {
            var foodRequest = await unitOfWork.FoodRequests.Get(foodRequestId);
            if (foodRequest == null 
                || foodRequest.Volunteer == null 
                || foodRequest.Volunteer.Id != this.userId)
                return false;

            foodRequest.Status = requestStatus;
            await unitOfWork.FoodRequests.Update(foodRequest, foodRequestId);
            await unitOfWork.Save();
            return true;
        }
        #endregion

        #region DELETE FOOD REQUEST
        public async Task<bool> DeleteFoodRequest(int foodRequestId)
        {
            var foodRequest = await unitOfWork.FoodRequests.Get(foodRequestId);
            if (foodRequest == null || foodRequest.User.Id != this.userId)
                return false;

            var deleted = await unitOfWork.FoodRequests.Delete(foodRequestId);
            await unitOfWork.Save();
            return deleted;
        }
        #endregion

        #region GET PROFILE
        public async Task<ResponseModel<ProfileModel>> GetMyProfile()
        {
            if (this.role == Role.User)
                return await GetUserProfile();

            if (this.role == Role.Volunteer)
                return await GetVolunteerProfile();

            if (this.role == Role.Restaurant)
                return await GetRestaurantProfile();

            return new ResponseModel<ProfileModel>
            {
                Message = "Something went wrong.",
                Success = false
            };
        }

        public async Task<ResponseModel<ProfileModel>> GetUserProfile()
        {
            var user = await unitOfWork.Users.Get(this.userId);
            if (user == null)
            {
                return new ResponseModel<ProfileModel>
                {
                    Message = "User not found.",
                    Success = false
                };
            }

            return new ResponseModel<ProfileModel>
            {
                ResponseValue = user.CreateModel(),
                Message = "Your user profile.",
                Success = true
            };
        }

        public async Task<ResponseModel<ProfileModel>> GetVolunteerProfile()
        {
            var volunteer = await unitOfWork.Volunteers.Get(this.userId);
            if (volunteer == null)
            {
                return new ResponseModel<ProfileModel>
                {
                    Message = "User not found.",
                    Success = false
                };
            }

            return new ResponseModel<ProfileModel>
            {
                ResponseValue = volunteer.CreateModel(),
                Message = "Your user profile.",
                Success = true
            };
        }

        public async Task<ResponseModel<ProfileModel>> GetRestaurantProfile()
        {
            var restaurant = await unitOfWork.Restaurants.Get(this.userId);
            if (restaurant == null)
            {
                return new ResponseModel<ProfileModel>
                {
                    Message = "User not found.",
                    Success = false
                };
            }

            return new ResponseModel<ProfileModel>
            {
                ResponseValue = restaurant.CreateModel(),
                Message = "Your user profile.",
                Success = true
            };
        }
        #endregion

        #region EDIT PROFILE
        public async Task<ResponseModel<ProfileModel>> EditMyProfile(ProfileEditModel editProfileModel)
        {
            if (this.role == Role.User)
                return await EditUserProfile(editProfileModel);

            if (this.role == Role.Volunteer)
                return await EditVolunteerProfile(editProfileModel);

            if (this.role == Role.Restaurant)
                return await EditRestaurantProfile(editProfileModel);

            return new ResponseModel<ProfileModel>
            {
                Message = "Something went wrong.",
                Success = false
            };
        }

        private async Task<ResponseModel<ProfileModel>> EditUserProfile(ProfileEditModel editProfileModel)
        {
            var user = await unitOfWork.Users.Get(this.userId);
            if (user == null)
            {
                return new ResponseModel<ProfileModel>
                {
                    Message = "User not found.",
                    Success = false
                };
            }

            user.Name = editProfileModel.Name;
            user.Surname = editProfileModel.Surname;
            user.Phone = editProfileModel.Phone;

            await unitOfWork.Users.Update(user, userId);
            await unitOfWork.Save();

            return new ResponseModel<ProfileModel>
            {
                ResponseValue = user.CreateModel(),
                Message = "Changes successfully made.",
                Success = true
            };
        }

        private async Task<ResponseModel<ProfileModel>> EditVolunteerProfile(ProfileEditModel editProfileModel)
        {
            var volunteer = await unitOfWork.Volunteers.Get(this.userId);
            if (volunteer == null)
            {
                return new ResponseModel<ProfileModel>
                {
                    Message = "User not found.",
                    Success = false
                };
            }

            volunteer.Name = editProfileModel.Name;
            volunteer.Surname = editProfileModel.Surname;
            volunteer.Phone = editProfileModel.Phone;

            await unitOfWork.Volunteers.Update(volunteer, userId);
            await unitOfWork.Save();

            return new ResponseModel<ProfileModel>
            {
                ResponseValue = volunteer.CreateModel(),
                Message = "Changes successfully made.",
                Success = true
            };
        }

        private async Task<ResponseModel<ProfileModel>> EditRestaurantProfile(ProfileEditModel editProfileModel)
        {
            var restaurant = await unitOfWork.Restaurants.Get(this.userId);
            if (restaurant == null)
            {
                return new ResponseModel<ProfileModel>
                {
                    Message = "User not found.",
                    Success = false
                };
            }

            restaurant.Name = editProfileModel.RestaurantName;
            restaurant.Address = editProfileModel.Address;
            restaurant.Phone = editProfileModel.Phone;

            await unitOfWork.Restaurants.Update(restaurant, userId);
            await unitOfWork.Save();

            return new ResponseModel<ProfileModel>
            {
                ResponseValue = restaurant.CreateModel(),
                Message = "Changes successfully made.",
                Success = true
            };
        }
        #endregion

        #region CHANGE PASSWORD
        public async Task<(bool, string)> ChangePassword(ChangePasswordModel changePassword)
        {
            if (this.role == Role.User)
                return await ChangePasswordForUser(changePassword);

            if (this.role == Role.Volunteer || this.role == Role.Admin)
                return await ChangePasswordForVolunteer(changePassword);

            if (this.role == Role.Restaurant)
                return await ChangePasswordForRestaurant(changePassword);

            return (false, "Something went wrong.");
        }

        private async Task<(bool, string)> ChangePasswordForUser(ChangePasswordModel changePassword)
        {
            var user = await unitOfWork.Users.Get(this.userId);
            if (user == null)
                return (false, "User not found.");

            if (changePassword.OldPassword == null || !helper.VerifyPasswordHash(changePassword.OldPassword, user.PasswordHash, user.PasswordSalt))
                return (false, "Password incorrect.");

            if (changePassword.Password != changePassword.ConfirmPassword)
                return (false, "Confirm password does not match the new password.");

            helper.CreatePasswordHash(changePassword.Password, out byte[] passwordHash, out byte[] passwordSalt);

            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;
            user.PasswordResetToken = null;
            user.ResetTokenExpires = null;

            await unitOfWork.Users.Update(user, user.Id);
            await unitOfWork.Save();

            return (true, "Password changed successfully.");
        }

        private async Task<(bool, string)> ChangePasswordForVolunteer(ChangePasswordModel changePassword)
        {
            var volunteer = await unitOfWork.Volunteers.Get(this.userId);
            if (volunteer == null)
                return (false, "User not found.");

            if (changePassword.OldPassword == null || !helper.VerifyPasswordHash(changePassword.OldPassword, volunteer.PasswordHash, volunteer.PasswordSalt))
                return (false, "Password incorrect.");

            helper.CreatePasswordHash(changePassword.Password, out byte[] passwordHash, out byte[] passwordSalt);

            volunteer.PasswordHash = passwordHash;
            volunteer.PasswordSalt = passwordSalt;
            volunteer.PasswordResetToken = null;
            volunteer.ResetTokenExpires = null;

            await unitOfWork.Volunteers.Update(volunteer, volunteer.Id);
            await unitOfWork.Save();

            return (true, "Password changed successfully.");
        }

        private async Task<(bool, string)> ChangePasswordForRestaurant(ChangePasswordModel changePassword)
        {
            var restaurant = await unitOfWork.Restaurants.Get(this.userId);
            if (restaurant == null)
                return (false, "User not found.");

            if (changePassword.OldPassword == null || !helper.VerifyPasswordHash(changePassword.OldPassword, restaurant.PasswordHash, restaurant.PasswordSalt))
                return (false, "Password incorrect.");

            helper.CreatePasswordHash(changePassword.Password, out byte[] passwordHash, out byte[] passwordSalt);

            restaurant.PasswordHash = passwordHash;
            restaurant.PasswordSalt = passwordSalt;
            restaurant.PasswordResetToken = null;
            restaurant.ResetTokenExpires = null;

            await unitOfWork.Restaurants.Update(restaurant, restaurant.Id);
            await unitOfWork.Save();

            return (true, "Password changed successfully.");
        }
        #endregion
    }
}
