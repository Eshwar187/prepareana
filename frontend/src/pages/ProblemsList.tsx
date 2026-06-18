import { useEffect, useState } from 'react';
import { Search, Play, CheckCircle2, Circle } from 'lucide-react';

interface Problem {
  id: string;
  title: string;
  difficulty: string;
  category: string;
  timeLimitMs: number;
  memoryLimitMb: number;
  testCasesCount: number;
}

interface ProblemsListProps {
  onSelectProblem: (id: string) => void;
  currentUserEmail?: string;
}

export default function ProblemsList({ onSelectProblem, currentUserEmail }: ProblemsListProps) {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [solvedProblemIds, setSolvedProblemIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const headers: Record<string, string> = {};
    if (currentUserEmail) {
      headers['X-User-Email'] = currentUserEmail;
    }
    // Fetch problems list
    const fetchProblems = fetch('http://localhost:5015/api/problems').then(res => res.json());
    // Fetch submissions list to find solved problems
    const fetchSubmissions = fetch('http://localhost:5015/api/problems/submissions', { headers }).then(res => res.json());

    Promise.all([fetchProblems, fetchSubmissions])
      .then(([problemsData, submissionsData]) => {
        setProblems(problemsData);
        
        // Extract solved problem IDs
        const solved = new Set<string>(
          submissionsData
            .filter((sub: any) => sub.status === 'Accepted')
            .map((sub: any) => sub.problemId)
        );
        setSolvedProblemIds(solved);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching problems:', err);
        // Fallback
        setProblems([
          { id: 'two-sum', title: 'Two Sum', difficulty: 'Easy', category: 'Arrays & Hashing', timeLimitMs: 2000, memoryLimitMb: 256, testCasesCount: 3 },
          { id: 'valid-parentheses', title: 'Valid Parentheses', difficulty: 'Easy', category: 'Stacks', timeLimitMs: 2000, memoryLimitMb: 256, testCasesCount: 4 },
          { id: 'best-time-to-buy-and-sell-stock', title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', category: 'Sliding Window', timeLimitMs: 2000, memoryLimitMb: 256, testCasesCount: 3 }
        ]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </div>
    );
  }

  // Get unique categories for filter
  const categories = ['All', ...Array.from(new Set(problems.map(p => p.category)))];

  // Filter problems
  const filteredProblems = problems.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#fff', marginBottom: '0.25rem' }}>DSA Practice Arena</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Solve curated interview questions, compiler execution tests, and test-case verification.</p>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel" style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.85rem 1.25rem',
        background: '#18181b',
        border: '1px solid var(--border-color)',
        borderRadius: '0.5rem'
      }}>
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#09090b', padding: '0.45rem 1rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)', minWidth: '280px' }}>
          <Search size={14} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search problems..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ background: 'none', border: 'none', color: '#fff', outline: 'none', width: '100%', fontSize: '0.85rem' }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Difficulty */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Difficulty:</span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              style={{ background: '#09090b', color: '#fff', border: '1px solid var(--border-color)', padding: '0.4rem 0.75rem', borderRadius: '0.375rem', outline: 'none', fontSize: '0.8rem' }}
            >
              <option value="All">All</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Category */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ background: '#09090b', color: '#fff', border: '1px solid var(--border-color)', padding: '0.4rem 0.75rem', borderRadius: '0.375rem', outline: 'none', fontSize: '0.8rem' }}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Problems Grid / Table */}
      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', background: '#18181b', border: '1px solid var(--border-color)', borderRadius: '0.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', background: '#18181b' }}>
              <th style={{ padding: '0.85rem 1.25rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.75rem', width: '80px' }}>Status</th>
              <th style={{ padding: '0.85rem 1.25rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.75rem' }}>Title</th>
              <th style={{ padding: '0.85rem 1.25rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.75rem' }}>Category</th>
              <th style={{ padding: '0.85rem 1.25rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.75rem' }}>Difficulty</th>
              <th style={{ padding: '0.85rem 1.25rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.75rem', textAlign: 'right', width: '120px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProblems.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No problems match the selected filters.
                </td>
              </tr>
            ) : (
              filteredProblems.map((p) => {
                const isSolved = solvedProblemIds.has(p.id);
                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.15s' }}>
                    <td style={{ padding: '0.85rem 1.25rem' }}>
                      {isSolved ? (
                        <CheckCircle2 size={16} style={{ color: 'var(--success)' }} />
                      ) : (
                        <Circle size={16} style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
                      )}
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', fontWeight: 500, fontSize: '0.875rem' }}>
                      <span 
                        onClick={() => onSelectProblem(p.id)} 
                        style={{ cursor: 'pointer', transition: 'color 0.15s', color: '#fff' }}
                        onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'}
                        onMouseOut={(e) => e.currentTarget.style.color = '#fff'}
                      >
                        {p.title}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{p.category}</td>
                    <td style={{ padding: '0.85rem 1.25rem' }}>
                      <span className={`difficulty-badge difficulty-${p.difficulty.toLowerCase()}`}>
                        {p.difficulty}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                      <button className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }} onClick={() => onSelectProblem(p.id)}>
                        <Play size={10} style={{ fill: 'currentColor' }} /> Solve
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
