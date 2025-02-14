using Microsoft.Extensions.Configuration;
using TanjirVise.DAL;
using TanjirVise.DTO;
using TanjirVise.DTO.Models;
using TanjirVise.EmailService;

namespace TanjirVise.Service
{
    public class AuthService
    {
        private readonly IConfiguration configuration;
        private readonly UnitOfWork unitOfWork;
        private readonly IEmailSender emailSender;
        private readonly Helper helper;

        public AuthService(IConfiguration configuration, TanjirViseContext context, IEmailSender emailSender)
        {
            this.configuration = configuration;
            this.unitOfWork = new UnitOfWork(context);
            this.emailSender = emailSender;
            this.helper = new Helper(configuration);
        }

        #region REGISTRATION
        public async Task<ResponseModel<User>> RegisterUser(RegisterUserAndVolunteerModel registerRequest)
        {
            if (unitOfWork.Users.Get().Result.Any(u => u.Email == registerRequest.Email)
                || unitOfWork.Volunteers.Get().Result.Any(u => u.Email == registerRequest.Email)
                || unitOfWork.Restaurants.Get().Result.Any(u => u.Email == registerRequest.Email))
            {
                return new ResponseModel<User>
                {
                    Message = "User already exists.",
                    Success = false
                };
            }

            if (registerRequest.Password != registerRequest.ConfirmPassword)
                return new ResponseModel<User>
                {
                    Message = "Confirm password does not match the password.",
                    Success = false
                };

            helper.CreatePasswordHash(registerRequest.Password, out byte[] passwordHash, out byte[] passwordSalt);

            var user = new User()
            {
                Email = registerRequest.Email,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt,
                VerificationToken = helper.CreateRandomToken(),
                Name = registerRequest.Name,
                Surname = registerRequest.Surname,
                Phone = registerRequest.Phone
            };

            await unitOfWork.Users.Insert(user);
            await unitOfWork.Save();

            return new ResponseModel<User>
            {
                ResponseValue = user,
                Message = "User successfully created.",
                Success = true
            };
        }

        public async Task<ResponseModel<Volunteer>> RegisterVolunteer(RegisterUserAndVolunteerModel registerRequest)
        {
            if (unitOfWork.Users.Get().Result.Any(u => u.Email == registerRequest.Email)
                || unitOfWork.Volunteers.Get().Result.Any(u => u.Email == registerRequest.Email)
                || unitOfWork.Restaurants.Get().Result.Any(u => u.Email == registerRequest.Email))
            {
                return new ResponseModel<Volunteer>
                {
                    Message = "User already exists.",
                    Success = false
                };
            }

            if (registerRequest.Password != registerRequest.ConfirmPassword)
                return new ResponseModel<Volunteer>
                {
                    Message = "Confirm password does not match the password.",
                    Success = false
                };

            helper.CreatePasswordHash(registerRequest.Password, out byte[] passwordHash, out byte[] passwordSalt);

            var volunteer = new Volunteer()
            {
                Email = registerRequest.Email,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt,
                VerificationToken = helper.CreateRandomToken(),
                Name = registerRequest.Name,
                Surname = registerRequest.Surname,
                Phone = registerRequest.Phone
            };

            await unitOfWork.Volunteers.Insert(volunteer);
            await unitOfWork.Save();

            return new ResponseModel<Volunteer>
            {
                ResponseValue = volunteer,
                Message = "User successfully created.",
                Success = true
            };
        }

        public async Task<ResponseModel<Restaurant>> RegisterRestaurant(RegisterRestaurantModel registerRequest)
        {
            if (unitOfWork.Users.Get().Result.Any(u => u.Email == registerRequest.Email)
                || unitOfWork.Volunteers.Get().Result.Any(u => u.Email == registerRequest.Email)
                || unitOfWork.Restaurants.Get().Result.Any(u => u.Email == registerRequest.Email))
            {
                return new ResponseModel<Restaurant>
                {
                    Message = "User already exists.",
                    Success = false
                };
            }

            if (registerRequest.Password != registerRequest.ConfirmPassword)
                return new ResponseModel<Restaurant>
                {
                    Message = "Confirm password does not match the password.",
                    Success = false
                };

            helper.CreatePasswordHash(registerRequest.Password, out byte[] passwordHash, out byte[] passwordSalt);

            var restaurant = new Restaurant()
            {
                Email = registerRequest.Email,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt,
                VerificationToken = helper.CreateRandomToken(),
                Name = registerRequest.Name,
                Address = registerRequest.Address,
                Phone = registerRequest.Phone
            };

            await unitOfWork.Restaurants.Insert(restaurant);
            await unitOfWork.Save();

            return new ResponseModel<Restaurant>
            {
                ResponseValue = restaurant,
                Message = "User successfully created.",
                Success = true
            };
        }
        #endregion

        #region LOGIN
        public async Task<ResponseModel<string>> Login(LoginModel loginRequest)
        {
            BaseUser? user = await GetUserByEmail(loginRequest.Email/*, loginRequest.Role*/);

            if (user == null || !helper.VerifyPasswordHash(loginRequest.Password, user.PasswordHash, user.PasswordSalt))
            {
                return new ResponseModel<string>
                {
                    Message = "Email or password incorrect.",
                    Success = false
                };
            }

            if (user.VerifiedAt == null)
            {
                return new ResponseModel<string>
                {
                    Message = "Email not verified.",
                    Success = false
                };
            }

            string token = helper.CreateJWT(user);
            return new ResponseModel<string>
            {
                ResponseValue = token,
                Message = "User successfully logged in.",
                Success = true
            };
        }
        #endregion

        #region VERIFY EMAIL
        public async Task<bool> VerifyEmail(string email, Role role, string token)
        {
            if (role == Role.User)
                return await VerifyUserEmail(email, token);

            if (role == Role.Volunteer || role == Role.Admin)
                return await VerifyVolunteerEmail(email, token);

            if (role == Role.Restaurant)
                return await VerifyRestaurantEmail(email, token);

            return false;
        }

        private async Task<bool> VerifyUserEmail(string email, string token)
        {
            var user = (await unitOfWork.Users.Get(u => u.Email == email)).FirstOrDefault();
            if (user == null || user.VerificationToken == null || user.VerificationToken != token)
                return false;

            user.VerifiedAt = DateTime.Now;
            await unitOfWork.Users.Update(user, user.Id);
            await unitOfWork.Save();

            return true;
        }

        private async Task<bool> VerifyVolunteerEmail(string email, string token)
        {
            var volunteer = (await unitOfWork.Volunteers.Get(v => v.Email == email)).FirstOrDefault();
            if (volunteer == null || volunteer.VerificationToken == null || volunteer.VerificationToken != token)
                return false;

            volunteer.VerifiedAt = DateTime.Now;
            await unitOfWork.Volunteers.Update(volunteer, volunteer.Id);
            await unitOfWork.Save();

            return true;
        }

        private async Task<bool> VerifyRestaurantEmail(string email, string token)
        {
            var restaurant = (await unitOfWork.Restaurants.Get(r => r.Email == email)).FirstOrDefault();
            if (restaurant == null || restaurant.VerificationToken == null || restaurant.VerificationToken != token)
                return false;

            restaurant.VerifiedAt = DateTime.Now;
            await unitOfWork.Restaurants.Update(restaurant, restaurant.Id);
            await unitOfWork.Save();

            return true;
        }
        #endregion

        #region FORGOT PASSWORD 
        public async Task<ResponseModel<string>> ForgotPassword(string email, Role role)
        {
            if (role == Role.User)
                return await ForgotUserPassword(email);

            if (role == Role.Volunteer || role == Role.Admin)
                return await ForgotVolunteerPassword(email);

            if (role == Role.Restaurant)
                return await ForgotRestaurantPassword(email);

            return new ResponseModel<string>
            {
                Message = "Something went wrong.",
                Success = false
            };
        }

        public async Task<ResponseModel<string>> ForgotUserPassword(string email)
        {
            var user = (await unitOfWork.Users.Get(u => u.Email == email)).FirstOrDefault();
            if (user == null)
            {
                return new ResponseModel<string>
                {
                    Message = "User not found.",
                    Success = false
                };
            }

            user.PasswordResetToken = helper.CreateRandomToken();
            user.ResetTokenExpires = DateTime.Now.AddDays(1);
            await unitOfWork.Users.Update(user, user.Id);
            await unitOfWork.Save();

            return new ResponseModel<string>
            {
                ResponseValue = user.PasswordResetToken,
                Message = "You can reset your passwor now.",
                Success = true
            };
        }

        public async Task<ResponseModel<string>> ForgotVolunteerPassword(string email)
        {
            var volunteer = (await unitOfWork.Volunteers.Get(u => u.Email == email)).FirstOrDefault();
            if (volunteer == null)
            {
                return new ResponseModel<string>
                {
                    Message = "User not found.",
                    Success = false
                };
            }

            volunteer.PasswordResetToken = helper.CreateRandomToken();
            volunteer.ResetTokenExpires = DateTime.Now.AddDays(1);
            await unitOfWork.Volunteers.Update(volunteer, volunteer.Id);
            await unitOfWork.Save();

            return new ResponseModel<string>
            {
                ResponseValue = volunteer.PasswordResetToken,
                Message = "You can reset your passwor now.",
                Success = true
            };
        }

        public async Task<ResponseModel<string>> ForgotRestaurantPassword(string email)
        {
            var restaurant = (await unitOfWork.Restaurants.Get(u => u.Email == email)).FirstOrDefault();
            if (restaurant == null)
            {
                return new ResponseModel<string>
                {
                    Message = "User not found.",
                    Success = false
                };
            }

            restaurant.PasswordResetToken = helper.CreateRandomToken();
            restaurant.ResetTokenExpires = DateTime.Now.AddDays(1);
            await unitOfWork.Restaurants.Update(restaurant, restaurant.Id);
            await unitOfWork.Save();

            return new ResponseModel<string>
            {
                ResponseValue = restaurant.PasswordResetToken,
                Message = "You can reset your passwor now.",
                Success = true
            };
        }
        #endregion

        #region PASSWORD RESET
        public async Task<bool> ResetPassword(ResetPasswordModel resetPasswordRequest)
        {
            if (resetPasswordRequest.Role == Role.User)
                return await ResetUserPassword(resetPasswordRequest);

            if (resetPasswordRequest.Role == Role.Volunteer || resetPasswordRequest.Role == Role.Admin)
                return await ResetVolunteerPassword(resetPasswordRequest);

            if (resetPasswordRequest.Role == Role.Restaurant)
                return await ResetRestaurantPassword(resetPasswordRequest);

            return false;
        }

        public async Task<bool> ResetUserPassword(ResetPasswordModel resetPasswordRequest)
        {
            var user = (await unitOfWork.Users.Get(u => u.Email == resetPasswordRequest.Email)).FirstOrDefault();
            if (user == null || user.ResetTokenExpires < DateTime.Now)
                return false;

            helper.CreatePasswordHash(resetPasswordRequest.Password, out byte[] passwordHash, out byte[] passwordSalt);

            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;
            user.PasswordResetToken = null;
            user.ResetTokenExpires = null;

            await unitOfWork.Users.Update(user, user.Id);
            await unitOfWork.Save();

            return true;
        }

        public async Task<bool> ResetVolunteerPassword(ResetPasswordModel resetPasswordRequest)
        {
            var volunteer = (await unitOfWork.Volunteers.Get(v => v.Email == resetPasswordRequest.Email)).FirstOrDefault();
            if (volunteer == null || volunteer.ResetTokenExpires < DateTime.Now)
                return false;

            helper.CreatePasswordHash(resetPasswordRequest.Password, out byte[] passwordHash, out byte[] passwordSalt);

            volunteer.PasswordHash = passwordHash;
            volunteer.PasswordSalt = passwordSalt;
            volunteer.PasswordResetToken = null;
            volunteer.ResetTokenExpires = null;

            await unitOfWork.Volunteers.Update(volunteer, volunteer.Id);
            await unitOfWork.Save();

            return true;
        }

        public async Task<bool> ResetRestaurantPassword(ResetPasswordModel resetPasswordRequest)
        {
            var restaurant = (await unitOfWork.Restaurants.Get(r => r.Email == resetPasswordRequest.Email)).FirstOrDefault();
            if (restaurant == null || restaurant.ResetTokenExpires < DateTime.Now)
                return false;

            helper.CreatePasswordHash(resetPasswordRequest.Password, out byte[] passwordHash, out byte[] passwordSalt);

            restaurant.PasswordHash = passwordHash;
            restaurant.PasswordSalt = passwordSalt;
            restaurant.PasswordResetToken = null;
            restaurant.ResetTokenExpires = null;

            await unitOfWork.Restaurants.Update(restaurant, restaurant.Id);
            await unitOfWork.Save();

            return true;
        }
        #endregion


        private async Task<BaseUser?> GetUserByEmail(string email/*, Role role*/)
        {
            BaseUser? user = (await unitOfWork.Users.Get(u => u.Email == email)).FirstOrDefault();
            if (user == null)
                user = (await unitOfWork.Volunteers.Get(v => v.Email == email)).FirstOrDefault();
            if (user == null)
                user = (await unitOfWork.Restaurants.Get(r => r.Email == email)).FirstOrDefault();

            return user;

            //if (role == Role.User)
            //    return (await unitOfWork.Users.Get(u => u.Email == email)).FirstOrDefault();

            //if (role == Role.Volunteer || role == Role.Admin)
            //    return (await unitOfWork.Volunteers.Get(v => v.Email == email)).FirstOrDefault();

            //if (role == Role.Restaurant)
            //    return (await unitOfWork.Restaurants.Get(r => r.Email == email)).FirstOrDefault();

            //return null;
        }

        public async Task<ResponseModel<bool>> SendVerificationEmail(string email, string confirmationLink)
        {
            var body = "Please confirm your email address by clicking on this link: <a href=\"#URL#\">Click here</a>";

            var verificationEmail = new EmailModel
            {
                To = email,
                Subject = "TanjirVise email verification",
                Body = body.Replace("#URL#", System.Text.Encodings.Web.HtmlEncoder.Default.Encode(confirmationLink))
            };

            return await emailSender.SendEmail(verificationEmail);
        }

        public async Task<ResponseModel<bool>> SendResetPasswordEmail(string email, string resetPasswordLink)
        {
            var body = "Please reset your password by clicking on this link: <a href=\"#URL#\">Click here</a>";

            var resetPasswordEmail = new EmailModel
            {
                To = email,
                Subject = "TanjirVise reset password",
                Body = body.Replace("#URL#", System.Text.Encodings.Web.HtmlEncoder.Default.Encode(resetPasswordLink))
            };

            return await emailSender.SendEmail(resetPasswordEmail);
        }
    }
}
