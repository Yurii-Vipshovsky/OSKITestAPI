using System.ComponentModel.DataAnnotations;

namespace OSKITestAPI.Models
{
    public class Test
    {
        [Key]
        public Guid Id { get; set; }
        public string Name { get; set; }
        public virtual ICollection<Question> Questions { get; set; }
    }
}
