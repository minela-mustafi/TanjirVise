namespace TanjirVise.DTO.Models
{
    public class ResponseModel<T>
    {
        public T? ResponseValue { get; set; }
        public string? Message { get; set; }
        public bool Success { get; set; }
    }
}
