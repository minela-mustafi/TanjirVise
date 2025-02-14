using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TanjirVise.DAL;
using TanjirVise.Service;
using TanjirVise.Service.Factory;

namespace TanjirVise.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {
        private readonly UnitOfWork unitOfWork;

        public TestController(TanjirViseContext context)
        {
            this.unitOfWork = new UnitOfWork(context);
        }

        [HttpGet("foodrequests")]
        [EnableCors("_myAllowSpecificOrigins")]
        public async Task<IActionResult> GetAllFoodRequests()
        {
            try
            {
                var response = await unitOfWork.FoodRequests.Get();
                return Ok(response.Select(r => r.CreateModel()));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
