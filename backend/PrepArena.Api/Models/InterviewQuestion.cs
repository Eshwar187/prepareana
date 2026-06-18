using System.ComponentModel.DataAnnotations;

namespace PrepArena.Api.Models
{
    public class InterviewQuestion
    {
        [Key]
        public int Id { get; set; }
        
        public string Category { get; set; } = "Behavioral"; // Behavioral, System Design, Technical, DSA
        
        public string QuestionText { get; set; } = string.Empty;
        
        public string IdealKeywords { get; set; } = string.Empty; // Semicolon-separated key concepts expected in the answer
        
        public string SampleAnswer { get; set; } = string.Empty;
    }
}
