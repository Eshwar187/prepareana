using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PrepArena.Api.Data;
using PrepArena.Api.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PrepArena.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }

        // Helper to check admin access based on the header
        private async Task<bool> IsAdminRequestAsync()
        {
            if (!Request.Headers.TryGetValue("X-User-Email", out var userEmail))
            {
                return false;
            }

            var email = userEmail.ToString().ToLower().Trim();
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == email);
            return user != null && user.Role == "Admin";
        }

        // GET: api/admin/users
        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            if (!await IsAdminRequestAsync())
            {
                return StatusCode(403, new { message = "Access Denied: Admin role required." });
            }

            var users = await _context.Users
                .Select(u => new { u.Email, u.Name, u.Role })
                .ToListAsync();

            return Ok(users);
        }

        // POST: api/admin/users/{email}/promote
        [HttpPost("users/{email}/promote")]
        public async Task<IActionResult> PromoteUser(string email)
        {
            if (!await IsAdminRequestAsync())
            {
                return StatusCode(403, new { message = "Access Denied: Admin role required." });
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower().Trim());
            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            user.Role = "Admin";
            await _context.SaveChangesAsync();

            return Ok(new { message = $"User {email} promoted to Admin successfully.", user = new { user.Email, user.Name, user.Role } });
        }

        // POST: api/admin/problems
        [HttpPost("problems")]
        public async Task<IActionResult> CreateProblem([FromBody] Problem problem)
        {
            if (!await IsAdminRequestAsync())
            {
                return StatusCode(403, new { message = "Access Denied: Admin role required." });
            }

            if (string.IsNullOrWhiteSpace(problem.Id) || string.IsNullOrWhiteSpace(problem.Title))
            {
                return BadRequest(new { message = "Problem ID and Title are required." });
            }

            var exists = await _context.Problems.AnyAsync(p => p.Id == problem.Id);
            if (exists)
            {
                return BadRequest(new { message = $"Problem with ID '{problem.Id}' already exists." });
            }

            _context.Problems.Add(problem);
            await _context.SaveChangesAsync();

            return Ok(problem);
        }

        // GET: api/admin/problems/{id}
        [HttpGet("problems/{id}")]
        public async Task<IActionResult> GetProblem(string id)
        {
            if (!await IsAdminRequestAsync())
            {
                return StatusCode(403, new { message = "Access Denied: Admin role required." });
            }

            var problem = await _context.Problems
                .Include(p => p.TestCases)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (problem == null)
            {
                return NotFound(new { message = $"Problem '{id}' not found." });
            }

            return Ok(problem);
        }

        // PUT: api/admin/problems/{id}
        [HttpPut("problems/{id}")]
        public async Task<IActionResult> UpdateProblem(string id, [FromBody] Problem problemUpdate)
        {
            if (!await IsAdminRequestAsync())
            {
                return StatusCode(403, new { message = "Access Denied: Admin role required." });
            }

            var problem = await _context.Problems
                .Include(p => p.TestCases)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (problem == null)
            {
                return NotFound(new { message = "Problem not found." });
            }

            // Update details
            problem.Title = problemUpdate.Title;
            problem.Category = problemUpdate.Category;
            problem.Difficulty = problemUpdate.Difficulty;
            problem.Description = problemUpdate.Description;
            problem.VideoUrl = problemUpdate.VideoUrl;
            problem.TimeLimitMs = problemUpdate.TimeLimitMs;
            problem.MemoryLimitMb = problemUpdate.MemoryLimitMb;

            if (!string.IsNullOrEmpty(problemUpdate.CsharpBoilerplate)) problem.CsharpBoilerplate = problemUpdate.CsharpBoilerplate;
            if (!string.IsNullOrEmpty(problemUpdate.JavaBoilerplate)) problem.JavaBoilerplate = problemUpdate.JavaBoilerplate;
            if (!string.IsNullOrEmpty(problemUpdate.PythonBoilerplate)) problem.PythonBoilerplate = problemUpdate.PythonBoilerplate;
            if (!string.IsNullOrEmpty(problemUpdate.CppBoilerplate)) problem.CppBoilerplate = problemUpdate.CppBoilerplate;
            if (!string.IsNullOrEmpty(problemUpdate.CBoilerplate)) problem.CBoilerplate = problemUpdate.CBoilerplate;
            if (!string.IsNullOrEmpty(problemUpdate.JsBoilerplate)) problem.JsBoilerplate = problemUpdate.JsBoilerplate;

            if (!string.IsNullOrEmpty(problemUpdate.CsharpDriver)) problem.CsharpDriver = problemUpdate.CsharpDriver;
            if (!string.IsNullOrEmpty(problemUpdate.JavaDriver)) problem.JavaDriver = problemUpdate.JavaDriver;
            if (!string.IsNullOrEmpty(problemUpdate.PythonDriver)) problem.PythonDriver = problemUpdate.PythonDriver;
            if (!string.IsNullOrEmpty(problemUpdate.CppDriver)) problem.CppDriver = problemUpdate.CppDriver;
            if (!string.IsNullOrEmpty(problemUpdate.CDriver)) problem.CDriver = problemUpdate.CDriver;
            if (!string.IsNullOrEmpty(problemUpdate.JsDriver)) problem.JsDriver = problemUpdate.JsDriver;

            // Clear old test cases and add new ones if provided
            if (problemUpdate.TestCases != null)
            {
                _context.TestCases.RemoveRange(problem.TestCases);
                foreach (var tc in problemUpdate.TestCases)
                {
                    tc.ProblemId = id;
                    tc.Id = 0; // EF Core will auto-assign
                    _context.TestCases.Add(tc);
                }
            }

            await _context.SaveChangesAsync();
            return Ok(problem);
        }

        // DELETE: api/admin/problems/{id}
        [HttpDelete("problems/{id}")]
        public async Task<IActionResult> DeleteProblem(string id)
        {
            if (!await IsAdminRequestAsync())
            {
                return StatusCode(403, new { message = "Access Denied: Admin role required." });
            }

            var problem = await _context.Problems
                .Include(p => p.TestCases)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (problem == null)
            {
                return NotFound(new { message = "Problem not found." });
            }

            _context.Problems.Remove(problem);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Problem '{id}' deleted successfully." });
        }
    }
}
