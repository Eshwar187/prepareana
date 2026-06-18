import { useEffect, useState } from 'react';
import { BookOpen, Award, Flame, Play, MessageSquare, History, CheckCircle2, XCircle } from 'lucide-react';

interface Submission {
  id: number;
  problemId: string;
  language: string;
  status: string;
  submittedAt: string;
  executionTimeMs: number;
}

interface Stats {
  totalProblems: number;
  solvedProblems: number;
  recentSubmissions: Submission[];
  solvedDifficulty: { difficulty: string; count: number }[];
}

interface DashboardProps {
  onNavigate: (page: string, problemId?: string | null) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5015/api/problems/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching stats:', err);
        // Fallback for offline development
        setStats({
          totalProblems: 3,
          solvedProblems: 1,
          recentSubmissions: [
            { id: 1, problemId: 'two-sum', language: 'javascript', status: 'Accepted', submittedAt: new Date().toISOString(), executionTimeMs: 15 }
          ],
          solvedDifficulty: [
            { difficulty: 'Easy', count: 1 }
          ]
        });
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const easySolved = stats?.solvedDifficulty.find(d => d.difficulty === 'Easy')?.count || 0;
  const mediumSolved = stats?.solvedDifficulty.find(d => d.difficulty === 'Medium')?.count || 0;
  const hardSolved = stats?.solvedDifficulty.find(d => d.difficulty === 'Hard')?.count || 0;
  const solvedCount = stats?.solvedProblems || 0;
  const totalCount = stats?.totalProblems || 3;
  const solvedPercent = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Banner */}
      <div className="glass-panel" style={{
        background: 'linear-gradient(135deg, #18181b 0%, #09090b 100%)',
        border: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '2rem',
        borderRadius: '0.75rem',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#fff' }}>Welcome back, Developer! 🚀</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>Ready to ace your next technical interview? Practice DSA problems and mock interview panels.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-primary" onClick={() => onNavigate('problems')}>
            <Play size={14} /> Start Practice
          </button>
          <button className="btn btn-secondary" onClick={() => onNavigate('interview')}>
            <MessageSquare size={14} /> Mock Interview
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid-3">
        {/* Solved Donut */}
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem' }}>
          <div style={{ position: 'relative', width: '80px', height: '80px' }}>
            <svg width="80" height="80" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="var(--border-color)"
                strokeWidth="2"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="var(--primary)"
                strokeDasharray={`${solvedPercent}, 100`}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{solvedCount}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>/{totalCount}</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500 }}>DSA Progress</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>{solvedPercent}% Solved</span>
          </div>
        </div>

        {/* Streak card */}
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem' }}>
          <div style={{
            background: '#27272a',
            border: '1px solid var(--border-color)',
            padding: '0.75rem',
            borderRadius: '50%',
            color: 'var(--warning)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Flame size={24} fill="var(--warning)" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500 }}>Coding Streak</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>5 Days Streak</span>
          </div>
        </div>

        {/* Level breakdown */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
            <span style={{ color: 'var(--success)', fontWeight: 500 }}>Easy</span>
            <span style={{ fontWeight: 600, color: '#fff' }}>{easySolved} solved</span>
          </div>
          <div style={{ background: '#09090b', height: '4px', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ background: 'var(--success)', height: '100%', width: `${(easySolved / (solvedCount || 1)) * 100}%` }}></div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginTop: '0.15rem' }}>
            <span style={{ color: 'var(--warning)', fontWeight: 500 }}>Medium</span>
            <span style={{ fontWeight: 600, color: '#fff' }}>{mediumSolved} solved</span>
          </div>
          <div style={{ background: '#09090b', height: '4px', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ background: 'var(--warning)', height: '100%', width: `${(mediumSolved / (solvedCount || 1)) * 100}%` }}></div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginTop: '0.15rem' }}>
            <span style={{ color: 'var(--danger)', fontWeight: 500 }}>Hard</span>
            <span style={{ fontWeight: 600, color: '#fff' }}>{hardSolved} solved</span>
          </div>
          <div style={{ background: '#09090b', height: '4px', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ background: 'var(--danger)', height: '100%', width: `${(hardSolved / (solvedCount || 1)) * 100}%` }}></div>
          </div>
        </div>
      </div>

      {/* Main Grid: Submissions & Recommendations */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Recent Submissions */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <History size={16} style={{ color: 'var(--primary)' }} />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', margin: 0 }}>Recent Submissions</h2>
          </div>

          {stats?.recentSubmissions.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No submissions yet. Pick a problem and compile!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {stats?.recentSubmissions.map((sub, idx) => (
                <div key={sub.id || idx} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem 1rem',
                  background: '#18181b',
                  borderRadius: '0.5rem',
                  border: '1px solid var(--border-color)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {sub.status === 'Accepted' ? (
                      <CheckCircle2 size={16} style={{ color: 'var(--success)' }} />
                    ) : (
                      <XCircle size={16} style={{ color: 'var(--danger)' }} />
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                      <span 
                        onClick={() => onNavigate('workspace', sub.problemId)}
                        style={{ fontWeight: 600, cursor: 'pointer', color: '#fff', fontSize: '0.85rem' }}
                        onMouseOver={(e) => (e.currentTarget.style.color = 'var(--primary)')}
                        onMouseOut={(e) => (e.currentTarget.style.color = '#fff')}
                      >
                        {sub.problemId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {sub.language.toUpperCase()} • {sub.executionTimeMs} ms
                      </span>
                    </div>
                  </div>
                  <span className={`difficulty-badge ${sub.status === 'Accepted' ? 'difficulty-easy' : 'difficulty-hard'}`} style={{ fontSize: '0.7rem' }}>
                    {sub.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Preparation Guide Card */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={16} style={{ color: 'var(--warning)' }} />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', margin: 0 }}>Focus Areas</h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <div style={{ background: '#27272a', border: '1px solid var(--border-color)', padding: '0.4rem', borderRadius: '0.375rem', color: 'var(--primary)', display: 'flex' }}>
                <BookOpen size={14} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#fff' }}>Two Sum Problem</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>Practice array mapping and hash index lookups.</span>
                <span 
                  onClick={() => onNavigate('workspace', 'two-sum')}
                  style={{ fontSize: '0.75rem', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600, marginTop: '0.2rem' }}
                >
                  Solve Now →
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <div style={{ background: '#27272a', border: '1px solid var(--border-color)', padding: '0.4rem', borderRadius: '0.375rem', color: 'var(--success)', display: 'flex' }}>
                <MessageSquare size={14} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#fff' }}>Behavioral Conflict Prep</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>Practice conflict resolution using the STAR method.</span>
                <span 
                  onClick={() => onNavigate('interview')}
                  style={{ fontSize: '0.75rem', color: 'var(--success)', cursor: 'pointer', fontWeight: 600, marginTop: '0.2rem' }}
                >
                  Start Simulator →
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
