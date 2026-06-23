using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PrepArena.Api.Data;
using PrepArena.Api.Models;

namespace PrepArena.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LeaderboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LeaderboardController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// GET api/leaderboard
        /// Returns a ranked list of users ordered by total problems solved (desc),
        /// then by earliest submission date (asc). Includes difficulty breakdown and streak.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetLeaderboard()
        {
            var today = DateTime.UtcNow.Date;

            // Get all accepted submissions with their problem info
            var acceptedSubmissions = await _context.Submissions
                .Where(s => s.Status == "Accepted")
                .Join(
                    _context.Problems,
                    s => s.ProblemId,
                    p => p.Id,
                    (s, p) => new
                    {
                        s.UserEmail,
                        s.ProblemId,
                        s.SubmittedAt,
                        ProblemDifficulty = p.Difficulty
                    }
                )
                .ToListAsync();

            if (!acceptedSubmissions.Any())
            {
                return Ok(new List<object>());
            }

            // Get all submissions (accepted or not) for streak calculation
            var allSubmissionDates = await _context.Submissions
                .GroupBy(s => new { s.UserEmail, Date = s.SubmittedAt.Date })
                .Select(g => new { g.Key.UserEmail, g.Key.Date })
                .ToListAsync();

            // Load user names
            var users = await _context.Users
                .ToDictionaryAsync(u => u.Email, u => u.Name);

            // Group accepted submissions by user
            var grouped = acceptedSubmissions
                .GroupBy(s => s.UserEmail)
                .Select(g =>
                {
                    var distinctProblems = g
                        .Select(s => new { s.ProblemId, s.ProblemDifficulty })
                        .Distinct()
                        .ToList();

                    var totalSolved = distinctProblems.Count;
                    var easySolved = distinctProblems.Count(p =>
                        string.Equals(p.ProblemDifficulty, "Easy", StringComparison.OrdinalIgnoreCase));
                    var mediumSolved = distinctProblems.Count(p =>
                        string.Equals(p.ProblemDifficulty, "Medium", StringComparison.OrdinalIgnoreCase));
                    var hardSolved = distinctProblems.Count(p =>
                        string.Equals(p.ProblemDifficulty, "Hard", StringComparison.OrdinalIgnoreCase));

                    var earliestSubmission = g.Min(s => s.SubmittedAt);
                    var lastActive = g.Max(s => s.SubmittedAt);

                    // Compute streak: consecutive days ending today with at least one submission
                    var userDates = allSubmissionDates
                        .Where(d => d.UserEmail == g.Key)
                        .Select(d => d.Date)
                        .Distinct()
                        .OrderByDescending(d => d)
                        .ToList();

                    var streak = ComputeStreak(userDates, today);

                    users.TryGetValue(g.Key, out var userName);

                    return new
                    {
                        Email = g.Key,
                        Name = userName ?? g.Key,
                        TotalSolved = totalSolved,
                        EasySolved = easySolved,
                        MediumSolved = mediumSolved,
                        HardSolved = hardSolved,
                        Streak = streak,
                        LastActive = lastActive,
                        EarliestSubmission = earliestSubmission
                    };
                })
                .OrderByDescending(u => u.TotalSolved)
                .ThenBy(u => u.EarliestSubmission)
                .ToList();

            // Assign ranks
            var result = grouped.Select((u, index) => new
            {
                Rank = index + 1,
                u.Name,
                u.Email,
                u.TotalSolved,
                u.EasySolved,
                u.MediumSolved,
                u.HardSolved,
                u.Streak,
                u.LastActive
            });

            return Ok(result);
        }

        /// <summary>
        /// GET api/leaderboard/stats
        /// Returns global submission statistics.
        /// </summary>
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var hasSubmissions = await _context.Submissions.AnyAsync();

            if (!hasSubmissions)
            {
                return Ok(new
                {
                    TotalUsers = 0,
                    TotalSubmissions = 0,
                    TotalAccepted = 0,
                    TopLanguage = (string?)null
                });
            }

            var totalUsers = await _context.Submissions
                .Select(s => s.UserEmail)
                .Distinct()
                .CountAsync();

            var totalSubmissions = await _context.Submissions.CountAsync();

            var totalAccepted = await _context.Submissions
                .CountAsync(s => s.Status == "Accepted");

            var topLanguage = await _context.Submissions
                .GroupBy(s => s.Language)
                .OrderByDescending(g => g.Count())
                .Select(g => g.Key)
                .FirstOrDefaultAsync();

            return Ok(new
            {
                TotalUsers = totalUsers,
                TotalSubmissions = totalSubmissions,
                TotalAccepted = totalAccepted,
                TopLanguage = topLanguage
            });
        }

        /// <summary>
        /// Computes the streak as the count of consecutive days (ending today)
        /// where the user had at least one submission.
        /// </summary>
        private static int ComputeStreak(List<DateTime> sortedDatesDesc, DateTime today)
        {
            if (sortedDatesDesc.Count == 0)
                return 0;

            // If the most recent submission isn't today or yesterday, streak is 0
            var mostRecent = sortedDatesDesc[0];
            if ((today - mostRecent).Days > 1)
                return 0;

            int streak = 0;
            var expectedDate = today;

            // If user didn't submit today, start checking from yesterday
            if (mostRecent < today)
                expectedDate = today.AddDays(-1);

            foreach (var date in sortedDatesDesc)
            {
                if (date == expectedDate)
                {
                    streak++;
                    expectedDate = expectedDate.AddDays(-1);
                }
                else if (date < expectedDate)
                {
                    // Gap found, stop counting
                    break;
                }
                // If date > expectedDate, skip (shouldn't happen with sorted desc)
            }

            return streak;
        }
    }
}
