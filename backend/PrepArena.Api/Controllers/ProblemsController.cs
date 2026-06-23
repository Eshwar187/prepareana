using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PrepArena.Api.Data;
using PrepArena.Api.Models;
using PrepArena.Api.Services;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PrepArena.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProblemsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly CodeExecutorService _executor;

        public ProblemsController(AppDbContext context, CodeExecutorService executor)
        {
            _context = context;
            _executor = executor;
        }

        // GET: api/problems
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetProblems()
        {
            // Return light list without bulky boilerplates
            var problems = await _context.Problems
                .Select(p => new
                {
                    p.Id,
                    p.Title,
                    p.Difficulty,
                    p.Category,
                    p.TimeLimitMs,
                    p.MemoryLimitMb,
                    p.VideoUrl,
                    TestCasesCount = p.TestCases.Count
                })
                .ToListAsync();

            return Ok(problems);
        }

        // GET: api/problems/two-sum
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetProblem(string id)
        {
            var problem = await _context.Problems
                .Include(p => p.TestCases)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (problem == null)
            {
                return NotFound(new { message = $"Problem '{id}' not found." });
            }

            var response = new
            {
                problem.Id,
                problem.Title,
                problem.Description,
                problem.Difficulty,
                problem.Category,
                problem.TimeLimitMs,
                problem.MemoryLimitMb,
                problem.VideoUrl,
                boilerplates = new Dictionary<string, string>
                {
                    { "csharp", problem.CsharpBoilerplate },
                    { "java", problem.JavaBoilerplate },
                    { "python", problem.PythonBoilerplate },
                    { "cpp", problem.CppBoilerplate },
                    { "c", problem.CBoilerplate },
                    { "javascript", problem.JsBoilerplate }
                },
                testCases = problem.TestCases
                    .Where(tc => tc.IsSample)
                    .Select(tc => new { tc.Id, tc.Input, tc.ExpectedOutput })
                    .ToList()
            };

            return Ok(response);
        }

        public class CodeExecutionRequest
        {
            public string Code { get; set; } = string.Empty;
            public string Language { get; set; } = string.Empty; // csharp, java, python, cpp, c, javascript
        }

        // POST: api/problems/two-sum/run
        [HttpPost("{id}/run")]
        public async Task<IActionResult> RunTestCode(string id, [FromBody] CodeExecutionRequest request)
        {
            var problem = await _context.Problems
                .Include(p => p.TestCases)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (problem == null)
            {
                return NotFound(new { message = "Problem not found." });
            }

            var sampleTestCases = problem.TestCases.Where(tc => tc.IsSample).ToList();
            if (!sampleTestCases.Any())
            {
                return BadRequest(new { message = "No sample test cases defined for this problem." });
            }

            var result = await _executor.ExecuteSolutionAsync(problem, request.Code, request.Language, sampleTestCases);
            return Ok(result);
        }

        // POST: api/problems/two-sum/submit
        [HttpPost("{id}/submit")]
        public async Task<IActionResult> SubmitCode(string id, [FromBody] CodeExecutionRequest request)
        {
            var problem = await _context.Problems
                .Include(p => p.TestCases)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (problem == null)
            {
                return NotFound(new { message = "Problem not found." });
            }

            var allTestCases = problem.TestCases.ToList();
            var result = await _executor.ExecuteSolutionAsync(problem, request.Code, request.Language, allTestCases);

            // Get user email from header
            string userEmail = Request.Headers["X-User-Email"].ToString();
            if (string.IsNullOrEmpty(userEmail))
            {
                userEmail = "anonymous@preparena.dev";
            }

            // Record submission
            var submission = new Submission
            {
                UserEmail = userEmail.ToLower().Trim(),
                ProblemId = id,
                Language = request.Language,
                Code = request.Code,
                Status = result.Status,
                ExecutionTimeMs = result.ExecutionTimeMs,
                ActualOutput = result.ActualOutput,
                CompilerMessage = result.CompilerMessage,
                FailedTestCaseIndex = result.FailedTestCaseIndex,
                SubmittedAt = System.DateTime.UtcNow
            };

            _context.Submissions.Add(submission);
            await _context.SaveChangesAsync();

            return Ok(submission);
        }

        // GET: api/problems/submissions
        [HttpGet("submissions")]
        public async Task<ActionResult<IEnumerable<Submission>>> GetSubmissions([FromQuery] string? problemId)
        {
            var query = _context.Submissions.AsQueryable();
            
            // Filter by user email from header
            string userEmail = Request.Headers["X-User-Email"].ToString();
            if (!string.IsNullOrEmpty(userEmail))
            {
                query = query.Where(s => s.UserEmail.ToLower() == userEmail.ToLower().Trim());
            }

            if (!string.IsNullOrEmpty(problemId))
            {
                query = query.Where(s => s.ProblemId == problemId);
            }

            var submissions = await query
                .OrderByDescending(s => s.SubmittedAt)
                .Take(50)
                .ToListAsync();

            return Ok(submissions);
        }

        // GET: api/problems/stats
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            string userEmail = Request.Headers["X-User-Email"].ToString();
            var emailFilter = userEmail?.ToLower().Trim();

            var totalProblems = await _context.Problems.CountAsync();

            if (string.IsNullOrEmpty(emailFilter))
            {
                return Ok(new
                {
                    totalProblems,
                    solvedProblems = 0,
                    recentSubmissions = new List<object>(),
                    solvedDifficulty = new List<object>(),
                    streak = 0,
                    activeDates = new List<string>()
                });
            }

            var querySubmissions = _context.Submissions.Where(s => s.UserEmail.ToLower() == emailFilter);

            var solvedProblems = await querySubmissions
                .Where(s => s.Status == "Accepted")
                .Select(s => s.ProblemId)
                .Distinct()
                .CountAsync();

            var submissions = await querySubmissions
                .OrderByDescending(s => s.SubmittedAt)
                .Take(10)
                .ToListAsync();

            // Calculate active streak
            var submissionDates = await querySubmissions
                .Select(s => s.SubmittedAt.Date)
                .Distinct()
                .OrderByDescending(d => d)
                .ToListAsync();

            int streak = 0;
            if (submissionDates.Any())
            {
                var today = DateTime.Today;
                var yesterday = today.AddDays(-1);
                var expected = submissionDates[0];
                if (expected == today || expected == yesterday)
                {
                    streak = 1;
                    for (int i = 1; i < submissionDates.Count; i++)
                    {
                        if (submissionDates[i] == expected.AddDays(-1))
                        {
                            streak++;
                            expected = submissionDates[i];
                        }
                        else
                        {
                            break;
                        }
                    }
                }
            }

            // Calculate difficulty distribution
            var difficulties = await querySubmissions
                .Where(s => s.Status == "Accepted")
                .Join(_context.Problems, s => s.ProblemId, p => p.Id, (s, p) => new { p.Difficulty, p.Id })
                .Distinct()
                .GroupBy(x => x.Difficulty)
                .Select(g => new { Difficulty = g.Key, Count = g.Count() })
                .ToListAsync();

            // Calculate global rank
            var allUsersSolved = await _context.Submissions
                .Where(s => s.Status == "Accepted")
                .GroupBy(s => s.UserEmail)
                .Select(g => new
                {
                    Email = g.Key,
                    SolvedCount = g.Select(s => s.ProblemId).Distinct().Count(),
                    EarliestSub = g.Min(s => s.SubmittedAt)
                })
                .OrderByDescending(x => x.SolvedCount)
                .ThenBy(x => x.EarliestSub)
                .ToListAsync();

            int rank = 1;
            for (int i = 0; i < allUsersSolved.Count; i++)
            {
                if (allUsersSolved[i].Email.ToLower() == emailFilter)
                {
                    rank = i + 1;
                    break;
                }
            }
            if (!allUsersSolved.Any(x => x.Email.ToLower() == emailFilter))
            {
                rank = allUsersSolved.Count + 1;
            }

            return Ok(new
            {
                totalProblems,
                solvedProblems,
                recentSubmissions = submissions,
                solvedDifficulty = difficulties,
                streak,
                activeDates = submissionDates.Select(d => d.ToString("yyyy-MM-dd")).ToList(),
                rank
            });
        }
    }
}
