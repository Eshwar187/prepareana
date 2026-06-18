using Microsoft.EntityFrameworkCore;
using PrepArena.Api.Data;
using PrepArena.Api.Models;
using PrepArena.Api.Services;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// Load local configuration file if present (ignored by Git for secrets management)
builder.Configuration.AddJsonFile("appsettings.Local.json", optional: true, reloadOnChange: true);

// Add services to the container.
builder.Services.AddControllers();

// Add PostgreSQL DbContext with fallback to SQLite for local development
var connectionString = builder.Configuration.GetConnectionString("SupabaseConnection")
    ?? Environment.GetEnvironmentVariable("SUPABASE_CONNECTION_STRING");
bool useSqlite = string.IsNullOrEmpty(connectionString) || connectionString.Contains("YOUR_SUPABASE_HOST") || connectionString.Contains("YOUR_PASSWORD");

builder.Services.AddDbContext<AppDbContext>(options =>
{
    if (useSqlite)
    {
        options.UseSqlite("Data Source=prearena.db");
    }
    else
    {
        options.UseNpgsql(connectionString);
    }
});

// Register Compiler Service
builder.Services.AddSingleton<CodeExecutorService>();

// Configure OpenAPI
builder.Services.AddOpenApi();

// Enable CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Auto-initialize PostgreSQL database and seed data
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        context.Database.SetCommandTimeout(300);
        // EnsureCreated compiles models and seeds data defined in OnModelCreating
        context.Database.EnsureCreated();

        bool tablesExist = false;
        try
        {
            _ = context.Problems.Any();
            tablesExist = true;
        }
        catch
        {
            // Problems table does not exist (common when connecting to Supabase for the first time
            // since EnsureCreated skips creation if ANY table exists in the database).
        }

        if (!tablesExist)
        {
            Console.WriteLine("PrepArena: 'Problems' table not found. Creating database schema dynamically...");
            var createScript = context.Database.GenerateCreateScript();
            
            var connection = context.Database.GetDbConnection();
            using (var command = connection.CreateCommand())
            {
                command.CommandText = createScript;
                if (connection.State != System.Data.ConnectionState.Open)
                {
                    connection.Open();
                }
                command.ExecuteNonQuery();
            }
            Console.WriteLine("PrepArena: Database schema created successfully.");
        }

            var seedPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Data", "leetcode150.json");
            if (!File.Exists(seedPath))
            {
                seedPath = Path.Combine(AppContext.BaseDirectory, "leetcode150.json");
            }
            if (!File.Exists(seedPath))
            {
                seedPath = "Data/leetcode150.json";
            }
            if (!File.Exists(seedPath))
            {
                seedPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "leetcode150.json");
            }

            if (File.Exists(seedPath))
            {
                var jsonContent = File.ReadAllText(seedPath);
                var importProblems = JsonSerializer.Deserialize<List<ProblemSeedDto>>(jsonContent, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                if (importProblems != null)
                {
                    var existingProblems = context.Problems.Include(p => p.TestCases).ToDictionary(p => p.Id);
                    var addedCount = 0;
                    var updatedCount = 0;
                    var pendingChangesCount = 0;

                    foreach (var p in importProblems)
                    {
                        existingProblems.TryGetValue(p.Id, out var existingProblem);
                        if (existingProblem != null && 
                            ((p.Id == "powx-n" && existingProblem.JavaBoilerplate.Contains("int[]")) || 
                             (p.Id == "evaluate-reverse-polish-notation" && existingProblem.JavaBoilerplate.Contains("int[]"))))
                        {
                            context.TestCases.RemoveRange(existingProblem.TestCases);
                            context.Problems.Remove(existingProblem);
                            context.SaveChanges();
                            existingProblem = null;
                        }

                        if (existingProblem == null)
                        {
                            var problem = new Problem
                            {
                                Id = p.Id,
                                Title = p.Title,
                                Description = p.Description,
                                Difficulty = p.Difficulty,
                                Category = p.Category,
                                TimeLimitMs = p.TimeLimitMs,
                                MemoryLimitMb = p.MemoryLimitMb,
                                CsharpBoilerplate = p.CsharpBoilerplate,
                                JavaBoilerplate = p.JavaBoilerplate,
                                PythonBoilerplate = p.PythonBoilerplate,
                                CppBoilerplate = p.CppBoilerplate,
                                CBoilerplate = p.CBoilerplate,
                                JsBoilerplate = p.JsBoilerplate,
                                CsharpDriver = p.CsharpDriver ?? "",
                                JavaDriver = p.JavaDriver ?? "",
                                PythonDriver = p.PythonDriver ?? "",
                                CppDriver = p.CppDriver ?? "",
                                CDriver = p.CDriver ?? "",
                                JsDriver = p.JsDriver ?? "",
                                VideoUrl = p.VideoUrl
                            };

                            if (p.TestCases != null)
                            {
                                foreach (var tc in p.TestCases)
                                {
                                    problem.TestCases.Add(new TestCase
                                    {
                                        Input = tc.Input,
                                        ExpectedOutput = tc.ExpectedOutput,
                                        IsSample = tc.IsSample
                                    });
                                }
                            }
                            context.Problems.Add(problem);
                            addedCount++;
                            pendingChangesCount++;
                        }
                        else
                        {
                            bool updated = false;

                            // Update drivers and boilerplates if they are different from seed JSON
                            if (existingProblem.PythonDriver != p.PythonDriver) { existingProblem.PythonDriver = p.PythonDriver ?? ""; updated = true; }
                            if (existingProblem.JavaDriver != p.JavaDriver) { existingProblem.JavaDriver = p.JavaDriver ?? ""; updated = true; }
                            if (existingProblem.CppDriver != p.CppDriver) { existingProblem.CppDriver = p.CppDriver ?? ""; updated = true; }
                            if (existingProblem.CDriver != p.CDriver) { existingProblem.CDriver = p.CDriver ?? ""; updated = true; }
                            if (existingProblem.JsDriver != p.JsDriver) { existingProblem.JsDriver = p.JsDriver ?? ""; updated = true; }
                            if (existingProblem.CsharpDriver != p.CsharpDriver) { existingProblem.CsharpDriver = p.CsharpDriver ?? ""; updated = true; }

                            if (existingProblem.PythonBoilerplate != p.PythonBoilerplate) { existingProblem.PythonBoilerplate = p.PythonBoilerplate; updated = true; }
                            if (existingProblem.JavaBoilerplate != p.JavaBoilerplate) { existingProblem.JavaBoilerplate = p.JavaBoilerplate; updated = true; }
                            if (existingProblem.CppBoilerplate != p.CppBoilerplate) { existingProblem.CppBoilerplate = p.CppBoilerplate; updated = true; }
                            if (existingProblem.CBoilerplate != p.CBoilerplate) { existingProblem.CBoilerplate = p.CBoilerplate; updated = true; }
                            if (existingProblem.JsBoilerplate != p.JsBoilerplate) { existingProblem.JsBoilerplate = p.JsBoilerplate; updated = true; }
                            if (existingProblem.CsharpBoilerplate != p.CsharpBoilerplate) { existingProblem.CsharpBoilerplate = p.CsharpBoilerplate; updated = true; }

                            // Update description and title if different
                            if (existingProblem.Description != p.Description) { existingProblem.Description = p.Description; updated = true; }
                            if (existingProblem.Title != p.Title) { existingProblem.Title = p.Title; updated = true; }

                            // Update video url if different
                            if (existingProblem.VideoUrl != p.VideoUrl)
                            {
                                existingProblem.VideoUrl = p.VideoUrl;
                                updated = true;
                            }

                            // Update testcases if count is 0 or less, or if they changed
                            bool testCasesChanged = false;
                            if (p.TestCases != null)
                            {
                                if (existingProblem.TestCases.Count != p.TestCases.Count)
                                {
                                    testCasesChanged = true;
                                }
                                else
                                {
                                    var sortedExisting = existingProblem.TestCases.OrderBy(tc => tc.Input).ToList();
                                    var sortedImport = p.TestCases.OrderBy(tc => tc.Input).ToList();
                                    for (int i = 0; i < sortedExisting.Count; i++)
                                    {
                                        if (sortedExisting[i].Input != sortedImport[i].Input || 
                                            sortedExisting[i].ExpectedOutput != sortedImport[i].ExpectedOutput ||
                                            sortedExisting[i].IsSample != sortedImport[i].IsSample)
                                        {
                                            testCasesChanged = true;
                                            break;
                                        }
                                    }
                                }
                            }

                            if (testCasesChanged && p.TestCases != null)
                            {
                                context.TestCases.RemoveRange(existingProblem.TestCases);
                                foreach (var tc in p.TestCases)
                                {
                                    existingProblem.TestCases.Add(new TestCase
                                    {
                                        Input = tc.Input,
                                        ExpectedOutput = tc.ExpectedOutput,
                                        IsSample = tc.IsSample
                                    });
                                }
                                updated = true;
                            }
                            else if (existingProblem.TestCases.Count == 0 && p.TestCases != null)
                            {
                                foreach (var tc in p.TestCases)
                                {
                                    existingProblem.TestCases.Add(new TestCase
                                    {
                                        Input = tc.Input,
                                        ExpectedOutput = tc.ExpectedOutput,
                                        IsSample = tc.IsSample
                                    });
                                }
                                updated = true;
                            }

                            if (updated)
                            {
                                updatedCount++;
                                pendingChangesCount++;
                            }
                        }

                        if (pendingChangesCount >= 10)
                        {
                            context.SaveChanges();
                            Console.WriteLine($"Database seeding progress: Added {addedCount} and updated {updatedCount} problems so far.");
                            pendingChangesCount = 0;
                        }
                    }

                    if (pendingChangesCount > 0)
                    {
                        context.SaveChanges();
                        Console.WriteLine($"Database seeding completed: Added {addedCount} and updated {updatedCount} problems.");
                    }
                }
            }
            else
            {
                Console.WriteLine("Warning: leetcode150.json seed file not found at " + Path.GetFullPath(seedPath));
            }
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred creating/seeding the database.");
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();

public class ProblemSeedDto
{
    public string Id { get; set; } = "";
    public string Title { get; set; } = "";
    public string Description { get; set; } = "";
    public string Difficulty { get; set; } = "Easy";
    public string Category { get; set; } = "General";
    public int TimeLimitMs { get; set; } = 2000;
    public int MemoryLimitMb { get; set; } = 256;
    public string CsharpBoilerplate { get; set; } = "";
    public string JavaBoilerplate { get; set; } = "";
    public string PythonBoilerplate { get; set; } = "";
    public string CppBoilerplate { get; set; } = "";
    public string CBoilerplate { get; set; } = "";
    public string JsBoilerplate { get; set; } = "";
    public string? CsharpDriver { get; set; }
    public string? JavaDriver { get; set; }
    public string? PythonDriver { get; set; }
    public string? CppDriver { get; set; }
    public string? CDriver { get; set; }
    public string? JsDriver { get; set; }
    public string? VideoUrl { get; set; }
    public List<TestCaseSeedDto>? TestCases { get; set; }
}

public class TestCaseSeedDto
{
    public string Input { get; set; } = "";
    public string ExpectedOutput { get; set; } = "";
    public bool IsSample { get; set; }
}

