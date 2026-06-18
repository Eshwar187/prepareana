using System.ComponentModel.DataAnnotations;

namespace PrepArena.Api.Models
{
    public class Problem
    {
        [Key]
        public string Id { get; set; } = string.Empty; // e.g. "two-sum"
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty; // Markdown supported
        public string Difficulty { get; set; } = "Easy"; // Easy, Medium, Hard
        public string Category { get; set; } = "General"; // Arrays, Strings, Trees, Dynamic Programming, etc.
        public int TimeLimitMs { get; set; } = 2000;
        public int MemoryLimitMb { get; set; } = 256;

        // Boilerplate starter code shown to students
        public string CsharpBoilerplate { get; set; } = string.Empty;
        public string JavaBoilerplate { get; set; } = string.Empty;
        public string PythonBoilerplate { get; set; } = string.Empty;
        public string CppBoilerplate { get; set; } = string.Empty;
        public string CBoilerplate { get; set; } = string.Empty;
        public string JsBoilerplate { get; set; } = string.Empty;

        // Driver wrappers used by execution engine to grade the solution.
        // These wrapper codes will include a placeholder (e.g. "// {{SOLUTION}}")
        // and execute the test cases.
        public string CsharpDriver { get; set; } = string.Empty;
        public string JavaDriver { get; set; } = string.Empty;
        public string PythonDriver { get; set; } = string.Empty;
        public string CppDriver { get; set; } = string.Empty;
        public string CDriver { get; set; } = string.Empty;
        public string JsDriver { get; set; } = string.Empty;

        public string? VideoUrl { get; set; }

        public ICollection<TestCase> TestCases { get; set; } = new List<TestCase>();
    }
}
