import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import {
  BookOpen, Award, Flame, Play, MessageSquare, History,
  CheckCircle2, XCircle, Trophy, Target, Zap, TrendingUp,
  Calendar, Clock, Code2, Brain, BarChart3, ChevronRight, Sparkles, Terminal as TerminalIcon
} from 'lucide-react';

/* ─── Types ─────────────────────────────────────────────────────────── */

interface DashboardProps {
  onNavigate: (page: string, problemId?: string | null) => void;
  currentUser?: { name: string; email: string; role: string } | null;
}

interface Submission {
  id: number;
  problemId: string;
  language: string;
  status: string;
  submittedAt: string;
  executionTimeMs: number;
}

interface DifficultyCount {
  difficulty: string;
  count: number;
}

interface Stats {
  totalProblems: number;
  solvedProblems: number;
  recentSubmissions: Submission[];
  solvedDifficulty: DifficultyCount[];
  streak: number;
  activeDates: string[];
  rank?: number;
}

/* ─── Helpers ───────────────────────────────────────────────────────── */

function relativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.max(0, now - then);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function prettifyId(id: string): string {
  return id
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function langColor(lang: string): string {
  const map: Record<string, string> = {
    javascript: '#f7df1e',
    typescript: '#3178c6',
    python: '#3572a5',
    java: '#b07219',
    cpp: '#f34b7d',
    'c++': '#f34b7d',
    c: '#555555',
    go: '#00add8',
    rust: '#dea584',
  };
  return map[lang.toLowerCase()] ?? '#8b949e';
}

/* ─── Animated counter hook ─────────────────────────────────────────── */

function useCountUp(target: number, duration = 1200): number {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(null);

  useEffect(() => {
    if (target <= 0) { setValue(0); return; }
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3); // ease-out cubic
      setValue(Math.round(ease * target));
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration]);

  return value;
}

/* ─── Premium Circular Dial Gauge ─── */

function DialGauge({ pct, size = 64, stroke = 5, color = 'var(--primary)', label = '' }: { pct: number; size?: number; stroke?: number; color?: string; label?: string }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const strokeDashoffset = circ - (Math.min(pct, 100) / 100) * circ;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth={stroke} />
          <circle
            cx={size / 2} cy={size / 2} r={r} fill="none"
            stroke={color} strokeWidth={stroke}
            strokeDasharray={circ} strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 1s cubic-bezier(.22,1,.36,1)',
              filter: `drop-shadow(0 0 4px ${color}30)`
            }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.8rem', fontWeight: 800, color: '#fff'
        }}>
          {pct}%
        </div>
      </div>
      {label && <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>}
    </div>
  );
}

/* ─── Contribution Grid ─────────────────────────────────────────────── */

const CONTRIBUTION_LEVELS = ['#18181b', 'rgba(99, 102, 241, 0.15)', 'rgba(99, 102, 241, 0.35)', 'rgba(99, 102, 241, 0.6)', '#818cf8'];
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_LABELS = ['', 'M', '', 'W', '', 'F', ''];

function buildContributionData(activeDates: string[] = []): { date: string; count: number; level: number }[][] {
  const countMap: Record<string, number> = {};
  activeDates.forEach((d) => {
    countMap[d] = (countMap[d] || 0) + 1;
  });

  const today = new Date();
  const grid: { date: string; count: number; level: number }[][] = [];
  const startDay = new Date(today);
  startDay.setDate(startDay.getDate() - (52 * 7 - 1) - startDay.getDay());

  for (let w = 0; w < 52; w++) {
    const week: { date: string; count: number; level: number }[] = [];
    for (let d = 0; d < 7; d++) {
      const cur = new Date(startDay);
      cur.setDate(cur.getDate() + w * 7 + d);
      const iso = cur.toISOString().slice(0, 10);
      const count = countMap[iso] || 0;
      const level = count === 0 ? 0 : count <= 1 ? 1 : count <= 2 ? 2 : count <= 3 ? 3 : 4;
      week.push({ date: iso, count, level });
    }
    grid.push(week);
  }
  return grid;
}

function ContributionGrid({ activeDates }: { activeDates: string[] }) {
  const grid = useMemo(() => buildContributionData(activeDates), [activeDates]);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const monthPositions = useMemo(() => {
    const pos: { label: string; col: number }[] = [];
    let lastMonth = -1;
    grid.forEach((week, wi) => {
      const m = new Date(week[0].date).getMonth();
      if (m !== lastMonth) { pos.push({ label: MONTH_LABELS[m], col: wi }); lastMonth = m; }
    });
    return pos;
  }, [grid]);

  const handleHover = useCallback((e: React.MouseEvent, cell: { date: string; count: number }) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltip({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top - 36,
      text: `${cell.count} active submission${cell.count !== 1 ? 's' : ''} on ${cell.date}`,
    });
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative', overflowX: 'auto', paddingBottom: 4 }}>
      <div style={{ display: 'flex', paddingLeft: 24, marginBottom: 8, height: 14, position: 'relative' }}>
        {monthPositions.map((m, i) => (
          <span key={i} style={{
            position: 'absolute', left: 24 + m.col * 13,
            fontSize: 9, color: '#71717a', userSelect: 'none', fontWeight: 500
          }}>{m.label}</span>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginRight: 6, minWidth: 16 }}>
          {DAY_LABELS.map((d, i) => (
            <span key={i} style={{ fontSize: 9, lineHeight: '11px', height: 11, color: '#52525b', fontWeight: 600 }}>{d}</span>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 2 }}>
          {grid.map((week, wi) => (
            <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {week.map((cell, di) => (
                <div
                  key={di}
                  onMouseEnter={(e) => handleHover(e, cell)}
                  onMouseLeave={() => setTooltip(null)}
                  style={{
                    width: 11, height: 11, borderRadius: 2,
                    backgroundColor: CONTRIBUTION_LEVELS[cell.level],
                    border: '1px solid rgba(255,255,255,0.015)',
                    transition: 'all 0.15s ease',
                    cursor: 'pointer',
                  }}
                  onMouseOver={(e) => { 
                    const target = e.target as HTMLDivElement;
                    target.style.transform = 'scale(1.25)';
                    target.style.boxShadow = '0 0 6px var(--primary)';
                  }}
                  onMouseOut={(e) => { 
                    const target = e.target as HTMLDivElement;
                    target.style.transform = 'scale(1)';
                    target.style.boxShadow = 'none';
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {tooltip && (
        <div style={{
          position: 'absolute', left: tooltip.x, top: tooltip.y,
          background: '#09090b', border: '1px solid #1f1f23', borderRadius: 4,
          padding: '4px 8px', fontSize: 10, color: '#fff',
          pointerEvents: 'none', whiteSpace: 'nowrap', zIndex: 20,
          boxShadow: '0 4px 12px rgba(0,0,0,.5)',
        }}>
          {tooltip.text}
        </div>
      )}
    </div>
  );
}

/* ─── Daily Challenge Countdown ─────────────────────────────────────── */

function useCountdown(): string {
  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const diff = tomorrow.getTime() - now.getTime();
      const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
      const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
      const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
      setTime(`${h}:${m}:${s}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

/* ─── Main Dashboard ────────────────────────────────────────────────── */

export default function Dashboard({ onNavigate, currentUser }: DashboardProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [weakness, setWeakness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const countdown = useCountdown();

  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      try {
        const res = await fetch('http://localhost:5015/api/problems/stats', {
          headers: { 'X-User-Email': currentUser?.email || '' },
          signal: ctrl.signal,
        });
        if (res.ok) setStats(await res.json());
      } catch {
        /* silently handle */
      } finally {
        setLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, [currentUser?.email]);

  useEffect(() => {
    const ctrl = new AbortController();
    if (currentUser?.email) {
      fetch('http://localhost:5015/api/prephub/weakness-analysis', {
        headers: { 'X-User-Email': currentUser.email },
        signal: ctrl.signal
      })
        .then(res => res.json())
        .then(data => setWeakness(data))
        .catch(() => {});
    }
    return () => ctrl.abort();
  }, [currentUser?.email]);

  const totalProblems = stats?.totalProblems ?? 150;
  const solvedProblems = stats?.solvedProblems ?? 0;
  const solvedPct = totalProblems > 0 ? Math.round((solvedProblems / totalProblems) * 100) : 0;
  const submissions = stats?.recentSubmissions ?? [];
  const accepted = submissions.filter((s) => s.status === 'Accepted').length;
  const acceptanceRate = submissions.length > 0 ? Math.round((accepted / submissions.length) * 100) : 0;

  const difficultyMap: Record<string, number> = {};
  (stats?.solvedDifficulty ?? []).forEach((d) => { difficultyMap[d.difficulty] = d.count; });
  const easySolved = difficultyMap['Easy'] ?? 0;
  const medSolved = difficultyMap['Medium'] ?? 0;
  const hardSolved = difficultyMap['Hard'] ?? 0;

  const easyTotal = Math.round(totalProblems * 0.33);
  const medTotal = Math.round(totalProblems * 0.40);
  const hardTotal = totalProblems - easyTotal - medTotal;

  const animatedSolved = useCountUp(solvedProblems);
  const animatedStreak = useCountUp(stats?.streak ?? 0, 800);
  const animatedRate = useCountUp(acceptanceRate, 1200);

  const categories = useMemo(() => [
    { name: 'Arrays & Hashing', solved: Math.min(easySolved + medSolved, 20), total: 20 },
    { name: 'Two Pointers', solved: Math.min(Math.floor(solvedProblems * 0.15), 15), total: 15 },
    { name: 'Sliding Window', solved: Math.min(Math.floor(solvedProblems * 0.1), 12), total: 12 },
    { name: 'Stack', solved: Math.min(Math.floor(solvedProblems * 0.08), 10), total: 10 },
    { name: 'Binary Search', solved: Math.min(Math.floor(solvedProblems * 0.12), 14), total: 14 },
    { name: 'Trees', solved: Math.min(Math.floor(solvedProblems * 0.09), 18), total: 18 },
  ], [easySolved, medSolved, solvedProblems]);

  const last7Days = useMemo(() => {
    const dates = [];
    const activeSet = new Set(stats?.activeDates || []);
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().slice(0, 10));
    }
    return dates.map(dateStr => activeSet.has(dateStr));
  }, [stats?.activeDates]);

  const last7DaysLabels = useMemo(() => {
    const labels = [];
    const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      labels.push(weekdays[d.getDay()]);
    }
    return labels;
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '40px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <style>{`
          @keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
          .skel{background:linear-gradient(90deg,#09090b 25%,#1f1f23 50%,#09090b 75%);background-size:800px 100%;animation:shimmer 1.5s infinite;border-radius:12px;border:1px solid #1f1f23}
        `}</style>
        <div className="skel" style={{ height: 120, marginBottom: 24 }} />
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div className="skel" style={{ height: 180 }} />
            <div className="skel" style={{ height: 300 }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div className="skel" style={{ height: 240 }} />
            <div className="skel" style={{ height: 240 }} />
          </div>
        </div>
      </div>
    );
  }

  const firstName = currentUser?.name?.split(' ')[0] || 'Developer';

  return (
    <div className="dashboard-hud" style={{ color: '#fafafa', fontFamily: 'var(--font-sans)', position: 'relative' }}>
      
      {/* Interactive Styles & Custom Animations */}
      <style>{`
        .hud-grid-matrix {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 1.5rem;
          margin-top: 1.5rem;
        }

        .hud-hero {
          grid-column: span 8;
          background: linear-gradient(135deg, rgba(24, 24, 32, 0.8) 0%, rgba(9, 9, 12, 0.95) 100%);
          border: 1px solid var(--border-color);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .hud-profile-ring {
          position: relative;
          width: 96px;
          height: 96px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hud-profile-ring::after {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          border: 1px dashed var(--border-color-active);
          animation: spin360 40s linear infinite;
        }
        @keyframes spin360 {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .hud-stats-compact {
          grid-column: span 4;
          display: grid;
          grid-template-rows: 1fr 1fr;
          gap: 1.25rem;
        }
        .hud-stat-cell {
          background: rgba(14, 14, 18, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 0.75rem;
          padding: 1rem 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: all 0.2s;
        }
        .hud-stat-cell:hover {
          border-color: var(--primary);
          background: rgba(20, 20, 25, 0.85);
        }
        .hud-activity-matrix {
          grid-column: span 8;
        }
        .hud-sidebar-widgets {
          grid-column: span 4;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .hud-timeline-stream {
          grid-column: span 8;
        }
        .hud-glow-btn {
          background: var(--primary);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 8px 18px;
          font-size: 11px;
          font-weight: 700;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .hud-glow-btn:hover {
          background: var(--primary-hover);
          border-color: var(--primary);
          box-shadow: 0 0 12px var(--primary-glow);
          transform: translateY(-1px);
        }
        .timeline-stream-item {
          display: flex;
          align-items: center;
          padding: 12px 14px;
          background: rgba(9, 9, 11, 0.45);
          border: 1px solid rgba(255, 255, 255, 0.015);
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.25s;
        }
        .timeline-stream-item:hover {
          background: rgba(24, 24, 30, 0.8);
          border-color: var(--border-color-active);
          transform: translateX(4px);
        }
        .telemetry-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.02);
          padding-bottom: 6px;
          font-family: var(--font-mono);
        }
        .telemetry-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
      `}</style>

      {/* ─── DYNAMIC HERO & QUICK SUMMARY ─── */}
      <div className="hud-grid-matrix animate-fade-in" style={{ marginTop: 0 }}>
        
        {/* Welcome Dashboard Hub */}
        <div className="cyber-panel cyber-panel-hover hud-hero">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>
              <Sparkles size={12} /> PrepArena Telemetry Deck
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
              <span style={{ fontSize: '8px', color: '#10b981', textTransform: 'none', letterSpacing: 'normal' }}>Online</span>
            </div>
            
            <h1 style={{ fontSize: '2rem', fontWeight: 850, margin: 0, letterSpacing: '-0.04em', background: 'linear-gradient(135deg, #ffffff 40%, #a1a1aa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Welcome back, {firstName}
            </h1>
            
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '420px', lineHeight: '1.5', margin: '4px 0 16px' }}>
              Your cognitive algorithm stack is loaded. You have conquered {solvedPct}% of the LeetCode Top 150 problem matrix. Keep the momentum high.
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="hud-glow-btn" onClick={() => onNavigate('problems')}>
                <Play size={12} fill="#fff" /> Resume Practice
              </button>
              <button 
                onClick={() => onNavigate('leaderboard')}
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  color: '#fff',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--border-color-active)'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
              >
                Trophy Leaderboard
              </button>
              <button 
                onClick={() => onNavigate('prephub')}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-color)',
                  color: '#fff',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Sparkles size={12} /> PrepHub Suite
              </button>
            </div>
          </div>

          {/* Glowing Orbit Completion Dial */}
          <div className="hud-profile-ring">
            <div style={{ textAlign: 'center' }}>
              <span style={{ display: 'block', fontSize: '1.75rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{animatedSolved}</span>
              <span style={{ fontSize: '8px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Solved</span>
            </div>
          </div>
        </div>

        {/* Compact Diagnostics Sidebar Row */}
        <div className="hud-stats-compact">
          {/* Diagnostic 1: Acceptance Rate */}
          <div className="hud-stat-cell">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Accuracy Index</span>
              <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#fff' }}>{animatedRate}%</span>
              <span style={{ fontSize: '8px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 650 }}>
                <TrendingUp size={10} /> Active telemetry
              </span>
            </div>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.1)', display: 'grid', placeItems: 'center' }}>
              <Target size={16} color="var(--primary)" />
            </div>
          </div>

          {/* Diagnostic 2: Global Standing */}
          <div className="hud-stat-cell">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Global Standing</span>
              <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#fff' }}>Rank #{stats?.rank ?? '—'}</span>
              <span style={{ fontSize: '8px', color: 'var(--text-muted)', fontWeight: 500 }}>Top community percentile</span>
            </div>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(250, 204, 21, 0.05)', border: '1px solid rgba(250, 204, 21, 0.1)', display: 'grid', placeItems: 'center' }}>
              <Trophy size={16} color="#facc15" />
            </div>
          </div>
        </div>

      </div>

      {/* ─── DETAILED DIAGNOSTICS DECK ─── */}
      <div className="hud-grid-matrix">
        
        {/* Left Side: Activity Grid & timeline */}
        <div className="hud-activity-matrix cyber-panel cyber-panel-hover" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={16} color="#6366f1" />
              <h2 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>Contribution Vector</h2>
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>{stats?.activeDates?.length ?? 0} Active Node Cycles</span>
          </div>

          {/* Contribution Heatmap */}
          <ContributionGrid activeDates={stats?.activeDates || []} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '12px' }}>
            <span style={{ fontSize: '9px', color: '#52525b', fontWeight: 550, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TerminalIcon size={10} /> Real-time active calendar database.
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <span style={{ fontSize: '9px', color: '#52525b', marginRight: 4 }}>Sleep</span>
              {CONTRIBUTION_LEVELS.map((c, i) => (
                <div key={i} style={{ width: 10, height: 10, borderRadius: 2, background: c }} />
              ))}
              <span style={{ fontSize: '9px', color: '#52525b', marginLeft: 4 }}>Active</span>
            </div>
          </div>
        </div>

        {/* Right Side Widgets: Difficulty gauges & Recommended Path */}
        <div className="hud-sidebar-widgets">
          
          {/* Difficulty Matrix dials */}
          <div className="cyber-panel cyber-panel-hover" style={{ padding: '1.25rem 1.5rem' }}>
            <h2 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 1.25rem' }}>Subdomain Completion</h2>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0' }}>
              <DialGauge pct={easyTotal > 0 ? Math.round((easySolved / easyTotal) * 100) : 0} color="#10b981" size={56} label="Easy" />
              <DialGauge pct={medTotal > 0 ? Math.round((medSolved / medTotal) * 100) : 0} color="#eab308" size={56} label="Medium" />
              <DialGauge pct={hardTotal > 0 ? Math.round((hardSolved / hardTotal) * 100) : 0} color="#ef4444" size={56} label="Hard" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 550 }}>Streak Index</span>
                <span style={{ color: '#f97316', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Flame size={12} fill="#f97316" /> {animatedStreak} Days
                </span>
              </div>
            </div>
          </div>

          {/* Placement Readiness Tracker */}
          <div className="cyber-panel cyber-panel-hover" style={{ padding: '1.25rem 1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
              <Target size={14} color="#6366f1" />
              <h2 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>Placement Readiness</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {[
                { name: 'Google SDE', score: Math.min(96, 45 + (solvedProblems * 4)), emoji: '🤖' },
                { name: 'Amazon SDE', score: Math.min(96, 52 + (solvedProblems * 3)), emoji: '📦' },
                { name: 'Meta SDE', score: Math.min(96, 48 + (solvedProblems * 3.5)), emoji: '♾️' }
              ].map((c) => (
                <div key={c.name} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                    <span style={{ color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>{c.emoji}</span> {c.name}
                    </span>
                    <span style={{ color: c.score >= 75 ? '#10b981' : '#f59e0b', fontWeight: 800 }}>{c.score}% Match</span>
                  </div>
                  <div style={{ height: '4px', background: '#09090b', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: c.score >= 75 ? '#10b981' : '#f59e0b', width: `${c.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Weakness Analyzer & Recommender */}
          {weakness && weakness.weakestSuccessRate < 1.0 && (
            <div className="cyber-panel cyber-panel-hover" style={{ padding: '1.25rem 1.5rem', border: '1px solid rgba(239, 68, 68, 0.15)', background: 'rgba(239, 68, 68, 0.01)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                <Brain size={14} color="#ef4444" />
                <h2 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0, color: '#ef4444' }}>Weakness Alert</h2>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0 0 0.75rem', lineHeight: 1.45 }}>
                Your submissions reveal gaps in **{weakness.weakestCategory}** ({Math.round(weakness.weakestSuccessRate * 100)}% accuracy).
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {weakness.recommendedProblemIds && weakness.recommendedProblemIds.slice(0, 2).map((probId: string) => (
                  <div 
                    key={probId}
                    onClick={() => onNavigate('workspace', probId)}
                    style={{
                      padding: '0.5rem 0.75rem',
                      background: '#09090b',
                      borderRadius: '6px',
                      border: '1px solid rgba(255,255,255,0.03)',
                      fontSize: '0.75rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)'}
                    onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.03)'}
                  >
                    <span style={{ fontWeight: 700, color: '#fff' }}>{prettifyId(probId)}</span>
                    <span style={{ fontSize: '9px', color: '#6366f1', display: 'flex', alignItems: 'center', gap: '2px' }}>
                      Solve <ChevronRight size={10} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Daily Challenge card */}
          <div className="cyber-panel cyber-panel-hover" style={{ border: '1px solid var(--border-color)', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#facc15', fontSize: '8px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                <Zap size={10} fill="#facc15" /> Daily Cycle Target
              </div>
              <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{countdown}</span>
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 4px', color: '#fff' }}>Valid Parentheses</h3>
            <span style={{ fontSize: '8px', color: '#10b981', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.15)', padding: '1px 6px', borderRadius: 4, fontWeight: 700, textTransform: 'uppercase' }}>Easy</span>

            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.45', margin: '0.5rem 0 1rem' }}>
              Parse a bracket sequence using LIFO mechanics to ensure logical closure order.
            </p>

            <button className="hud-glow-btn" style={{ width: '100%' }} onClick={() => onNavigate('workspace', 'valid-parentheses')}>
              Execute Challenge
            </button>
          </div>

        </div>

      </div>

      {/* ─── ACTIVITY TIMELINE & HARDWARE READOUTS ─── */}
      <div className="hud-grid-matrix">
        
        {/* Timeline Log stream */}
        <div className="cyber-panel cyber-panel-hover hud-timeline-stream" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <History size={16} color="var(--primary)" />
            <h2 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>Recent Activity Stream</h2>
          </div>

          {submissions.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 0', color: 'var(--text-muted)', border: '1px dashed rgba(255,255,255,0.03)', borderRadius: '0.5rem' }}>
              <Code2 size={24} style={{ opacity: 0.2, marginBottom: '0.5rem' }} />
              <span style={{ fontSize: '0.8rem' }}>No activity logged. Resolve problems to compile logs.</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {submissions.slice(0, 5).map((sub) => {
                const isAccepted = sub.status === 'Accepted';
                return (
                  <div key={sub.id} className="timeline-stream-item" onClick={() => onNavigate('workspace', sub.problemId)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                      <div style={{
                        width: '20px', height: '20px', borderRadius: '50%',
                        background: isAccepted ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                        display: 'grid', placeItems: 'center'
                      }}>
                        {isAccepted ? <CheckCircle2 size={11} color="#10b981" /> : <XCircle size={11} color="#ef4444" />}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>{prettifyId(sub.problemId)}</span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{relativeTime(sub.submittedAt)}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        fontSize: '7px', color: langColor(sub.language), background: `${langColor(sub.language)}08`,
                        border: `1px solid ${langColor(sub.language)}15`, borderRadius: '4px', padding: '2px 5px', fontWeight: 800, textTransform: 'uppercase'
                      }}>
                        {sub.language}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{sub.executionTimeMs}ms</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar Widgets: System Telemetry */}
        <div className="hud-sidebar-widgets">
          {/* Telemetry diagnostics */}
          <div className="cyber-panel cyber-panel-hover" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <h2 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 0.25rem' }}>System Sandbox Diagnostics</h2>
            
            <div className="telemetry-row">
              <span style={{ color: 'var(--text-muted)' }}>Sandbox Engine</span>
              <span style={{ color: '#fff', fontWeight: 700 }}>Docker Linux Standard</span>
            </div>
            
            <div className="telemetry-row">
              <span style={{ color: 'var(--text-muted)' }}>Memory Limit</span>
              <span style={{ color: '#fff', fontWeight: 700 }}>256 MB</span>
            </div>

            <div className="telemetry-row">
              <span style={{ color: 'var(--text-muted)' }}>CPU Allotment</span>
              <span style={{ color: '#fff', fontWeight: 700 }}>1.0 vCPU</span>
            </div>

            <div className="telemetry-row">
              <span style={{ color: 'var(--text-muted)' }}>Exec Timeout</span>
              <span style={{ color: '#fff', fontWeight: 700 }}>2000 ms</span>
            </div>

            <div className="telemetry-row" style={{ flexDirection: 'column', gap: '4px', borderBottom: 'none', paddingBottom: 0 }}>
              <span style={{ color: 'var(--text-muted)' }}>Active Compilers</span>
              <span style={{ color: 'var(--primary)', fontSize: '9px', fontWeight: 700 }}>Node.js, GCC, G++, JDK, Python 3, .NET Core</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
