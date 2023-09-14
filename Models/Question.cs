using static System.Net.Mime.MediaTypeNames;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace OSKITestAPI.Models
{
    public class Question
    {
        [Key]
        public Guid Id { get; set; }

        public string QuestionText { get; set; }
        public string QuestionAnswer { get; set; }

        [ForeignKey("Test")]
        public Guid TestId { get; set; }

        public virtual Test Test { get; set; }

        public bool checkAnswer(string answer)
        {
            return answer == QuestionAnswer;
        }
    }
}
