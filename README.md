# PrepArena: DSA & Interview Prep Platform

PrepArena is a premium, feature-rich web application designed for students preparing for technical interviews. It includes a Data Structures and Algorithms (DSA) practice workspace, an interactive multi-language code compiler, and an automated AI-like Mock Interview coach.

---

## 🚀 Key Features

1. **DSA Practice Arena**:
   - Seeding of classic questions from the **LeetCode Top 150** (including *Two Sum*, *Valid Parentheses*, and *Best Time to Buy and Sell Stock*).
   - Light listing and detail views with difficulty badges, categorization, and complete descriptions.

2. **High-Fidelity Code Compiler & Grading Engine**:
   - Supports 6 major programming languages: **C#**, **Java**, **Python**, **C++**, **C**, and **JavaScript**.
   - **Roslyn In-Memory Compiler**: Executes C# solutions in-memory using .NET's Roslyn Scripting API for extremely fast, process-free evaluation.
   - **Process-Based Runners**: Compiles and executes Java, C/C++, Python, and Node.js solutions inside process-bounded, time-limited sandboxes.
   - **Environment Autodetect & Simulation Fallback**: Automatically checks the host machine's PATH for compilers. If one is missing (e.g., GCC or JDK is not installed locally), the backend dynamically activates a logical simulation parser. This allows the system to remain fully testable and functional out-of-the-box in local environments.
   - Gamified celebration: Plays a **canvas-confetti blast** on the frontend when solutions are successfully accepted!

3. **AI Interview Prep Coach**:
   - Simulated Mock Interview sessions covering **Behavioral**, **System Design**, and **C# / .NET** tracks.
   - Prompts the user with structured questions and evaluates answers using an objective keyword analysis, response length verification, and structured STAR method grading.
   - Generates a complete candidate feedback report card showing score, candidate rating, individual question strengths, and areas of improvement.

---

## 🛠️ Technology Stack

- **Backend**: .NET 10 (C# Web API), Entity Framework Core, SQLite (database with automatic seeding).
- **Frontend**: React, TypeScript, Vite, Monaco Code Editor, Lucide Icons, Canvas Confetti.
- **Design**: Premium custom Vanilla CSS layout with a glassmorphic dark-theme, typography hierarchies, and subtle hover animations.

---

## 📂 Project Structure

```
plat/
├── backend/
│   └── PrepArena.Api/
│       ├── Controllers/      # API Endpoints (Problems, Mock Interviews)
│       ├── Data/             # EF Core DBContext & seed data
│       ├── Models/           # DB Entities (Problems, TestCases, Submissions, Sessions)
│       ├── Services/         # CodeExecutorService (Roslyn & Process Sandboxes)
│       └── Program.cs        # DI configuration & auto database setup
└── frontend/
    ├── src/
    │   ├── pages/            # Dashboard, ProblemsList, CodingWorkspace, InterviewPrep
    │   ├── App.tsx           # Router & navigation wrapper
    │   ├── App.css           # Local reset
    │   └── index.css         # Theme design variables & layouts
    └── package.json
```

---

## 🚦 How to Run the Project

### 1. Run the Backend API
The backend will automatically create the SQLite database `prearena.db` and seed all DSA problems, test cases, and mock interview questions on the first start.

```bash
# Navigate to the API folder
cd backend/PrepArena.Api

# Start the .NET web server
dotnet run
```
The backend API will run on:
- HTTP: `http://localhost:5015`
- HTTPS: `https://localhost:7083`

### 2. Run the React Frontend
```bash
# Navigate to the frontend folder
cd frontend

# Start the Vite development server
npm run dev
```
The frontend will launch on:
- Web Browser: `http://localhost:5173`
- (It will automatically make API calls to the C# backend on port 5015).
