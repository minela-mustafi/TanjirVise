using TanjirVise.DTO.Models;

namespace TanjirVise.EmailService
{
    public interface IEmailSender
    {
        Task<ResponseModel<bool>> SendEmail(EmailModel email);
    }
}
