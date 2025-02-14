using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TanjirVise.DTO;
using TanjirVise.DTO.Models;
using TanjirVise.Service;

namespace TanjirVise.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FoodRequestsController : ControllerBase
    {
        protected FoodRequestService foodRequestService;
        public FoodRequestsController(FoodRequestService foodRequestService)
        {
            this.foodRequestService = foodRequestService;
        }


        #region CREATE FOOD REQUEST
        [HttpPost("request-food"), Authorize(Roles = "User")]
        public async Task<IActionResult> RequestFood(FoodRequestModel request)
        {
            var response = await foodRequestService.RequestFood(request);

            if (!response.Success)
                return BadRequest(response.Message);
            return Ok(response.ResponseValue);
        }
        #endregion

        #region ASSIGN VOLUNTEER AND RESTAURANT
        [HttpPost("{requestId}/assign-volunteer"), Authorize(Roles = "Volunteer")]
        public async Task<IActionResult> AssignVolunteer(int requestId)
        {
            var response = await foodRequestService.AssignVolunteer(requestId);

            if (!response.Success)
                return BadRequest(response.Message);
            return Ok(response.ResponseValue);
        }


        [HttpPost("{requestId}/assign-restaurant"), Authorize(Roles = "Restaurant")]
        public async Task<IActionResult> AssignRestaurant(int requestId)
        {
            var response = await foodRequestService.AssignRestaurant(requestId);

            if (!response.Success)
                return BadRequest(response.Message);
            return Ok(response.ResponseValue);
        }
        #endregion

        #region GET FOOD REQUESTS
        [HttpGet("{requestId}"), Authorize(Roles = "Volunteer, Restaurant")]
        public async Task<IActionResult> GetFoodRequest(int requestId)
        {
            var response = await foodRequestService.GetFoodRequest(requestId);

            if (!response.Success)
                return BadRequest(response?.Message);
            return Ok(response.ResponseValue);
        }


        [HttpGet, Authorize(Roles = "Volunteer, Restaurant")]
        public async Task<IActionResult> GetAllFoodRequests()
        {
            var response = await foodRequestService.GetAllFoodRequests();

            if (!response.Success)
                return BadRequest(response?.Message);
            return Ok(response.ResponseValue);
        }


        [HttpGet("status/{requestStatus}"), Authorize(Roles = "Volunteer, Restaurant")]
        public async Task<IActionResult> GetFoodRequestsByStatus(RequestStatus requestStatus)
        {
            var response = await foodRequestService.GetFoodRequestsByStatus(requestStatus);

            if (!response.Success)
                return BadRequest(response?.Message);
            return Ok(response.ResponseValue);
        }


        [HttpGet("no-volunteer"), Authorize(Roles = "Volunteer, Restaurant")]
        public async Task<IActionResult> GetAllFoodRequestsWithoutVolunteer()
        {
            var response = await foodRequestService.GetAllFoodRequestsWithoutVolunteer();

            if (!response.Success)
                return BadRequest(response?.Message);
            return Ok(response.ResponseValue);
        }


        [HttpGet("no-restaurant"), Authorize(Roles = "Volunteer, Restaurant")]
        public async Task<IActionResult> GetAllFoodRequestsWithoutRestaurant()
        {
            var response = await foodRequestService.GetAllFoodRequestsWithoutRestaurant();

            if (!response.Success)
                return BadRequest(response?.Message);
            return Ok(response.ResponseValue);
        }
        #endregion
    }
}
