using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using PrepArena.Api.Models;

namespace PrepArena.Api.Services
{
    public class ExecutionResult
    {
        public string Status { get; set; } = "Accepted"; // Accepted, Wrong Answer, Compile Error, Runtime Error, Time Limit Exceeded
        public int ExecutionTimeMs { get; set; }
        public string? CompilerMessage { get; set; }
        public string? ActualOutput { get; set; }
        public int? FailedTestCaseIndex { get; set; }
    }

    public class CodeExecutorService
    {
        private readonly string _tempDir;

        public CodeExecutorService()
        {
            _tempDir = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "temp_runs");
            if (!Directory.Exists(_tempDir))
            {
                Directory.CreateDirectory(_tempDir);
            }
        }

        public async Task<ExecutionResult> ExecuteSolutionAsync(Problem problem, string code, string language, List<TestCase> testCases)
        {
            // First, check if the runtime/compiler is available. If not, return compiler diagnostic error
            bool isRuntimeAvailable = CheckRuntimeAvailability(language);
            
            if (!isRuntimeAvailable && language != "csharp")
            {
                return new ExecutionResult
                {
                    Status = "Compile Error",
                    CompilerMessage = $"Error: The compiler/runtime for {language} is not installed or not available in the system PATH. Please install it on the host system."
                };
            }

            try
            {
                if (language == "csharp")
                {
                    return await ExecuteCsharpInMemoryAsync(problem, code, testCases);
                }
                else if (language == "javascript")
                {
                    return await ExecuteJavascriptAsync(problem, code, testCases);
                }
                else if (language == "python")
                {
                    return await ExecutePythonAsync(problem, code, testCases);
                }
                else if (language == "java")
                {
                    return await ExecuteJavaAsync(problem, code, testCases);
                }
                else if (language == "cpp" || language == "c")
                {
                    return await ExecuteCppOrCAsync(problem, code, language, testCases);
                }
            }
            catch (Exception ex)
            {
                return new ExecutionResult
                {
                    Status = "Runtime Error",
                    CompilerMessage = $"Internal Executor Error: {ex.Message}\n{ex.StackTrace}"
                };
            }

            return new ExecutionResult
            {
                Status = "Compile Error",
                CompilerMessage = $"Unsupported language: {language}"
            };
        }

        private bool CheckRuntimeAvailability(string language)
        {
            string command = language switch
            {
                "javascript" => "node",
                "python" => "py",
                "java" => "javac",
                "cpp" => "g++",
                "c" => "gcc",
                _ => ""
            };

            if (string.IsNullOrEmpty(command)) return true; // C# in-memory is always available

            try
            {
                using var process = new Process
                {
                    StartInfo = new ProcessStartInfo
                    {
                        FileName = "where",
                        Arguments = command,
                        RedirectStandardOutput = true,
                        RedirectStandardError = true,
                        UseShellExecute = false,
                        CreateNoWindow = true
                    }
                };
                process.Start();
                process.WaitForExit(1000);
                return process.ExitCode == 0;
            }
            catch
            {
                return false;
            }
        }

        private async Task<ExecutionResult> ExecuteCsharpInMemoryAsync(Problem problem, string code, List<TestCase> testCases)
        {
            var stopwatch = Stopwatch.StartNew();
            string csharpDriver = problem.CsharpDriver ?? "";
            
            // Apply patch for void return type
            if (csharpDriver.Contains("if (method.ReturnType != typeof(void)) {"))
            {
                csharpDriver = csharpDriver.Replace(
                    "if (method.ReturnType != typeof(void)) {\n            Console.WriteLine(JsonSerializer.Serialize(result));\n        }",
                    "if (method.ReturnType != typeof(void)) {\n            Console.WriteLine(JsonSerializer.Serialize(result));\n        } else if (args.Count > 0 && args[0] != null) {\n            Console.WriteLine(JsonSerializer.Serialize(args[0]));\n        }"
                );
                csharpDriver = csharpDriver.Replace(
                    "if (method.ReturnType != typeof(void)) {\r\n            Console.WriteLine(JsonSerializer.Serialize(result));\r\n        }",
                    "if (method.ReturnType != typeof(void)) {\r\n            Console.WriteLine(JsonSerializer.Serialize(result));\r\n        } else if (args.Count > 0 && args[0] != null) {\r\n            Console.WriteLine(JsonSerializer.Serialize(args[0]));\r\n        }"
                );
            }

            var lines = csharpDriver.Split(new[] { "\r\n", "\n" }, StringSplitOptions.None);
            var usings = lines.Where(l => l.Trim().StartsWith("using ")).ToList();
            var rest = lines.Where(l => !l.Trim().StartsWith("using ")).ToList();
            
            string cleanedDriver = string.Join("\n", rest);
            string solutionPlaceholdersReplaced = cleanedDriver.Replace("// {{SOLUTION}}", code);
            string fullCode = string.Join("\n", usings) + "\n\n" + solutionPlaceholdersReplaced;

            var syntaxTree = CSharpSyntaxTree.ParseText(fullCode);
            var assemblyName = $"DynamicRun_{Guid.NewGuid():N}";
            
            // Collect standard references
            var references = new List<MetadataReference>
            {
                MetadataReference.CreateFromFile(typeof(object).Assembly.Location),
                MetadataReference.CreateFromFile(typeof(Console).Assembly.Location),
                MetadataReference.CreateFromFile(typeof(System.Text.Json.JsonSerializer).Assembly.Location),
                MetadataReference.CreateFromFile(typeof(System.Linq.Enumerable).Assembly.Location)
            };
            
            // Add other core references that might be needed by the runtime
            var coreDir = Path.GetDirectoryName(typeof(object).Assembly.Location);
            if (coreDir != null)
            {
                references.Add(MetadataReference.CreateFromFile(Path.Combine(coreDir, "System.Runtime.dll")));
                references.Add(MetadataReference.CreateFromFile(Path.Combine(coreDir, "System.Collections.dll")));
                references.Add(MetadataReference.CreateFromFile(Path.Combine(coreDir, "System.Text.Json.dll")));
            }

            var compilation = CSharpCompilation.Create(assemblyName)
                .WithOptions(new CSharpCompilationOptions(OutputKind.ConsoleApplication))
                .AddReferences(references)
                .AddSyntaxTrees(syntaxTree);

            using var ms = new MemoryStream();
            var emitResult = compilation.Emit(ms);

            if (!emitResult.Success)
            {
                string errors = string.Join("\n", emitResult.Diagnostics
                    .Where(d => d.Severity == DiagnosticSeverity.Error)
                    .Select(d => $"{d.Id}: {d.GetMessage()} at {d.Location.GetLineSpan().StartLinePosition}"));

                return new ExecutionResult
                {
                    Status = "Compile Error",
                    CompilerMessage = errors
                };
            }

            ms.Seek(0, SeekOrigin.Begin);
            var assembly = Assembly.Load(ms.ToArray());
            var entryPoint = assembly.EntryPoint;

            if (entryPoint == null)
            {
                return new ExecutionResult
                {
                    Status = "Runtime Error",
                    CompilerMessage = "EntryPoint (Main method) not found in compiled C# assembly."
                };
            }

            // Execute each test case
            for (int i = 0; i < testCases.Count; i++)
            {
                var tc = testCases[i];
                var tcStopwatch = Stopwatch.StartNew();

                var originalIn = Console.In;
                var originalOut = Console.Out;

                using var stringWriter = new StringWriter();
                using var stringReader = new StringReader(tc.Input);

                Console.SetIn(stringReader);
                Console.SetOut(stringWriter);

                try
                {
                    var parameters = entryPoint.GetParameters().Length == 0 ? null : new object[] { Array.Empty<string>() };
                    
                    // Run execution asynchronously or within a task limit
                    var runTask = Task.Run(() => entryPoint.Invoke(null, parameters));
                    var delayTask = Task.Delay(problem.TimeLimitMs);

                    var completedTask = await Task.WhenAny(runTask, delayTask);
                    if (completedTask == delayTask)
                    {
                        Console.SetIn(originalIn);
                        Console.SetOut(originalOut);
                        return new ExecutionResult
                        {
                            Status = "Time Limit Exceeded",
                            FailedTestCaseIndex = i,
                            ExecutionTimeMs = (int)tcStopwatch.ElapsedMilliseconds
                        };
                    }

                    // Await the task to check for exceptions
                    await runTask;

                    Console.SetIn(originalIn);
                    Console.SetOut(originalOut);

                    string output = stringWriter.ToString().Trim();
                    string expected = tc.ExpectedOutput.Trim();

                    // Compare outputs
                    if (!AreOutputsEqual(output, expected))
                    {
                        return new ExecutionResult
                        {
                            Status = "Wrong Answer",
                            FailedTestCaseIndex = i,
                            ActualOutput = output,
                            ExecutionTimeMs = (int)tcStopwatch.ElapsedMilliseconds
                        };
                    }
                }
                catch (Exception ex)
                {
                    Console.SetIn(originalIn);
                    Console.SetOut(originalOut);
                    var innerEx = ex.InnerException ?? ex;
                    return new ExecutionResult
                    {
                        Status = "Runtime Error",
                        CompilerMessage = $"{innerEx.GetType().Name}: {innerEx.Message}\n{innerEx.StackTrace}",
                        FailedTestCaseIndex = i
                    };
                }
            }

            return new ExecutionResult
            {
                Status = "Accepted",
                ExecutionTimeMs = (int)stopwatch.ElapsedMilliseconds
            };
        }

        private async Task<ExecutionResult> ExecuteJavascriptAsync(Problem problem, string code, List<TestCase> testCases)
        {
            string runId = Guid.NewGuid().ToString("N");
            string filePath = Path.Combine(_tempDir, $"solution_{runId}.js");
            string jsDriver = problem.JsDriver ?? "";
            if (jsDriver.Contains("const res = func.apply(null, args);"))
            {
                jsDriver = jsDriver.Replace(
                    "const res = func.apply(null, args);\n    console.log(JSON.stringify(res));",
                    "const res = func.apply(null, args);\n    if (res !== undefined) {\n        console.log(JSON.stringify(res));\n    } else if (args.length > 0) {\n        console.log(JSON.stringify(args[0]));\n    } else {\n        console.log(JSON.stringify(res));\n    }"
                );
                jsDriver = jsDriver.Replace(
                    "const res = func.apply(null, args);\r\n    console.log(JSON.stringify(res));",
                    "const res = func.apply(null, args);\r\n    if (res !== undefined) {\r\n        console.log(JSON.stringify(res));\r\n    } else if (args.length > 0) {\r\n        console.log(JSON.stringify(args[0]));\r\n    } else {\r\n        console.log(JSON.stringify(res));\r\n    }"
                );
            }
            
            // Completely bypass the global scope search loop in JS driver
            jsDriver = jsDriver.Replace(
                "for (let key in global) {\n        if (typeof global[key] === 'function' && key !== 'Buffer' && key !== 'clearImmediate' && key !== 'clearInterval') {\n            func = global[key];\n            break;\n        }\n    }",
                ""
            );
            jsDriver = jsDriver.Replace(
                "for (let key in global) {\r\n        if (typeof global[key] === 'function' && key !== 'Buffer' && key !== 'clearImmediate' && key !== 'clearInterval') {\r\n            func = global[key];\r\n            break;\r\n        }\r\n    }",
                ""
            );

            string fullCode = jsDriver.Replace("// {{SOLUTION}}", code);

            await File.WriteAllTextAsync(filePath, fullCode);

            try
            {
                var stopwatch = Stopwatch.StartNew();
                for (int i = 0; i < testCases.Count; i++)
                {
                    var tc = testCases[i];
                    var (output, error, exitCode, timedOut) = await RunProcessAsync("node", $"\"{filePath}\"", tc.Input, problem.TimeLimitMs);

                    if (timedOut)
                    {
                        return new ExecutionResult
                        {
                            Status = "Time Limit Exceeded",
                            FailedTestCaseIndex = i,
                            ExecutionTimeMs = (int)stopwatch.ElapsedMilliseconds
                        };
                    }

                    if (exitCode != 0)
                    {
                        return new ExecutionResult
                        {
                            Status = "Runtime Error",
                            CompilerMessage = error,
                            FailedTestCaseIndex = i
                        };
                    }

                    if (!AreOutputsEqual(output, tc.ExpectedOutput))
                    {
                        return new ExecutionResult
                        {
                            Status = "Wrong Answer",
                            FailedTestCaseIndex = i,
                            ActualOutput = output,
                            ExecutionTimeMs = (int)stopwatch.ElapsedMilliseconds
                        };
                    }
                }

                return new ExecutionResult
                {
                    Status = "Accepted",
                    ExecutionTimeMs = (int)stopwatch.ElapsedMilliseconds
                };
            }
            finally
            {
                SafeDeleteFile(filePath);
            }
        }

        private async Task<ExecutionResult> ExecutePythonAsync(Problem problem, string code, List<TestCase> testCases)
        {
            string runId = Guid.NewGuid().ToString("N");
            string filePath = Path.Combine(_tempDir, $"solution_{runId}.py");
            string pythonDriver = problem.PythonDriver ?? "";
            if (pythonDriver.Contains("result = method(*args)"))
            {
                pythonDriver = pythonDriver.Replace(
                    "result = method(*args)\n    print(json.dumps(result))",
                    "result = method(*args)\n    if result is not None:\n        print(json.dumps(result))\n    elif len(args) > 0:\n        print(json.dumps(args[0]))\n    else:\n        print(json.dumps(result))"
                );
                pythonDriver = pythonDriver.Replace(
                    "result = method(*args)\r\n    print(json.dumps(result))",
                    "result = method(*args)\r\n    if result is not None:\r\n        print(json.dumps(result))\r\n    elif len(args) > 0:\r\n        print(json.dumps(args[0]))\r\n    else:\r\n        print(json.dumps(result))"
                );
            }
            string fullCode = pythonDriver.Replace("# {{SOLUTION}}", code);

            await File.WriteAllTextAsync(filePath, fullCode);

            try
            {
                var stopwatch = Stopwatch.StartNew();
                for (int i = 0; i < testCases.Count; i++)
                {
                    var tc = testCases[i];
                    var (output, error, exitCode, timedOut) = await RunProcessAsync("py", $"\"{filePath}\"", tc.Input, problem.TimeLimitMs);

                    if (timedOut)
                    {
                        return new ExecutionResult
                        {
                            Status = "Time Limit Exceeded",
                            FailedTestCaseIndex = i,
                            ExecutionTimeMs = (int)stopwatch.ElapsedMilliseconds
                        };
                    }

                    if (exitCode != 0)
                    {
                        return new ExecutionResult
                        {
                            Status = "Runtime Error",
                            CompilerMessage = error,
                            FailedTestCaseIndex = i
                        };
                    }

                    if (!AreOutputsEqual(output, tc.ExpectedOutput))
                    {
                        return new ExecutionResult
                        {
                            Status = "Wrong Answer",
                            FailedTestCaseIndex = i,
                            ActualOutput = output,
                            ExecutionTimeMs = (int)stopwatch.ElapsedMilliseconds
                        };
                    }
                }

                return new ExecutionResult
                {
                    Status = "Accepted",
                    ExecutionTimeMs = (int)stopwatch.ElapsedMilliseconds
                };
            }
            finally
            {
                SafeDeleteFile(filePath);
            }
        }

        private async Task<ExecutionResult> ExecuteJavaAsync(Problem problem, string code, List<TestCase> testCases)
        {
            string runId = Guid.NewGuid().ToString("N");
            // Java source files must be compiled. The driver is class "Program", so we must write it to Program.java inside a subfolder
            string classDir = Path.Combine(_tempDir, $"run_{runId}");
            Directory.CreateDirectory(classDir);
            
            string filePath = Path.Combine(classDir, "Program.java");
            string javaDriver = problem.JavaDriver ?? "";
            if (javaDriver.Contains("if (targetMethod.getReturnType() != void.class) {"))
            {
                javaDriver = javaDriver.Replace(
                    "if (targetMethod.getReturnType() != void.class) {\n            System.out.println(serializeResult(result));\n        }",
                    "if (targetMethod.getReturnType() != void.class) {\n            System.out.println(serializeResult(result));\n        } else if (methodArgs.length > 0 && methodArgs[0] != null) {\n            System.out.println(serializeResult(methodArgs[0]));\n        }"
                );
                javaDriver = javaDriver.Replace(
                    "if (targetMethod.getReturnType() != void.class) {\r\n            System.out.println(serializeResult(result));\r\n        }",
                    "if (targetMethod.getReturnType() != void.class) {\r\n            System.out.println(serializeResult(result));\r\n        } else if (methodArgs.length > 0 && methodArgs[0] != null) {\r\n            System.out.println(serializeResult(methodArgs[0]));\r\n        }"
                );
            }
            var lines = javaDriver.Split(new[] { "\r\n", "\n" }, StringSplitOptions.None);
            var driverImports = lines.Where(l => l.Trim().StartsWith("import ")).ToList();
            var driverRest = lines.Where(l => !l.Trim().StartsWith("import ")).ToList();
            
            string cleanedDriver = string.Join("\n", driverRest);
            string solutionPlaceholdersReplaced = cleanedDriver.Replace("// {{SOLUTION}}", code);
            string fullCode = string.Join("\n", driverImports) + "\n\n" + solutionPlaceholdersReplaced;

            await File.WriteAllTextAsync(filePath, fullCode);

            try
            {
                // Compile
                var (cOut, cErr, cExitCode, cTimedOut) = await RunProcessAsync("javac", "Program.java", "", 5000, classDir);
                if (cTimedOut)
                {
                    return new ExecutionResult { Status = "Compile Error", CompilerMessage = "Compilation Timed Out." };
                }
                if (cExitCode != 0)
                {
                    return new ExecutionResult { Status = "Compile Error", CompilerMessage = cErr };
                }

                var stopwatch = Stopwatch.StartNew();
                for (int i = 0; i < testCases.Count; i++)
                {
                    var tc = testCases[i];
                    var (output, error, exitCode, timedOut) = await RunProcessAsync("java", "Program", tc.Input, problem.TimeLimitMs, classDir);

                    if (timedOut)
                    {
                        return new ExecutionResult
                        {
                            Status = "Time Limit Exceeded",
                            FailedTestCaseIndex = i,
                            ExecutionTimeMs = (int)stopwatch.ElapsedMilliseconds
                        };
                    }

                    if (exitCode != 0)
                    {
                        return new ExecutionResult
                        {
                            Status = "Runtime Error",
                            CompilerMessage = error,
                            FailedTestCaseIndex = i
                        };
                    }

                    if (!AreOutputsEqual(output, tc.ExpectedOutput))
                    {
                        return new ExecutionResult
                        {
                            Status = "Wrong Answer",
                            FailedTestCaseIndex = i,
                            ActualOutput = output,
                            ExecutionTimeMs = (int)stopwatch.ElapsedMilliseconds
                        };
                    }
                }

                return new ExecutionResult
                {
                    Status = "Accepted",
                    ExecutionTimeMs = (int)stopwatch.ElapsedMilliseconds
                };
            }
            finally
            {
                SafeDeleteDirectory(classDir);
            }
        }

        private async Task<ExecutionResult> ExecuteCppOrCAsync(Problem problem, string code, string language, List<TestCase> testCases)
        {
            string runId = Guid.NewGuid().ToString("N");
            string ext = language == "cpp" ? "cpp" : "c";
            string srcFile = Path.Combine(_tempDir, $"solution_{runId}.{ext}");
            string exeFile = Path.Combine(_tempDir, $"solution_{runId}.exe");
            
            string driver = language == "cpp" ? (problem.CppDriver ?? "") : (problem.CDriver ?? "");
            var lines = driver.Split(new[] { "\r\n", "\n" }, StringSplitOptions.None);
            var includes = lines.Where(l => l.Trim().StartsWith("#include") || l.Trim().StartsWith("using ")).ToList();
            var rest = lines.Where(l => !l.Trim().StartsWith("#include") && !l.Trim().StartsWith("using ")).ToList();
            
            string cleanedDriver = string.Join("\n", rest);
            string solutionPlaceholdersReplaced = cleanedDriver.Replace("// {{SOLUTION}}", code);
            string fullCode = string.Join("\n", includes) + "\n\n" + solutionPlaceholdersReplaced;

            await File.WriteAllTextAsync(srcFile, fullCode);

            try
            {
                // Compile
                string compiler = language == "cpp" ? "g++" : "gcc";
                var (cOut, cErr, cExitCode, cTimedOut) = await RunProcessAsync(compiler, $"\"{srcFile}\" -o \"{exeFile}\"", "", 6000);
                if (cTimedOut)
                {
                    return new ExecutionResult { Status = "Compile Error", CompilerMessage = "Compilation Timed Out." };
                }
                if (cExitCode != 0)
                {
                    return new ExecutionResult { Status = "Compile Error", CompilerMessage = cErr };
                }

                var stopwatch = Stopwatch.StartNew();
                for (int i = 0; i < testCases.Count; i++)
                {
                    var tc = testCases[i];
                    var (output, error, exitCode, timedOut) = await RunProcessAsync(exeFile, "", tc.Input, problem.TimeLimitMs);

                    if (timedOut)
                    {
                        return new ExecutionResult
                        {
                            Status = "Time Limit Exceeded",
                            FailedTestCaseIndex = i,
                            ExecutionTimeMs = (int)stopwatch.ElapsedMilliseconds
                        };
                    }

                    if (exitCode != 0)
                    {
                        return new ExecutionResult
                        {
                            Status = "Runtime Error",
                            CompilerMessage = error,
                            FailedTestCaseIndex = i
                        };
                    }

                    if (!AreOutputsEqual(output, tc.ExpectedOutput))
                    {
                        return new ExecutionResult
                        {
                            Status = "Wrong Answer",
                            FailedTestCaseIndex = i,
                            ActualOutput = output,
                            ExecutionTimeMs = (int)stopwatch.ElapsedMilliseconds
                        };
                    }
                }

                return new ExecutionResult
                {
                    Status = "Accepted",
                    ExecutionTimeMs = (int)stopwatch.ElapsedMilliseconds
                };
            }
            finally
            {
                SafeDeleteFile(srcFile);
                SafeDeleteFile(exeFile);
            }
        }

        private async Task<(string stdout, string stderr, int exitCode, bool timedOut)> RunProcessAsync(
            string fileName, string arguments, string stdin, int timeoutMs, string? workingDir = null)
        {
            using var process = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = fileName,
                    Arguments = arguments,
                    RedirectStandardInput = true,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true,
                    WorkingDirectory = workingDir ?? _tempDir
                }
            };

            process.Start();

            if (!string.IsNullOrEmpty(stdin))
            {
                await process.StandardInput.WriteAsync(stdin);
                process.StandardInput.Close();
            }

            var outputTask = process.StandardOutput.ReadToEndAsync();
            var errorTask = process.StandardError.ReadToEndAsync();

            var timeoutTask = Task.Delay(timeoutMs);
            var processExitTask = Task.Run(() => process.WaitForExit());

            var completedTask = await Task.WhenAny(timeoutTask, processExitTask);

            if (completedTask == timeoutTask)
            {
                try { process.Kill(); } catch { }
                return ("", "Time Limit Exceeded", -1, true);
            }

            string stdout = await outputTask;
            string stderr = await errorTask;

            return (stdout.Trim(), stderr.Trim(), process.ExitCode, false);
        }

        private bool AreOutputsEqual(string actual, string expected)
        {
            string cleanActual = CleanJsonString(actual);
            string cleanExpected = CleanJsonString(expected);
            return string.Equals(cleanActual, cleanExpected, StringComparison.OrdinalIgnoreCase);
        }

        private string CleanJsonString(string str)
        {
            // Remove whitespace, quotes, braces, and bracket mismatches for fuzzy equality checks if needed
            string clean = str.Trim().Replace(" ", "").Replace("\r", "").Replace("\n", "");
            // If it's boolean conversion
            if (clean == "True") return "true";
            if (clean == "False") return "false";
            return clean;
        }



        private void SafeDeleteFile(string path)
        {
            try { if (File.Exists(path)) File.Delete(path); } catch { }
        }

        private void SafeDeleteDirectory(string path)
        {
            try { if (Directory.Exists(path)) Directory.Delete(path, true); } catch { }
        }
    }
}
