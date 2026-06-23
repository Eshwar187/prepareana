import { useEffect, useState } from 'react';
import { Search, Play, CheckCircle2, Circle, Star, Brain, ArrowRight, Activity } from 'lucide-react';

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
  }, [currentUserEmail]);

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
      
      {/* Inline styles for custom HUD elements */}
      <style>{`
        .filter-chip {
          padding: 6px 14px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          color: var(--text-muted);
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .filter-chip:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
        }
        .filter-chip.active {
          background: rgba(99, 102, 241, 0.1);
          border-color: rgba(99, 102, 241, 0.25);
          color: #6366f1;
          box-shadow: 0 0 10px rgba(99, 102, 241, 0.05);
        }
        .problem-row {
          border-bottom: 1px solid rgba(255,255,255,0.03);
          transition: all 0.2s;
        }
        .problem-row:hover {
          background: rgba(255, 255, 255, 0.015);
        }
        .action-button-glow {
          padding: 6px 12px;
          font-size: 11px;
          font-weight: 700;
          border-radius: 6px;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #fff;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        }
        .action-button-glow:hover {
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
          border-color: rgba(99, 102, 241, 0.3);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
        }
      `}</style>

      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '1.25rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 850, letterSpacing: '-0.03em', color: '#fff', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Brain size={24} style={{ color: 'var(--primary)' }} /> DSA Practice Arena
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>Solve curated interview questions, compile live solutions, and verify tests.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255, 255, 255, 0.02)', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)', fontSize: '0.75rem' }}>
          <Activity size={12} color="#10b981" />
          <span style={{ color: 'var(--text-muted)' }}>Progress: <strong style={{ color: '#fff' }}>{solvedProblemIds.size}</strong> / {problems.length} solved</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        {/* Row 1: Search & Difficulty Chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(0,0,0,0.3)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', minWidth: '320px', transition: 'border-color 0.2s' }}
               onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)'}
               onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}>
            <Search size={14} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by title or topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ background: 'none', border: 'none', color: '#fff', outline: 'none', width: '100%', fontSize: '0.825rem' }}
            />
          </div>

          {/* Difficulty Chips */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
              <button
                key={diff}
                className={`filter-chip ${selectedDifficulty === diff ? 'active' : ''}`}
                onClick={() => setSelectedDifficulty(diff)}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Category Chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', borderTop: '1px dashed rgba(255,255,255,0.03)', paddingTop: '0.75rem' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-chip ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
              style={{ fontSize: '10px', padding: '4px 10px' }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Problems Matrix Table */}
      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', background: 'rgba(14, 14, 18, 0.7)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '1rem', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.015)' }}>
              <th style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.75rem', width: '80px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
              <th style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Problem Title</th>
              <th style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Category</th>
              <th style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', width: '120px' }}>Difficulty</th>
              <th style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right', width: '140px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProblems.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No problems match the active filter criteria.
                </td>
              </tr>
            ) : (
              filteredProblems.map((p) => {
                const isSolved = solvedProblemIds.has(p.id);
                return (
                  <tr key={p.id} className="problem-row">
                    <td style={{ padding: '0.9rem 1.25rem' }}>
                      {isSolved ? (
                        <CheckCircle2 size={15} style={{ color: 'var(--success)' }} />
                      ) : (
                        <Circle size={15} style={{ color: 'var(--text-muted)', opacity: 0.3 }} />
                      )}
                    </td>
                    <td style={{ padding: '0.9rem 1.25rem', fontWeight: 600, fontSize: '0.85rem' }}>
                      <span 
                        onClick={() => onSelectProblem(p.id)} 
                        style={{ cursor: 'pointer', transition: 'color 0.15s', color: '#fff' }}
                        onMouseOver={(e) => e.currentTarget.style.color = '#6366f1'}
                        onMouseOut={(e) => e.currentTarget.style.color = '#fff'}
                      >
                        {p.title}
                      </span>
                    </td>
                    <td style={{ padding: '0.9rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>{p.category}</td>
                    <td style={{ padding: '0.9rem 1.25rem' }}>
                      <span className={`difficulty-badge difficulty-${p.difficulty.toLowerCase()}`} style={{ fontSize: '9px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
                        {p.difficulty}
                      </span>
                    </td>
                    <td style={{ padding: '0.9rem 1.25rem', textAlign: 'right' }}>
                      <button className="action-button-glow" onClick={() => onSelectProblem(p.id)}>
                        Solve <ArrowRight size={11} />
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
