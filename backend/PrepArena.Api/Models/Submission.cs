using System;
using System.ComponentModel.DataAnnotations;

namespace PrepArena.Api.Models
{
    public class Submission
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public string UserEmail { get; set; } = string.Empty;
        
        [Required]
        public string ProblemId { get; set; } = string.Empty;
        
        [Required]
        public string Language { get; set; } = string.Empty; // csharp, java, python, c, cpp, javascript
        
        [Required]
        public string Code { get; set; } = string.Empty;
        
        public string Status { get; set; } = "Pending"; // Accepted, Wrong Answer, Compile Error, Runtime Error, Time Limit Exceeded
        
        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
        
        public int ExecutionTimeMs { get; set; }
        
        public string? ActualOutput { get; set; }
        
        public string? CompilerMessage { get; set; }
        
        public int? FailedTestCaseIndex { get; set; }
    }
}
