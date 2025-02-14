namespace TanjirVise.DTO
{
    public class BaseClass
    {
        public BaseClass()
        {
            Created = DateTime.Now;
            Deleted = false;
        }
        public int Id { get; set; }
        public DateTime Created { get; set; }
        public bool Deleted { get; set; }
    }
}
