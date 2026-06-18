using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PrepArena.Api.Data;
using PrepArena.Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace PrepArena.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InterviewController : ControllerBase
    {
        private readonly AppDbContext _context;

        public InterviewController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/interview/questions
        [HttpGet("questions")]
        public async Task<ActionResult<IEnumerable<InterviewQuestion>>> GetQuestions()
        {
            return await _context.InterviewQuestions.ToListAsync();
        }

        public class StartSessionRequest
        {
            public string Topic { get; set; } = "General"; // Behavioral, System Design, C# / .NET
        }

        // POST: api/interview/start
        [HttpPost("start")]
        public async Task<IActionResult> StartSession([FromBody] StartSessionRequest request)
        {
            // Select questions for this topic
            var questions = await _context.InterviewQuestions
                .Where(q => q.Category == request.Topic || request.Topic == "General")
                .Take(3)
                .ToListAsync();

            if (!questions.Any())
            {
                // Fallback to any 3 questions if topic doesn't match
                questions = await _context.InterviewQuestions.Take(3).ToListAsync();
            }

            var session = new InterviewSession
            {
                Topic = request.Topic,
                CurrentQuestionIndex = 0,
                QuestionsJson = JsonSerializer.Serialize(questions),
                AnswersJson = JsonSerializer.Serialize(new Dictionary<int, string>()),
                FeedbackJson = "{}",
                IsCompleted = false
            };

            _context.InterviewSessions.Add(session);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                sessionId = session.Id,
                topic = session.Topic,
                currentQuestionIndex = 0,
                totalQuestions = questions.Count,
                firstQuestion = questions.First()
            });
        }

        public class SubmitAnswerRequest
        {
            public string Answer { get; set; } = string.Empty;
        }

        // POST: api/interview/session/{id}/answer
        [HttpPost("session/{id}/answer")]
        public async Task<IActionResult> SubmitAnswer(string id, [FromBody] SubmitAnswerRequest request)
        {
            var session = await _context.InterviewSessions.FindAsync(id);
            if (session == null)
            {
                return NotFound(new { message = "Session not found." });
            }

            if (session.IsCompleted)
            {
                return BadRequest(new { message = "Interview is already completed." });
            }

            var questions = JsonSerializer.Deserialize<List<InterviewQuestion>>(session.QuestionsJson) ?? new List<InterviewQuestion>();
            var answers = JsonSerializer.Deserialize<Dictionary<int, string>>(session.AnswersJson) ?? new Dictionary<int, string>();

            if (session.CurrentQuestionIndex >= questions.Count)
            {
                return BadRequest(new { message = "No more questions." });
            }

            // Save current answer
            var currentQuestion = questions[session.CurrentQuestionIndex];
            answers[currentQuestion.Id] = request.Answer;
            session.AnswersJson = JsonSerializer.Serialize(answers);

            // Increment index
            session.CurrentQuestionIndex++;

            if (session.CurrentQuestionIndex >= questions.Count)
            {
                // Complete session and generate detailed feedback
                session.IsCompleted = true;
                session.FeedbackJson = GenerateFeedback(questions, answers);
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                isCompleted = session.IsCompleted,
                currentQuestionIndex = session.CurrentQuestionIndex,
                totalQuestions = questions.Count,
                nextQuestion = session.IsCompleted ? null : questions[session.CurrentQuestionIndex],
                feedback = session.IsCompleted ? JsonSerializer.Deserialize<object>(session.FeedbackJson) : null
            });
        }

        // GET: api/interview/session/{id}
        [HttpGet("session/{id}")]
        public async Task<IActionResult> GetSession(string id)
        {
            var session = await _context.InterviewSessions.FindAsync(id);
            if (session == null)
            {
                return NotFound(new { message = "Session not found." });
            }

            return Ok(new
            {
                session.Id,
                session.Topic,
                session.CurrentQuestionIndex,
                session.IsCompleted,
                questions = JsonSerializer.Deserialize<List<InterviewQuestion>>(session.QuestionsJson),
                answers = JsonSerializer.Deserialize<Dictionary<string, string>>(session.AnswersJson),
                feedback = JsonSerializer.Deserialize<object>(session.FeedbackJson)
            });
        }

        private string GenerateFeedback(List<InterviewQuestion> questions, Dictionary<int, string> answers)
        {
            var scores = new List<int>();
            var questionEvaluations = new List<object>();
            var missingKeywordsList = new List<string>();

            foreach (var q in questions)
            {
                string answer = answers.ContainsKey(q.Id) ? answers[q.Id] : "";
                int score = 0;
                var strengths = new List<string>();
                var improvements = new List<string>();

                if (string.IsNullOrWhiteSpace(answer))
                {
                    score = 0;
                    improvements.Add("No answer provided.");
                }
                else
                {
                    // Length check
                    if (answer.Length > 150)
                    {
                        score += 3;
                        strengths.Add("Good explanation length and detail.");
                    }
                    else if (answer.Length > 50)
                    {
                        score += 1;
                        improvements.Add("Try to expand your answers with more context or using the STAR method (Situation, Task, Action, Result).");
                    }
                    else
                    {
                        improvements.Add("Answer is very brief. Provide more technical details and practical examples.");
                    }

                    // Keyword coverage
                    var keywords = q.IdealKeywords.Split(';').Select(k => k.Trim().ToLower()).ToList();
                    int matched = 0;
                    var missed = new List<string>();

                    foreach (var kw in keywords)
                    {
                        if (answer.ToLower().Contains(kw))
                        {
                            matched++;
                        }
                        else
                        {
                            missed.Add(kw);
                            missingKeywordsList.Add(kw);
                        }
                    }

                    double keywordRatio = (double)matched / keywords.Count;
                    if (keywordRatio >= 0.7)
                    {
                        score += 7;
                        strengths.Add($"Strong use of essential industry terminology (e.g. {string.Join(", ", keywords.Take(3))}).");
                    }
                    else if (keywordRatio >= 0.4)
                    {
                        score += 4;
                        strengths.Add("Covered several core concepts.");
                        improvements.Add($"Consider referencing other important design concepts: {string.Join(", ", missed.Take(2))}.");
                    }
                    else
                    {
                        score += 1;
                        improvements.Add($"Missing key technical terms such as: {string.Join(", ", keywords)}.");
                    }
                }

                score = Math.Min(10, score);
                scores.Add(score);

                questionEvaluations.Add(new
                {
                    questionId = q.Id,
                    questionText = q.QuestionText,
                    answerText = answer,
                    score,
                    strengths,
                    improvements
                });
            }

            int averageScore = (int)Math.Round(scores.Average() * 10); // scale out of 100

            string rating = averageScore switch
            {
                >= 85 => "Outstanding",
                >= 70 => "Strong Candidate",
                >= 50 => "Needs Practice",
                _ => "Beginner"
            };

            var overallFeedback = new
            {
                score = averageScore,
                rating,
                evaluations = questionEvaluations,
                strengthsSummary = averageScore >= 70 ? "Excellent structured communication. You showcase strong analytical skills and technical accuracy." : "You have a solid foundation but need to cover more structural keywords in your explanations.",
                improvementsSummary = missingKeywordsList.Any() ? $"Practice articulating concepts like: {string.Join(", ", missingKeywordsList.Distinct().Take(4))}." : "Focus on mock interviewing under tighter time limits."
            };

            return JsonSerializer.Serialize(overallFeedback);
        }
    }
}
