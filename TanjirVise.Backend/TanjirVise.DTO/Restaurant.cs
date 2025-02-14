namespace TanjirVise.DTO
{
    public class Restaurant : BaseUser
    {
        public Restaurant()
        {
            this.Role = Role.Restaurant;
        }

        public string Name { get; set; }
        public string Address { get; set; }
    }
}
