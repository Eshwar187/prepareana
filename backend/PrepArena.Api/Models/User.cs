using System.ComponentModel.DataAnnotations;

namespace PrepArena.Api.Models
{
    public class User
    {
        [Key]
        [Required]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        public string PasswordHash { get; set; } = string.Empty;
        
        [Required]
        public string Role { get; set; } = "Student"; // "Student" or "Admin"
    }
}
