using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PrepArena.Api.Data;
using PrepArena.Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace PrepArena.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PrepHubController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PrepHubController(AppDbContext context)
        {
            _context = context;
        }

        // Static definition of company metadata
        private static readonly Dictionary<string, (string Description, string Emoji, string[] CoreTopics, int TargetScore, string[] KeyRoles)> CompanyMetadata = new()
        {
            { "Google", ("Focuses heavily on high-complexity graph traversals, dynamic programming, and advanced trees. Expect high runtime efficiency demands.", "🤖", new[] { "Graphs", "Trees", "Dynamic Programming", "Recursion" }, 85, new[] { "Software Engineer", "Systems Engineer", "SRE" }) },
            { "Amazon", ("Emphasizes scalable system design, object-oriented design patterns, arrays/hashing, and tree structures. Heavily tests customer-centric thinking.", "📦", new[] { "Arrays & Hashing", "Trees", "System Design", "Heap / Priority Queue" }, 75, new[] { "Software Development Engineer", "Cloud Engineer", "Solutions Architect" }) },
            { "Meta", ("Tests fast-paced string algorithms, two-pointer arrays, sliding window patterns, and binary search. Focuses on robust, bug-free implementation.", "♾️", new[] { "Two Pointers", "Sliding Window", "Binary Search", "Strings" }, 80, new[] { "Production Engineer", "Fullstack SDE", "Mobile Engineer" }) },
            { "Microsoft", ("Asks fundamental linked list manipulations, tree traversals, stack/queue operations, and basic recursion. Values clean code readability and logic.", "💻", new[] { "Linked List", "Stack", "Trees", "Queues" }, 72, new[] { "Software Engineer", "Azure Developer", "Program Manager" }) },
            { "Apple", ("Prioritizes cache-friendly memory manipulations, array sorting/searching, and low-level pointer management. High focus on firmware and systems.", "🍎", new[] { "Pointers", "Binary Search", "Arrays & Hashing", "Sorting" }, 78, new[] { "iOS Engineer", "Embedded Systems Dev", "CoreOS Developer" }) }
        };

        // Static definition of company problem mapping
        private static readonly Dictionary<string, (string ProblemId, int Frequency)[]> CompanyProblemMappings = new()
        {
            { "Google", new[] {
                ("longest-substring-without-repeating-characters", 92),
                ("container-with-most-water", 85),
                ("binary-search", 74),
                ("invert-binary-tree", 70)
            } },
            { "Amazon", new[] {
                ("two-sum", 96),
                ("best-time-to-buy-and-sell-stock", 90),
                ("merge-two-sorted-lists", 86),
                ("reverse-linked-list", 80)
            } },
            { "Meta", new[] {
                ("valid-parentheses", 94),
                ("two-sum", 90),
                ("longest-substring-without-repeating-characters", 88),
                ("container-with-most-water", 78)
            } },
            { "Microsoft", new[] {
                ("reverse-linked-list", 92),
                ("invert-binary-tree", 88),
                ("valid-parentheses", 84),
                ("merge-two-sorted-lists", 80)
            } },
            { "Apple", new[] {
                ("container-with-most-water", 90),
                ("binary-search", 85),
                ("reverse-linked-list", 82),
                ("two-sum", 76)
            } }
        };

        public class CompanySummaryDto
        {
            public string Name { get; set; } = string.Empty;
            public string Description { get; set; } = string.Empty;
            public string Emoji { get; set; } = string.Empty;
            public string[] CoreTopics { get; set; } = Array.Empty<string>();
            public string[] KeyRoles { get; set; } = Array.Empty<string>();
            public int TotalProblemsCount { get; set; }
            public int SolvedCount { get; set; }
            public int MatchRate { get; set; }
            public int TargetScore { get; set; }
        }

        // GET: api/prephub/companies
        [HttpGet("companies")]
        public async Task<ActionResult<IEnumerable<CompanySummaryDto>>> GetCompanies()
        {
            string userEmail = Request.Headers["X-User-Email"].ToString();
            var emailFilter = userEmail?.ToLower().Trim();

            // Find all accepted problems for the current user
            var solvedProblemIds = new HashSet<string>();
            if (!string.IsNullOrEmpty(emailFilter))
            {
                solvedProblemIds = (await _context.Submissions
                    .Where(s => s.UserEmail.ToLower() == emailFilter && s.Status == "Accepted")
                    .Select(s => s.ProblemId)
                    .Distinct()
                    .ToListAsync())
                    .ToHashSet();
            }

            var result = new List<CompanySummaryDto>();
            foreach (var kvp in CompanyMetadata)
            {
                var companyName = kvp.Key;
                var meta = kvp.Value;

                CompanyProblemMappings.TryGetValue(companyName, out var mappings);
                int totalProblems = mappings?.Length ?? 0;
                int solvedCount = 0;

                if (mappings != null)
                {
                    foreach (var m in mappings)
                    {
                        if (solvedProblemIds.Contains(m.ProblemId))
                        {
                            solvedCount++;
                        }
                    }
                }

                // Compute alignment match rate
                int baseMatch = 40 + (solvedProblemIds.Count * 3);
                if (totalProblems > 0)
                {
                    baseMatch += (int)Math.Round((double)solvedCount / totalProblems * 30);
                }
                int finalMatch = Math.Min(98, baseMatch);

                result.Add(new CompanySummaryDto
                {
                    Name = companyName,
                    Description = meta.Description,
                    Emoji = meta.Emoji,
                    CoreTopics = meta.CoreTopics,
                    KeyRoles = meta.KeyRoles,
                    TotalProblemsCount = totalProblems,
                    SolvedCount = solvedCount,
                    MatchRate = finalMatch,
                    TargetScore = meta.TargetScore
                });
            }

            return Ok(result);
        }

        public class CompanyProblemDto
        {
            public string Id { get; set; } = string.Empty;
            public string Title { get; set; } = string.Empty;
            public string Difficulty { get; set; } = string.Empty;
            public string Category { get; set; } = string.Empty;
            public int Frequency { get; set; }
            public bool IsSolved { get; set; }
        }

        // GET: api/prephub/companies/{name}/problems
        [HttpGet("companies/{name}/problems")]
        public async Task<ActionResult<IEnumerable<CompanyProblemDto>>> GetCompanyProblems(string name)
        {
            if (!CompanyProblemMappings.ContainsKey(name))
            {
                return NotFound(new { message = $"Company '{name}' not found." });
            }

            string userEmail = Request.Headers["X-User-Email"].ToString();
            var emailFilter = userEmail?.ToLower().Trim();

            var solvedProblemIds = new HashSet<string>();
            if (!string.IsNullOrEmpty(emailFilter))
            {
                solvedProblemIds = (await _context.Submissions
                    .Where(s => s.UserEmail.ToLower() == emailFilter && s.Status == "Accepted")
                    .Select(s => s.ProblemId)
                    .Distinct()
                    .ToListAsync())
                    .ToHashSet();
            }

            var mappings = CompanyProblemMappings[name];
            var problemIds = mappings.Select(m => m.ProblemId).ToList();

            var problems = await _context.Problems
                .Where(p => problemIds.Contains(p.Id))
                .ToListAsync();

            var result = new List<CompanyProblemDto>();
            foreach (var m in mappings)
            {
                var problem = problems.FirstOrDefault(p => p.Id == m.ProblemId);
                if (problem != null)
                {
                    result.Add(new CompanyProblemDto
                    {
                        Id = problem.Id,
                        Title = problem.Title,
                        Difficulty = problem.Difficulty,
                        Category = problem.Category,
                        Frequency = m.Frequency,
                        IsSolved = solvedProblemIds.Contains(problem.Id)
                    });
                }
            }

            return Ok(result);
        }

        public class ResumeAnalysisRequest
        {
            public string ResumeText { get; set; } = string.Empty;
        }

        public class CompanyMatchingScore
        {
            public int Score { get; set; }
            public string[] Gaps { get; set; } = Array.Empty<string>();
        }

        public class ResumeAnalysisResultDto
        {
            public int DsaIndex { get; set; }
            public Dictionary<string, CompanyMatchingScore> Matching { get; set; } = new();
            public string[] StrongSkills { get; set; } = Array.Empty<string>();
            public string[] Recommendations { get; set; } = Array.Empty<string>();
            public string[] BehavioralQuestions { get; set; } = Array.Empty<string>();
        }

        // POST: api/prephub/analyze-resume
        [HttpPost("analyze-resume")]
        public async Task<ActionResult<ResumeAnalysisResultDto>> AnalyzeResume([FromBody] ResumeAnalysisRequest request)
        {
            var text = request.ResumeText ?? string.Empty;
            var lowerText = text.ToLower();

            // Find all accepted problems for the current user to factor in real coding progress
            string userEmail = Request.Headers["X-User-Email"].ToString();
            var emailFilter = userEmail?.ToLower().Trim();
            int solvedCount = 0;
            if (!string.IsNullOrEmpty(emailFilter))
            {
                solvedCount = await _context.Submissions
                    .Where(s => s.UserEmail.ToLower() == emailFilter && s.Status == "Accepted")
                    .Select(s => s.ProblemId)
                    .Distinct()
                    .CountAsync();
            }

            // Keyword analysis
            bool hasCpp = lowerText.Contains("c++") || lowerText.Contains("cpp") || lowerText.Contains("systems programming");
            bool hasJava = lowerText.Contains("java ") || lowerText.Contains("spring boot") || lowerText.Contains("maven");
            bool hasPython = lowerText.Contains("python") || lowerText.Contains("django") || lowerText.Contains("machine learning") || lowerText.Contains("numpy");
            bool hasWeb = lowerText.Contains("react") || lowerText.Contains("javascript") || lowerText.Contains("typescript") || lowerText.Contains("html") || lowerText.Contains("css");
            bool hasBackend = lowerText.Contains("backend") || lowerText.Contains("microservices") || lowerText.Contains("sql") || lowerText.Contains("docker") || lowerText.Contains("redis");

            // Calculate base DSA index based on technical keywords and solved problems
            int dsaIndex = 50 + (solvedCount * 4);
            if (hasCpp) dsaIndex += 8;
            if (hasJava) dsaIndex += 6;
            if (hasPython) dsaIndex += 5;
            if (hasBackend) dsaIndex += 7;
            dsaIndex = Math.Min(95, dsaIndex);

            // Compute strong skills
            var strong = new List<string>();
            if (hasCpp) strong.AddRange(new[] { "Pointers & Memory", "Low-level Arrays", "Sorting" });
            if (hasJava) strong.AddRange(new[] { "OOP Design", "Collections Framework", "Binary Search Trees" });
            if (hasPython) strong.AddRange(new[] { "Scripting", "Data Structures", "Heuristics" });
            if (hasWeb) strong.AddRange(new[] { "Strings", "Stack/Queue", "Sliding Window" });
            if (hasBackend) strong.AddRange(new[] { "Hash Tables", "Caching Design", "System Schemas" });

            if (!strong.Any())
            {
                strong.AddRange(new[] { "Basic Arrays", "Flow Control", "Variable Allocation" });
            }

            // Define gaps and recommendations
            var gaps = new List<string>();
            var recs = new List<string>();

            if (!lowerText.Contains("tree") && !lowerText.Contains("bst"))
            {
                gaps.Add("Non-linear Traversals (Trees / BSTs)");
                recs.Add("Complete World 5 (Trees) on the Roadmap to cover graph traversals.");
            }
            if (!lowerText.Contains("dynamic programming") && !lowerText.Contains(" dp "))
            {
                gaps.Add("Dynamic Programming Reoptimization");
                recs.Add("Solve at least 3 Medium DP problems (World 9) to clear Google/Meta selection thresholds.");
            }
            if (!lowerText.Contains("graph"))
            {
                gaps.Add("Breadth/Depth Graph Search (BFS/DFS)");
                recs.Add("Practice graph connectivity and path-finding algorithms (World 8).");
            }
            if (solvedCount < 10)
            {
                gaps.Add("Mock Execution Speed");
                recs.Add("Submit at least 5 more solutions in the DSA Arena to build code accuracy above 80%.");
            }

            if (!gaps.Any())
            {
                gaps.Add("Distributed System Caching");
                recs.Add("Benchmark execution footprint against C++ memory standards in systems loops.");
            }

            // Calculate company matchings
            var matching = new Dictionary<string, CompanyMatchingScore>();
            foreach (var kvp in CompanyMetadata)
            {
                var companyName = kvp.Key;
                var meta = kvp.Value;

                int score = dsaIndex;
                if (companyName == "Google" && !hasCpp) score -= 10;
                if (companyName == "Meta" && !hasWeb) score -= 5;
                if (companyName == "Apple" && !hasCpp) score -= 12;
                if (companyName == "Amazon" && !hasBackend) score -= 8;
                if (companyName == "Microsoft" && !hasJava) score -= 4;

                // Clamp
                score = Math.Clamp(score, 35, 98);

                matching[companyName] = new CompanyMatchingScore
                {
                    Score = score,
                    Gaps = gaps.Take(2).ToArray()
                };
            }

            // Parse project names and dynamically generate resume-tailored behavioral questions
            var behavioralQuestions = new List<string>();
            var projectMatches = Regex.Matches(text, @"(?:project|system|application|app)\s+(?:called|titled|named)?\s*""?([A-Za-z0-9\s\-]{3,20})""?", RegexOptions.IgnoreCase);
            var parsedProjects = new List<string>();

            foreach (Match match in projectMatches)
            {
                var proj = match.Groups[1].Value.Trim();
                if (proj.Length > 3 && !parsedProjects.Contains(proj))
                {
                    parsedProjects.Add(proj);
                }
            }

            // Fallback project names if none found
            if (!parsedProjects.Any())
            {
                parsedProjects.Add("your core development project");
                parsedProjects.Add("your primary team system");
            }

            // Generate behavioral questions utilizing project names
            behavioralQuestions.Add($"Tell me about a major technical bottleneck you encountered while building **{parsedProjects[0]}**. What actions did you take to optimize it?");
            if (parsedProjects.Count > 1)
            {
                behavioralQuestions.Add($"During the design phase of **{parsedProjects[1]}**, how did you resolve conflicts with teammates regarding the tech stack or implementation details?");
            }
            else
            {
                behavioralQuestions.Add($"If you were asked to scale the architecture of **{parsedProjects[0]}** to handle 100x traffic tomorrow, what structural updates would you prioritize first?");
            }
            behavioralQuestions.Add("Amazon Leadership Principle: Tell me about a time you had to deliver a feature under a tight deadline, and had to make trade-offs between code quality and speed.");

            var result = new ResumeAnalysisResultDto
            {
                DsaIndex = dsaIndex,
                Matching = matching,
                StrongSkills = strong.Distinct().ToArray(),
                Recommendations = recs.ToArray(),
                BehavioralQuestions = behavioralQuestions.ToArray()
            };

            return Ok(result);
        }

        public class WeaknessAnalysisDto
        {
            public string WeakestCategory { get; set; } = "General";
            public double WeakestSuccessRate { get; set; }
            public List<string> RecommendedProblemIds { get; set; } = new();
            public Dictionary<string, double> CategorySuccessRates { get; set; } = new();
        }

        // GET: api/prephub/weakness-analysis
        [HttpGet("weakness-analysis")]
        public async Task<ActionResult<WeaknessAnalysisDto>> GetWeaknessAnalysis()
        {
            string userEmail = Request.Headers["X-User-Email"].ToString();
            var emailFilter = userEmail?.ToLower().Trim();

            if (string.IsNullOrEmpty(emailFilter))
            {
                return Ok(new WeaknessAnalysisDto
                {
                    WeakestCategory = "Arrays & Hashing",
                    WeakestSuccessRate = 1.0,
                    RecommendedProblemIds = new List<string> { "two-sum" }
                });
            }

            // Fetch all submissions for the user
            var userSubmissions = await _context.Submissions
                .Where(s => s.UserEmail.ToLower() == emailFilter)
                .ToListAsync();

            if (!userSubmissions.Any())
            {
                // Return default if no submissions
                return Ok(new WeaknessAnalysisDto
                {
                    WeakestCategory = "Arrays & Hashing",
                    WeakestSuccessRate = 1.0,
                    RecommendedProblemIds = new List<string> { "two-sum", "valid-parentheses" },
                    CategorySuccessRates = new Dictionary<string, double> { { "Arrays & Hashing", 1.0 } }
                });
            }

            // Group submissions by ProblemId and calculate status
            var problemStatuses = userSubmissions
                .GroupBy(s => s.ProblemId)
                .Select(g => new
                {
                    ProblemId = g.Key,
                    HasAccepted = g.Any(s => s.Status == "Accepted"),
                    TotalAttempts = g.Count(),
                    FailedAttempts = g.Count(s => s.Status != "Accepted")
                })
                .ToList();

            var problemIds = problemStatuses.Select(ps => ps.ProblemId).ToList();
            var problems = await _context.Problems
                .Where(p => problemIds.Contains(p.Id))
                .ToDictionaryAsync(p => p.Id);

            // Group by category and calculate stats
            var categoryStats = new Dictionary<string, (int TotalAttempts, int AcceptedAttempts)>();

            foreach (var ps in problemStatuses)
            {
                if (problems.TryGetValue(ps.ProblemId, out var prob))
                {
                    var cat = prob.Category ?? "General";
                    if (!categoryStats.ContainsKey(cat))
                    {
                        categoryStats[cat] = (0, 0);
                    }
                    var current = categoryStats[cat];
                    categoryStats[cat] = (current.TotalAttempts + ps.TotalAttempts, current.AcceptedAttempts + (ps.HasAccepted ? 1 : 0));
                }
            }

            var successRates = new Dictionary<string, double>();
            string weakestCategory = "Arrays & Hashing";
            double weakestRate = 1.0;

            foreach (var kvp in categoryStats)
            {
                double rate = (double)kvp.Value.AcceptedAttempts / (kvp.Value.TotalAttempts > 0 ? kvp.Value.TotalAttempts : 1);
                successRates[kvp.Key] = rate;

                // Find lowest success rate category
                if (rate < weakestRate)
                {
                    weakestRate = rate;
                    weakestCategory = kvp.Key;
                }
            }

            // Find unsolved problems in the weakest category
            var solvedProblemsInWeakest = userSubmissions
                .Where(s => s.Status == "Accepted")
                .Select(s => s.ProblemId)
                .Distinct()
                .ToHashSet();

            var recommendedProblems = await _context.Problems
                .Where(p => p.Category == weakestCategory && !solvedProblemsInWeakest.Contains(p.Id))
                .Select(p => p.Id)
                .Take(3)
                .ToListAsync();

            // Fallback if they solved all in that category
            if (!recommendedProblems.Any())
            {
                recommendedProblems = await _context.Problems
                    .Where(p => !solvedProblemsInWeakest.Contains(p.Id))
                    .Select(p => p.Id)
                    .Take(2)
                    .ToListAsync();
            }

            return Ok(new WeaknessAnalysisDto
            {
                WeakestCategory = weakestCategory,
                WeakestSuccessRate = Math.Round(weakestRate, 2),
                RecommendedProblemIds = recommendedProblems,
                CategorySuccessRates = successRates
            });
        }
    }
}
