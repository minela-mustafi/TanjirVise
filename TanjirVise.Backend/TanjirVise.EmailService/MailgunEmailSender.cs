using Microsoft.Extensions.Logging;
using TanjirVise.DTO.Models;

namespace TanjirVise.EmailService
{
    public class MailgunEmailSender : IEmailSender
    {
        private readonly HttpClient mailgunHttpClient;
        private readonly MailConfig mailConfig;
        private readonly ILogger<MailgunEmailSender> logger;

        public MailgunEmailSender(HttpClient mailgunHttpClient, MailConfig mailConfig, ILogger<MailgunEmailSender> logger)
        {
            this.mailgunHttpClient = mailgunHttpClient;
            this.mailConfig = mailConfig;
            this.logger = logger;
        }

        public async Task<ResponseModel<bool>> SendEmail(EmailModel email)
        {
            Dictionary<string, string> form = new Dictionary<string, string>
            {
                ["from"] = mailConfig.From,
                ["to"] = email.To,
                ["subject"] = email.Subject,
                ["html"] = email.Body
            };

            HttpResponseMessage response = await mailgunHttpClient.PostAsync($"v3/{mailConfig.Domain}/messages", new FormUrlEncodedContent(form));

            if (!response.IsSuccessStatusCode)
            {
                return new ResponseModel<bool>
                {
                    ResponseValue = false,
                    Message = $"Error when trying to send an email. To: {email.To}, Subject: {email.Subject}, Response: {@response}",
                    Success = false
                };
            }

            return new ResponseModel<bool>
            {
                ResponseValue = true,
                Message = $"Email succesfully sent to {email.To}",
                Success = true
            };
        }
    }
}
