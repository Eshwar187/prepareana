import React, { useState, useEffect, useMemo } from 'react';
import {
  Trophy,
  Crown,
  Flame,
  Search,
  Users,
  Target,
  Zap,
  Medal,
  TrendingUp,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface LeaderboardEntry {
  rank: number;
  username: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  streak: number;
  lastActive: string;
}

interface LeaderboardStats {
  totalUsers: number;
  totalSubmissions: number;
  totalAccepted: number;
  topLanguage: string;
}

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const styles: Record<string, React.CSSProperties> = {
  /* ---- page wrapper ---- */
  page: {
    minHeight: '100vh',
    background: 'transparent',
    color: 'var(--text-main, #fafafa)',
    padding: '2rem 1.5rem 4rem',
  },
  container: {
    maxWidth: 1100,
    margin: '0 auto',
  },

  /* ---- header ---- */
  header: {
    textAlign: 'center' as const,
    marginBottom: '2.5rem',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 800,
    fontFamily: 'var(--font-display, Outfit, sans-serif)',
    background: 'linear-gradient(135deg, #f4f4f5 0%, #6366f1 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '.35rem',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    color: 'var(--text-muted, #a1a1aa)',
    fontSize: '.95rem',
  },

  /* ---- stats bar ---- */
  statsBar: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '3rem',
  },
  statCard: {
    background: 'var(--bg-card, rgba(20, 20, 25, 0.6))',
    border: '1px solid var(--border-color, rgba(255, 255, 255, 0.08))',
    borderRadius: '0.75rem',
    padding: '1.25rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    transition: 'transform .25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow .25s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  statIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  statLabel: {
    fontSize: '.78rem',
    color: 'var(--text-muted, #a1a1aa)',
    marginBottom: 2,
    textTransform: 'uppercase' as const,
    letterSpacing: '.06em',
  },
  statValue: {
    fontSize: '1.45rem',
    fontWeight: 700,
    lineHeight: 1.15,
  },

  /* ---- podium section ---- */
  podiumSection: {
    marginBottom: '3rem',
  },
  podiumRow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: '1.25rem',
    flexWrap: 'wrap' as const,
  },

  /* ---- table section ---- */
  tableSection: {
    background: 'var(--bg-card, rgba(20, 20, 25, 0.6))',
    border: '1px solid var(--border-color, rgba(255, 255, 255, 0.08))',
    borderRadius: '0.75rem',
    overflow: 'hidden',
  },
  tableHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid var(--border-color, rgba(255, 255, 255, 0.08))',
    flexWrap: 'wrap' as const,
    gap: '.75rem',
  },
  tableTitle: {
    fontSize: '1.15rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: '.5rem',
  },
  searchWrap: {
    position: 'relative' as const,
  },
  searchIcon: {
    position: 'absolute' as const,
    left: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-muted, #a1a1aa)',
    pointerEvents: 'none' as const,
  },
  searchInput: {
    background: 'var(--bg-main, #0a0a0c)',
    border: '1px solid var(--border-color, rgba(255, 255, 255, 0.08))',
    borderRadius: '0.5rem',
    padding: '.55rem .85rem .55rem 2.4rem',
    color: 'var(--text-main, #fafafa)',
    fontSize: '.88rem',
    outline: 'none',
    width: 240,
    transition: 'border-color .25s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
  },
  th: {
    textAlign: 'left' as const,
    padding: '.85rem 1.25rem',
    fontSize: '.75rem',
    fontWeight: 600,
    color: 'var(--text-muted, #a1a1aa)',
    textTransform: 'uppercase' as const,
    letterSpacing: '.06em',
    borderBottom: '1px solid var(--border-color, rgba(255, 255, 255, 0.08))',
  },
  td: {
    padding: '.85rem 1.25rem',
    fontSize: '.9rem',
    borderBottom: '1px solid var(--border-color, rgba(255, 255, 255, 0.08))',
    verticalAlign: 'middle' as const,
  },

  /* ---- avatar ---- */
  avatar: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '.85rem',
    flexShrink: 0,
    textTransform: 'uppercase' as const,
  },
  devCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '.65rem',
  },

  /* ---- difficulty mini bars ---- */
  barWrap: {
    display: 'flex',
    gap: 4,
    alignItems: 'center',
  },
  barSegment: {
    height: 7,
    borderRadius: 4,
    minWidth: 4,
  },

  /* ---- loading / empty ---- */
  center: {
    textAlign: 'center' as const,
    padding: '4rem 1rem',
    color: 'var(--text-muted, #a1a1aa)',
  },
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const AVATAR_COLORS = [
  '#6366f1',
  '#4f46e5',
  '#0ea5e9',
  '#f97316',
  '#10b981',
  '#06b6d4',
  '#eab308',
  '#818cf8',
];

function avatarColor(name: string | null | undefined) {
  const safeName = typeof name === 'string' ? name : 'Developer';
  let hash = 0;
  for (let i = 0; i < safeName.length; i++) hash = safeName.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function initials(name: string | null | undefined) {
  const safeName = (typeof name === 'string' ? name : 'Developer').trim();
  const parts = safeName.split(/\s+/);
  if (parts.length >= 2 && parts[0][0] && parts[1][0]) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return safeName.slice(0, 2).toUpperCase();
}

function timeAgo(dateStr: string) {
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days}d ago`;
    return `${Math.floor(days / 30)}mo ago`;
  } catch {
    return dateStr || '—';
  }
}

function formatNum(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return n.toLocaleString();
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

/* ---------- Stat Card ---------- */
function StatCard({
  icon,
  label,
  value,
  gradient,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  gradient: string;
}) {
  return (
    <div
      className="cyber-panel cyber-panel-hover animate-fade-in"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1.25rem 1.5rem',
      }}
    >
      <div style={{ ...styles.statIconWrap, background: gradient }}>{icon}</div>
      <div>
        <div style={styles.statLabel}>{label}</div>
        <div style={styles.statValue}>{typeof value === 'number' ? formatNum(value) : value}</div>
      </div>
    </div>
  );
}

/* ---------- Podium Card ---------- */
function PodiumCard({ entry, place }: { entry: LeaderboardEntry; place: 1 | 2 | 3 }) {
  const config: Record<
    1 | 2 | 3,
    {
      glow: string;
      border: string;
      badge: string;
      emoji: string;
      height: number;
      scale: number;
      gradient: string;
    }
  > = {
    1: {
      glow: '0 4px 24px rgba(0, 0, 0, 0.25)',
      border: '#facc15',
      badge: '#facc15',
      emoji: '👑',
      height: 280,
      scale: 1.04,
      gradient: 'var(--bg-card, rgba(20, 20, 25, 0.6))',
    },
    2: {
      glow: '0 4px 20px rgba(0, 0, 0, 0.2)',
      border: '#94a3b8',
      badge: '#94a3b8',
      emoji: '🥈',
      height: 250,
      scale: 1,
      gradient: 'var(--bg-card, rgba(20, 20, 25, 0.6))',
    },
    3: {
      glow: '0 4px 20px rgba(0, 0, 0, 0.2)',
      border: '#d97706',
      badge: '#d97706',
      emoji: '🥉',
      height: 230,
      scale: 1,
      gradient: 'var(--bg-card, rgba(20, 20, 25, 0.6))',
    },
  };

  const c = config[place];
  const total = entry.easySolved + entry.mediumSolved + entry.hardSolved || 1;

  return (
    <div
      className="animate-fade-in"
      style={{
        background: c.gradient,
        border: `1px solid var(--border-color, rgba(255, 255, 255, 0.08))`,
        borderTop: `2px solid ${c.border}44`,
        borderRadius: '0.75rem',
        padding: '1.75rem 1.5rem 1.5rem',
        width: place === 1 ? 260 : 230,
        minHeight: c.height,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        boxShadow: c.glow,
        transform: `scale(${c.scale})`,
        transition: 'transform .3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow .3s cubic-bezier(0.16, 1, 0.3, 1), border-color .3s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative',
        zIndex: place === 1 ? 2 : 1,
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = `scale(${c.scale + 0.02})`;
        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-color-active, rgba(255, 255, 255, 0.18))';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = `scale(${c.scale})`;
        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-color, rgba(255, 255, 255, 0.08))';
      }}
    >

      {/* Emoji badge */}
      <span style={{ fontSize: place === 1 ? '2rem' : '1.6rem', marginBottom: '.25rem' }}>
        {c.emoji}
      </span>

      {/* Avatar */}
      <div
        style={{
          ...styles.avatar,
          width: place === 1 ? 64 : 52,
          height: place === 1 ? 64 : 52,
          fontSize: place === 1 ? '1.35rem' : '1.05rem',
          background: avatarColor(entry.username),
          marginBottom: '.65rem',
          boxShadow: `0 0 0 2px ${c.border}33`,
        }}
      >
        {initials(entry.username)}
      </div>

      {/* Name */}
      <div style={{ fontWeight: 700, fontSize: place === 1 ? '1.15rem' : '1rem', marginBottom: '.15rem' }}>
        {entry.username}
      </div>

      {/* Solved */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '.35rem',
          color: c.badge,
          fontWeight: 700,
          fontSize: '1.3rem',
          margin: '.4rem 0 .15rem',
        }}
      >
        <Target size={16} />
        {entry.totalSolved}
        <span style={{ fontSize: '.75rem', fontWeight: 500, color: 'var(--text-muted, #a1a1aa)' }}>
          solved
        </span>
      </div>

      {/* Streak */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '.3rem',
          fontSize: '.85rem',
          color: '#f97316',
          marginBottom: '.75rem',
        }}
      >
        🔥 {entry.streak} day streak
      </div>

      {/* Difficulty mini-bars */}
      <div style={{ width: '100%' }}>
        <div
          style={{
            display: 'flex',
            borderRadius: 6,
            overflow: 'hidden',
            height: 8,
            background: '#27272a',
          }}
        >
          <div
            style={{
              width: `${(entry.easySolved / total) * 100}%`,
              background: 'var(--success, #22c55e)',
              transition: 'width .6s',
            }}
          />
          <div
            style={{
              width: `${(entry.mediumSolved / total) * 100}%`,
              background: 'var(--warning, #f59e0b)',
              transition: 'width .6s',
            }}
          />
          <div
            style={{
              width: `${(entry.hardSolved / total) * 100}%`,
              background: 'var(--danger, #ef4444)',
              transition: 'width .6s',
            }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '.68rem',
            marginTop: 4,
            color: 'var(--text-muted, #a1a1aa)',
          }}
        >
          <span style={{ color: 'var(--success, #22c55e)' }}>E {entry.easySolved}</span>
          <span style={{ color: 'var(--warning, #f59e0b)' }}>M {entry.mediumSolved}</span>
          <span style={{ color: 'var(--danger, #ef4444)' }}>H {entry.hardSolved}</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- Rank Badge ---------- */
function RankBadge({ rank }: { rank: number }) {
  if (rank === 1)
    return (
      <span
        style={{
          background: 'linear-gradient(135deg, #facc15, #eab308)',
          color: '#000',
          fontWeight: 800,
          fontSize: '.78rem',
          padding: '3px 10px',
          borderRadius: 20,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <Crown size={12} /> 1
      </span>
    );
  if (rank === 2)
    return (
      <span
        style={{
          background: 'linear-gradient(135deg, #cbd5e1, #94a3b8)',
          color: '#000',
          fontWeight: 800,
          fontSize: '.78rem',
          padding: '3px 10px',
          borderRadius: 20,
        }}
      >
        2
      </span>
    );
  if (rank === 3)
    return (
      <span
        style={{
          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
          color: '#000',
          fontWeight: 800,
          fontSize: '.78rem',
          padding: '3px 10px',
          borderRadius: 20,
        }}
      >
        3
      </span>
    );
  return <span style={{ color: 'var(--text-muted, #a1a1aa)', fontWeight: 600 }}>{rank}</span>;
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function Leaderboard({
  onNavigate,
}: {
  onNavigate: (page: string) => void;
}) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [stats, setStats] = useState<LeaderboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  /* ---- Data fetching ---- */
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [lbRes, stRes] = await Promise.all([
          fetch('http://localhost:5015/api/leaderboard'),
          fetch('http://localhost:5015/api/leaderboard/stats'),
        ]);

        if (!cancelled) {
          const lbData = await lbRes.json();
          const stData = await stRes.json();

          // Normalize: API might return array directly or { data: [...] }
          const list: any[] = Array.isArray(lbData) ? lbData : lbData.data ?? [];

          // Ensure rank field and username field exist
          const ranked = list.map((e: any, i: number) => ({
            ...e,
            username: e.username ?? e.name ?? 'Developer',
            rank: e.rank ?? i + 1,
          }));

          setEntries(ranked);
          setStats(stData);
        }
      } catch (err) {
        console.error('Leaderboard fetch failed', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  /* ---- Derived data ---- */
  const podium = useMemo(() => {
    const sorted = [...entries].sort((a, b) => a.rank - b.rank);
    return {
      first: sorted[0] ?? null,
      second: sorted[1] ?? null,
      third: sorted[2] ?? null,
    };
  }, [entries]);

  const filtered = useMemo(() => {
    if (!search.trim()) return entries;
    const q = search.toLowerCase();
    return entries.filter((e) => e.username.toLowerCase().includes(q));
  }, [entries, search]);

  /* ---- Loading state ---- */
  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.center}>
          <Trophy size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
          <p style={{ fontSize: '1.1rem' }}>Loading leaderboard…</p>
        </div>
      </div>
    );
  }

  /* ---- Render ---- */
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* ===== HEADER ===== */}
        <header style={styles.header} className="animate-fade-in">
          <h1 style={styles.title}>
            <Trophy size={30} style={{ verticalAlign: 'middle', marginRight: 8 }} />
            Leaderboard
          </h1>
          <p style={styles.subtitle}>
            Compete, climb, and conquer — the arena's finest developers
          </p>
        </header>

        {/* ===== COMMUNITY STATS BAR ===== */}
        {stats && (
          <div style={styles.statsBar}>
            <StatCard
              icon={<Users size={20} color="#60a5fa" />}
              label="Total Users"
              value={stats.totalUsers}
              gradient="linear-gradient(135deg, rgba(96,165,250,.18), rgba(96,165,250,.06))"
            />
            <StatCard
              icon={<Zap size={20} color="#6366f1" />}
              label="Submissions"
              value={stats.totalSubmissions}
              gradient="linear-gradient(135deg, rgba(99,102,241,.18), rgba(99,102,241,.06))"
            />
            <StatCard
              icon={<Target size={20} color="#22c55e" />}
              label="Accepted"
              value={stats.totalAccepted}
              gradient="linear-gradient(135deg, rgba(34,197,94,.18), rgba(34,197,94,.06))"
            />
            <StatCard
              icon={<TrendingUp size={20} color="#f97316" />}
              label="Top Language"
              value={stats.topLanguage}
              gradient="linear-gradient(135deg, rgba(249,115,22,.18), rgba(249,115,22,.06))"
            />
          </div>
        )}

        {/* ===== PODIUM ===== */}
        {podium.first && (
          <section style={styles.podiumSection}>
            <div style={styles.podiumRow}>
              {/* 2nd place — left */}
              {podium.second && <PodiumCard entry={podium.second} place={2} />}
              {/* 1st place — center */}
              <PodiumCard entry={podium.first} place={1} />
              {/* 3rd place — right */}
              {podium.third && <PodiumCard entry={podium.third} place={3} />}
            </div>
          </section>
        )}

        {/* ===== FULL RANKING TABLE ===== */}
        <section className="cyber-panel animate-fade-in" style={{ padding: 0 }}>
          {/* Table header bar */}
          <div style={styles.tableHeader}>
            <div style={styles.tableTitle}>
              <Medal size={18} style={{ color: 'var(--primary, #6366f1)' }} />
              Full Rankings
            </div>
            <div style={styles.searchWrap}>
              <Search size={16} style={styles.searchIcon as React.CSSProperties} />
              <input
                type="text"
                placeholder="Search developer…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={styles.searchInput}
                onFocus={(e) => {
                  (e.target as HTMLInputElement).style.borderColor = 'var(--primary, #6366f1)';
                }}
                onBlur={(e) => {
                  (e.target as HTMLInputElement).style.borderColor = 'var(--border-color, rgba(255, 255, 255, 0.08))';
                }}
              />
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={{ ...styles.th, width: 60 }}>#</th>
                  <th style={styles.th}>Developer</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>Solved</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>Breakdown</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>Streak</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>Last Active</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ ...styles.td, textAlign: 'center', padding: '2rem' }}>
                      <span style={{ color: 'var(--text-muted, #a1a1aa)' }}>
                        {search ? 'No developers match your search.' : 'No data yet.'}
                      </span>
                    </td>
                  </tr>
                )}
                {filtered.map((entry, idx) => {
                  const total = entry.easySolved + entry.mediumSolved + entry.hardSolved || 1;
                  const isEven = idx % 2 === 0;
                  return (
                    <tr
                      key={entry.username + entry.rank}
                      style={{
                        background: isEven ? 'transparent' : 'rgba(255, 255, 255, 0.02)',
                        transition: 'background .15s',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLTableRowElement).style.background =
                          'rgba(99, 102, 241, 0.05)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLTableRowElement).style.background = isEven
                          ? 'transparent'
                          : 'rgba(255, 255, 255, 0.02)';
                      }}
                    >
                      {/* Rank */}
                      <td style={styles.td}>
                        <RankBadge rank={entry.rank} />
                      </td>

                      {/* Developer */}
                      <td style={styles.td}>
                        <div style={styles.devCell}>
                          <div
                            style={{
                              ...styles.avatar,
                              background: avatarColor(entry.username),
                            }}
                          >
                            {initials(entry.username)}
                          </div>
                          <span style={{ fontWeight: 600 }}>{entry.username}</span>
                        </div>
                      </td>

                      {/* Problems Solved */}
                      <td style={{ ...styles.td, textAlign: 'center', fontWeight: 700 }}>
                        {entry.totalSolved}
                      </td>

                      {/* Breakdown mini-bar */}
                      <td style={{ ...styles.td, textAlign: 'center' }}>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 3,
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              width: 110,
                              height: 6,
                              borderRadius: 4,
                              overflow: 'hidden',
                              background: '#27272a',
                            }}
                          >
                            <div
                              style={{
                                width: `${(entry.easySolved / total) * 100}%`,
                                background: 'var(--success, #22c55e)',
                              }}
                            />
                            <div
                              style={{
                                width: `${(entry.mediumSolved / total) * 100}%`,
                                background: 'var(--warning, #f59e0b)',
                              }}
                            />
                            <div
                              style={{
                                width: `${(entry.hardSolved / total) * 100}%`,
                                background: 'var(--danger, #ef4444)',
                              }}
                            />
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              gap: 8,
                              fontSize: '.68rem',
                              color: 'var(--text-muted, #a1a1aa)',
                            }}
                          >
                            <span style={{ color: 'var(--success, #22c55e)' }}>
                              {entry.easySolved}
                            </span>
                            <span style={{ color: 'var(--warning, #f59e0b)' }}>
                              {entry.mediumSolved}
                            </span>
                            <span style={{ color: 'var(--danger, #ef4444)' }}>
                              {entry.hardSolved}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Streak */}
                      <td style={{ ...styles.td, textAlign: 'center' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            fontWeight: 600,
                            color: entry.streak > 0 ? '#f97316' : 'var(--text-muted, #a1a1aa)',
                          }}
                        >
                          <Flame
                            size={14}
                            style={{
                              color: entry.streak > 0 ? '#f97316' : 'var(--text-muted, #a1a1aa)',
                            }}
                          />
                          {entry.streak}
                        </span>
                      </td>

                      {/* Last Active */}
                      <td
                        style={{
                          ...styles.td,
                          textAlign: 'right',
                          color: 'var(--text-muted, #a1a1aa)',
                          fontSize: '.82rem',
                        }}
                      >
                        {timeAgo(entry.lastActive)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
