using System.ComponentModel.DataAnnotations.Schema;

namespace TanjirVise.DTO
{
    public class User : BaseUser
    {
        public User()
        {
            this.Role = Role.User;
        }

        public string Name { get; set; }
        public string Surname { get; set; }

        [NotMapped]
        public string FullName { get { return Name + " " + Surname; } }
    }
}
