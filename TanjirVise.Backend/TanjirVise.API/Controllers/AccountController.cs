using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TanjirVise.DTO;
using TanjirVise.DTO.Models;
using TanjirVise.Service;

namespace TanjirVise.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        protected AccountService accountService;

        public AccountController(AccountService accountService)
        {
            this.accountService = accountService;
        }


        #region GET MY FOOD REQUESTS
        [HttpGet("my-food-requests/{requestId}"), Authorize]
        public async Task<IActionResult> GetMyFoodRequestById(int requestId)
        {
            var response = await accountService.GetMyFoodRequestById(requestId);

            if (!response.Success)
                return BadRequest(response.Message);
            return Ok(response.ResponseValue);
        }

        [HttpGet("my-food-requests"), Authorize]
        public async Task<IActionResult> GetMyFoodRequests()
        {
            var response = await accountService.GetMyFoodRequests();

            if (!response.Success)
                return BadRequest(response.Message);
            return Ok(response.ResponseValue);
        }

        [HttpGet("my-food-requests/status/{requestStatus}"), Authorize]
        public async Task<IActionResult> GetMyFoodRequestsByStatus(RequestStatus requestStatus)
        {
            var response = await accountService.GetMyFoodRequestsByStatus(requestStatus);

            if (!response.Success)
                return BadRequest(response.Message);
            return Ok(response.ResponseValue);
        }
        #endregion

        #region UNASSIGN FROM FOOD REQUEST
        [HttpPost("my-food-requests/unassign/{requestId}"), Authorize(Roles = "Volunteer, Restaurant")]
        public async Task<IActionResult> UnassignFromFoodRequest(int requestId)
        {
            var response = await accountService.UnassignFromFoodRequest(requestId);

            if (!response.Success)
                return BadRequest(response.Message);
            return Ok(response.ResponseValue);
        }
        #endregion

        #region CHANGE FOOD REQUEST STATUS
        [HttpPost("my-food-requests/change-status/{requestId}"), Authorize(Roles = "Volunteer")]
        public async Task<IActionResult> ChangeFoodRequestStatus(int requestId, RequestStatus requestStatus)
        {
            var response = await accountService.ChangeFoodRequestStatus(requestId, requestStatus);

            if (!response)
                return BadRequest("Food request not found or you're not assigned to this food request.");
            return Ok($"Status of food request set to: {requestStatus}");
        }
        #endregion

        #region DELETE FOOD REQUEST
        [HttpDelete("my-food-requests/delete/{requestId}"), Authorize(Roles = "User")]
        public async Task<IActionResult> DeleteFoodRequest(int requestId)
        {
            var response = await accountService.DeleteFoodRequest(requestId);

            if (!response)
                return BadRequest("Food request not found or you're not the creator of this food request.");
            return Ok("Food request successfully deleted.");
        }
        #endregion

        #region MY PROFILE
        [HttpGet("my-profile"), Authorize]
        public async Task<IActionResult> GetMyProfile()
        {
            var response = await accountService.GetMyProfile();

            if (!response.Success)
                return BadRequest(response.Message);
            return Ok(response.ResponseValue);
        }

        [HttpPost("my-profile/edit"), Authorize]
        public async Task<IActionResult> EditMyProfile(ProfileEditModel request)
        {
            var response = await accountService.EditMyProfile(request);

            if (!response.Success)
                return BadRequest(response.Message);
            return Ok(response.ResponseValue);
        }

        [HttpPost("my-profile/change-password"), Authorize]
        public async Task<IActionResult> ChangePassword(ChangePasswordModel request)
        {
            var response = await accountService.ChangePassword(request);

            if (!response.Item1)
                return BadRequest(response.Item2);
            return Ok("Password changed successfully.");
        }
        #endregion
    }
}
