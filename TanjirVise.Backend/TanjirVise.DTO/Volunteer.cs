using System.ComponentModel.DataAnnotations.Schema;

namespace TanjirVise.DTO
{
    public class Volunteer : BaseUser
    {
        public Volunteer()
        {
            this.Role = Role.Volunteer;
        }

        public string Name { get; set; }
        public string Surname { get; set; }

        [NotMapped]
        public string FullName { get { return Name + " " + Surname; } }
    }
}
