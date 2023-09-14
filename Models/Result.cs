using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OSKITestAPI.Models
{
    public class Result
    {
        [Key]
        public Guid Id { get; set; }

        [ForeignKey("User")]
        public Guid UserId { get; set; }

        [ForeignKey("Test")]
        public Guid TestId { get; set; }
        public bool IsComleted { get; set; }
        public double Score { get; set; }
        public virtual Test Test { get; set; }

        public void CalculateScore(double correctAnswersCount)
        {
            Score = Math.Round((double)correctAnswersCount / Test.Questions.Count * 100, 2); ;
        }
    }
}
