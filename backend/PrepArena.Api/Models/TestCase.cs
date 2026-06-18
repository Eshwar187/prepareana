using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace PrepArena.Api.Models
{
    public class TestCase
    {
        [Key]
        public int Id { get; set; }
        
        public string? ProblemId { get; set; }

        [JsonIgnore]
        [ForeignKey("ProblemId")]
        public Problem? Problem { get; set; }

        public string Input { get; set; } = string.Empty; // Standard input or JSON serialization
        public string ExpectedOutput { get; set; } = string.Empty;
        public bool IsSample { get; set; } = false; // If true, visible to user
    }
}
