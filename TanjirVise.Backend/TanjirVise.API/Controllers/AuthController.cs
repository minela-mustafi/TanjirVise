using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TanjirVise.DAL;
using TanjirVise.DTO;
using TanjirVise.DTO.Models;
using TanjirVise.Service;

namespace TanjirVise.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        protected AuthService authService;

        public AuthController(AuthService authService)
        {
            this.authService = authService;
        }


        #region LOGIN
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginModel request)
        {
            var response = await authService.Login(request);
            if (!response.Success)
                return BadRequest(response.Message);
            return Ok(response.ResponseValue);
        }
        #endregion

        #region REGISTRATION
        [HttpPost("register/user")]
        public async Task<IActionResult> RegisterUser(RegisterUserAndVolunteerModel request)
        {
            var response = await authService.RegisterUser(request);
            if (!response.Success)
                return BadRequest(response.Message);

            var confirmationLink = Request.Scheme + "://"
                                   + Request.Host
                                   + Url.Action("VerifyEmail", "Auth",
                                                new { email = request.Email, role = Role.User, token = response.ResponseValue.VerificationToken });

            var emailSenderResponse = await authService.SendVerificationEmail(request.Email, confirmationLink);

            if (!emailSenderResponse.Success)
                return BadRequest(emailSenderResponse.Message);

            return Ok(response.Message + "\n" + "Please verify your email address through the verification email we have sent to you.");
        }

        [HttpPost("register/volunteer")]
        public async Task<IActionResult> RegisterVolunteer(RegisterUserAndVolunteerModel request)
        {
            var response = await authService.RegisterVolunteer(request);
            if (!response.Success)
                return BadRequest(response.Message);

            var confirmationLink = Request.Scheme + "://"
                                   + Request.Host
                                   + Url.Action("VerifyEmail", "Auth",
                                                new { email = request.Email, role = Role.Volunteer, token = response.ResponseValue.VerificationToken });

            var emailSenderResponse = await authService.SendVerificationEmail(request.Email, confirmationLink);

            if (!emailSenderResponse.Success)
                return BadRequest(emailSenderResponse.Message);

            return Ok(response.Message + "\n" + "Please verify your email address through the verification email we have sent to you.");
        }

        [HttpPost("register/restaurant")]
        public async Task<IActionResult> RegisterRestaurant(RegisterRestaurantModel request)
        {
            var response = await authService.RegisterRestaurant(request);
            if (!response.Success)
                return BadRequest(response.Message);

            var confirmationLink = Request.Scheme + "://"
                                   + Request.Host
                                   + Url.Action("VerifyEmail", "Auth",
                                                new { email = request.Email, role = Role.Restaurant, token = response.ResponseValue.VerificationToken });

            var emailSenderResponse = await authService.SendVerificationEmail(request.Email, confirmationLink);

            return Ok(response.Message + "\n" + "Please verify your email address through the verification email we have sent to you.");
        }
        #endregion

        #region VERIFY EMAIL
        [HttpGet("verify-email")]
        public async Task<IActionResult> VerifyEmail(string email, Role role, string token)
        {
            var verified = await authService.VerifyEmail(email, role, token);
            if (!verified)
                return BadRequest("Invalid email or token.");
            return Ok("User verified.");
        }
        #endregion

        #region RESET PASSWORD
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(string email, Role role)
        {
            var response = await authService.ForgotPassword(email, role);

            if (!response.Success)
                return BadRequest(response.Message);

            var resetPasswordLink = Request.Scheme + "://"
                                   + Request.Host
                                   + Url.Action("GetResetToken", "Auth",
                                                new { resetToken = response.ResponseValue });
            var emailSenderResponse = await authService.SendResetPasswordEmail(email, resetPasswordLink);

            if (!emailSenderResponse.Success)
                return BadRequest(emailSenderResponse.Message);

            return Ok(response.Message + "\n" + "Please reset your password through the email we have sent to you.");
        }

        [HttpGet("get-reset-token")]
        public async Task<IActionResult> GetResetToken(string resetToken)
        {
            return Ok($"Please use this token to reset your password: {resetToken}.");
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordModel request)
        {
            var reset = await authService.ResetPassword(request);
            if (!reset)
                return BadRequest("Invalid token.");
            return Ok("Password successfully reset.");
        }
        #endregion
    }
}
