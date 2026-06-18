using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PrepArena.Api.Data;
using PrepArena.Api.Models;
using PrepArena.Api.Services;
using System.Threading.Tasks;

namespace PrepArena.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        public class LoginRequest
        {
            public string Email { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
        }

        public class RegisterRequest
        {
            public string Name { get; set; } = string.Empty;
            public string Email { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
        }

        // POST: api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(new { message = "Email and password are required." });
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == request.Email.ToLower().Trim());
            if (user == null || !PasswordHasher.VerifyPassword(request.Password, user.PasswordHash))
            {
                return BadRequest(new { message = "Invalid email or password." });
            }

            return Ok(new
            {
                token = "jwt-session-token-" + user.Email,
                user = new
                {
                    name = user.Name,
                    email = user.Email,
                    role = user.Role
                }
            });
        }

        // POST: api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password) || string.IsNullOrWhiteSpace(request.Name))
            {
                return BadRequest(new { message = "All fields are required." });
            }

            if (request.Password.Length < 6)
            {
                return BadRequest(new { message = "Password must be at least 6 characters long." });
            }

            var emailNormalized = request.Email.ToLower().Trim();
            var userExists = await _context.Users.AnyAsync(u => u.Email.ToLower() == emailNormalized);
            if (userExists)
            {
                return BadRequest(new { message = "A user with this email already exists." });
            }

            var newUser = new User
            {
                Email = emailNormalized,
                Name = request.Name.Trim(),
                PasswordHash = PasswordHasher.HashPassword(request.Password),
                Role = "Student" // default role is Student
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                token = "jwt-session-token-" + newUser.Email,
                user = new
                {
                    name = newUser.Name,
                    email = newUser.Email,
                    role = newUser.Role
                }
            });
        }
    }
}
