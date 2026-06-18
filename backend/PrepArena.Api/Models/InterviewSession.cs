using System;
using System.ComponentModel.DataAnnotations;

namespace PrepArena.Api.Models
{
    public class InterviewSession
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        public string Topic { get; set; } = "General";
        
        public int CurrentQuestionIndex { get; set; } = 0;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public string QuestionsJson { get; set; } = "[]"; // Serialized list of questions selected for this session
        
        public string AnswersJson { get; set; } = "{}"; // Serialized dictionary of question index to user answer
        
        public string FeedbackJson { get; set; } = "{}"; // Overall feedback summary: score, strengths, improvements
        
        public bool IsCompleted { get; set; } = false;
    }
}
