import { useEffect, useState, useMemo } from 'react';
import { 
  Award, CheckCircle2, Lock, Unlock, Play, ChevronRight, HelpCircle, Map,
  Database, Maximize2, Layers, GitCommit, GitBranch, GitMerge, Binary, Sigma, Sparkles, Brain,
  Star, X, Skull, Trophy
} from 'lucide-react';

interface Problem {
  id: string;
  title: string;
  difficulty: string;
  category: string;
}

interface RoadmapCategory {
  name: string;
  worldName: string;
  description: string;
  lore: string;
  problems: Problem[];
  icon: any;
}

interface RoadmapProps {
  onSelectProblem: (id: string) => void;
  currentUser?: { name: string; email: string; role: string } | null;
}

export default function Roadmap({ onSelectProblem, currentUser }: RoadmapProps) {
  const [problemsList, setProblemsList] = useState<Problem[]>([]);
  const [solvedProblemIds, setSolvedProblemIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  
  // Selected category state for the slide-out drawer
  const [selectedCategory, setSelectedCategory] = useState<RoadmapCategory | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchProblems = fetch('http://localhost:5015/api/problems').then(res => res.json());
    const fetchSubmissions = fetch('http://localhost:5015/api/problems/submissions').then(res => res.json());

    Promise.all([fetchProblems, fetchSubmissions])
      .then(([problemsData, submissionsData]) => {
        const solved = new Set<string>(
          submissionsData
            .filter((sub: any) => sub.status === 'Accepted')
            .map((sub: any) => sub.problemId)
        );
        setSolvedProblemIds(solved);
        setProblemsList(problemsData as Problem[]);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching roadmap data:', err);
        setLoading(false);
      });
  }, []);

  // Define 9 World Zones with lore and categories
  const roadmap: RoadmapCategory[] = useMemo(() => {
    if (problemsList.length === 0) return [];
    return [
      {
        name: 'Arrays & Hashmaps',
        worldName: 'World 1: Sandy Arraylands',
        description: 'Master array traversal, value counting, caching, and hash map lookups.',
        lore: 'A vast desert of raw datasets. Learn to sift through values, map frequencies, and optimize lookup keys in constant time.',
        problems: problemsList.filter(p => p.category === 'Arrays & Hashing' || p.category === 'Array / String' || p.category === 'Hashmap'),
        icon: Database
      },
      {
        name: 'Two Pointers & Sliding Window',
        worldName: 'World 2: The Sliding Shorelines',
        description: 'Traverse sorted inputs, dynamic window ranges, and sliding subsegment optimization.',
        lore: 'A dynamic landscape of moving barriers. Align double pointers to shrink search domains and slide search windows to grab optimal values.',
        problems: problemsList.filter(p => p.category === 'Two Pointers' || p.category === 'Sliding Window'),
        icon: Maximize2
      },
      {
        name: 'Stacks, Matrices & Intervals',
        worldName: 'World 3: The Stacked Summit',
        description: 'Practice LIFO parsing, 2D coordinates, cellular logic, and overlapping segment merges.',
        lore: 'A treacherous vertical climb. Pile up elements to parse nested syntax, navigate grid terrains, and merge overlapping time corridors.',
        problems: problemsList.filter(p => p.category === 'Stacks' || p.category === 'Stack' || p.category === 'Matrix' || p.category === 'Intervals'),
        icon: Layers
      },
      {
        name: 'Linked Lists & Heap Cache',
        worldName: 'World 4: Pointer Pass',
        description: 'Manipulate pointers, list loops, node reversals, and min/max priority heap queues.',
        lore: 'A labyrinth of chained anchors. Redirect pointer lines, break cycle loops, and fetch instant extrema via optimal heap registers.',
        problems: problemsList.filter(p => p.category === 'Linked List' || p.category === 'Heap'),
        icon: GitCommit
      },
      {
        name: 'Binary Trees & BSTs',
        worldName: 'World 5: The Whispering Woods',
        description: 'Understand recursive tree traversals, DFS/BFS hierarchies, and search-tree validations.',
        lore: 'A branching forest of recursively repeating subproblems. Ascend nodes, depth-search pathways, and query strict search structures.',
        problems: problemsList.filter(p => p.category.includes('Tree')),
        icon: GitBranch
      },
      {
        name: 'Graphs & Tries',
        worldName: 'World 6: Network Nebula',
        description: 'Master island counters, course prerequisites, topological sort, and prefix tries.',
        lore: 'An interconnected web of cosmic stations. Traverse topological courses, map clusters of isolated islands, and autocomplete prefix channels.',
        problems: problemsList.filter(p => p.category.includes('Graph') || p.category === 'Trie'),
        icon: GitMerge
      },
      {
        name: 'Binary Search & Bit Manipulation',
        worldName: 'World 7: The Logarithmic Depths',
        description: 'Logarithmic segment reductions, peak finders, bitwise operations, and mask registers.',
        lore: 'Deep ocean trenches of half-cuts. Cut searching space in halves, locate peak values, and tweak raw register bits using binary masks.',
        problems: problemsList.filter(p => p.category === 'Binary Search' || p.category === 'Bit Manipulation'),
        icon: Binary
      },
      {
        name: 'Math & Backtracking',
        worldName: 'World 8: Permutation Palace',
        description: 'Permutations, combinations, subsets, word search, and prime calculations.',
        lore: 'The royal hall of branching timelines. Systematically spin up sub-decisions, traverse all possible subsets, and prune dead-end branches.',
        problems: problemsList.filter(p => p.category === 'Math' || p.category === 'Backtracking'),
        icon: Sigma
      },
      {
        name: 'Dynamic Programming',
        worldName: 'World 9: The DP Boss Portal',
        description: 'Optimize recursive structures, bottom-up DP matrices, coin changes, and path sums.',
        lore: 'The final dimensional gate. Cache subproblems, construct bottom-up tables, and beat the final boss to achieve algorithmic perfection.',
        problems: problemsList.filter(p => p.category.includes('DP') || p.category === "Kadane's Algorithm" || p.category === "Divide & Conquer"),
        icon: Skull
      }
    ];
  }, [problemsList]);

  // Lock/Unlock check: A world is unlocked if index is 0 or if the previous world has at least 1 solved problem
  const isWorldUnlocked = (idx: number): boolean => {
    if (idx === 0) return true;
    const prevWorld = roadmap[idx - 1];
    if (!prevWorld) return false;
    const solvedInPrev = prevWorld.problems.filter(p => solvedProblemIds.has(p.id)).length;
    return solvedInPrev > 0;
  };

  // 3-star calculation:
  // 0% solved: 0 stars
  // > 0% and < 40% solved: 1 star
  // >= 40% and < 80% solved: 2 stars
  // >= 80% solved: 3 stars
  const calculateStars = (cat: RoadmapCategory): number => {
    const total = cat.problems.length;
    if (total === 0) return 0;
    const solved = cat.problems.filter(p => solvedProblemIds.has(p.id)).length;
    const pct = (solved / total) * 100;
    if (pct >= 80) return 3;
    if (pct >= 40) return 2;
    if (pct > 0) return 1;
    return 0;
  };

  // Find the player's active level index: the highest unlocked level
  const playerActiveIndex = useMemo(() => {
    let activeIdx = 0;
    for (let i = 0; i < roadmap.length; i++) {
      if (isWorldUnlocked(i)) {
        activeIdx = i;
      }
    }
    return activeIdx;
  }, [roadmap, solvedProblemIds]);

  // Statistics
  const totalRoadmapProblems = problemsList.length;
  const solvedRoadmapProblems = problemsList.filter(p => solvedProblemIds.has(p.id)).length;

  const handleNodeClick = (cat: RoadmapCategory, idx: number) => {
    if (!isWorldUnlocked(idx)) return;
    setSelectedCategory(cat);
    setIsDrawerOpen(true);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1000px', margin: '0 auto', paddingBottom: '4rem' }}>
      
      {/* HUD and Game CSS styles */}
      <style>{`
        .game-board {
          position: relative;
          background: radial-gradient(circle at 50% 100%, #13131c 0%, #0a0a0c 60%, #060608 100%);
          border: 1px solid var(--border-color);
          border-radius: 0.75rem;
          padding: 4rem 2rem;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }
        
        .level-node-wrapper {
          position: absolute;
          z-index: 10;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .level-node-bubble {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #2a2a35 0%, #0c0c11 100%);
          border: 3px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 4px 12px rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .level-node-bubble.unlocked:hover {
          transform: scale(1.06);
          border-color: var(--primary);
          box-shadow: 0 4px 20px rgba(99, 102, 241, 0.15);
        }

        .level-node-bubble.completed {
          border-color: #10b981;
          background: radial-gradient(circle at 30% 30%, #064e3b 0%, #022c22 100%);
          box-shadow: 0 4px 16px rgba(16, 185, 129, 0.15);
        }

        .level-node-bubble.locked {
          opacity: 0.6;
          cursor: not-allowed;
          background: #141416;
          border-color: rgba(255,255,255,0.03);
          box-shadow: none;
        }

        /* Boss Portal Custom Styling */
        .level-node-bubble.boss-node {
          width: 104px;
          height: 104px;
          border: 4px solid #ef4444;
          background: radial-gradient(circle at 30% 30%, #7f1d1d 0%, #1c0202 100%);
          box-shadow: 0 4px 20px rgba(239, 68, 68, 0.15);
        }
        
        .level-node-bubble.boss-node.unlocked:hover {
          transform: scale(1.05);
          border-color: #f87171;
          box-shadow: 0 4px 20px rgba(239, 68, 68, 0.2);
        }

        /* Star styling */
        .star-container {
          display: flex;
          gap: 2px;
          margin-top: 6px;
        }

        .star-item {
          transition: transform 0.3s ease;
        }
        
        .level-node-wrapper:hover .star-item.active {
          transform: scale(1.2) rotate(10deg);
        }

        /* Float animation for player token */
        @keyframes floatPin {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @keyframes floatCloud {
          0% { transform: translateX(0); }
          50% { transform: translateX(45px); }
          100% { transform: translateX(0); }
        }

        @keyframes swayMountain1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-8px, 4px); }
        }
        @keyframes swayMountain2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(8px, -3px); }
        }
        @keyframes windBlow {
          0% { transform: translateX(-300px); opacity: 0; }
          15%, 85% { opacity: 0.25; }
          100% { transform: translateX(900px); opacity: 0; }
        }

        .sway-mount-1 {
          animation: swayMountain1 15s ease-in-out infinite alternate;
          transform-origin: bottom center;
        }
        .sway-mount-2 {
          animation: swayMountain2 20s ease-in-out infinite alternate;
          transform-origin: bottom center;
        }

        .player-token-pin {
          position: absolute;
          top: -95px;
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: floatPin 2.2s ease-in-out infinite;
          z-index: 50;
          pointer-events: none;
        }

        .player-avatar-badge {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #fbbf24 0%, #b45309 100%);
          border: 2px solid #fff;
          box-shadow: 0 2px 8px rgba(251, 191, 36, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000;
          font-size: 14px;
          font-weight: 900;
          font-family: 'Outfit', sans-serif;
          text-shadow: 0 1px 1px rgba(255,255,255,0.4);
        }

        .player-avatar-label {
          background: #fbbf24;
          color: #000;
          font-size: 8px;
          font-weight: 900;
          padding: 1px 5px;
          border-radius: 4px;
          margin-top: 3px;
          letter-spacing: 0.5px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.4);
        }

        .player-avatar-arrow {
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top: 5px solid #fbbf24;
          margin-top: 1px;
        }

        /* Floating label under bubble */
        .level-label {
          margin-top: 8px;
          font-size: 11px;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.7);
          text-align: center;
          white-space: nowrap;
          pointer-events: none;
          letter-spacing: -0.01em;
          text-shadow: 0 2px 4px rgba(0,0,0,0.6);
          transition: color 0.3s;
        }

        .level-node-wrapper:hover .level-label {
          color: #fff;
        }

        /* sliding drawer panels */
        .drawer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          z-index: 999;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .drawer-overlay.open {
          opacity: 1;
          pointer-events: auto;
        }

        .quest-drawer {
          position: fixed;
          top: 0;
          right: -460px;
          width: 440px;
          height: 100vh;
          background: rgba(10, 10, 12, 0.96);
          backdrop-filter: blur(30px);
          border-left: 1px solid var(--border-color);
          box-shadow: -15px 0 50px rgba(0, 0, 0, 0.85);
          z-index: 1000;
          transition: right 0.45s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          padding: 2.25rem 2rem;
        }

        .quest-drawer.open {
          right: 0;
        }

        .quest-objective-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 14px;
          padding: 1.25rem;
          transition: all 0.3s;
        }
        
        .quest-objective-card:hover {
          background: rgba(255, 255, 255, 0.01);
          border-color: var(--border-color-active);
        }

        .quest-mission-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 12px;
          transition: all 0.25s;
        }

        .quest-mission-row:hover {
          background: rgba(255, 255, 255, 0.04);
          border-color: var(--border-color-active);
          transform: translateX(4px);
        }

        /* Scrollbar custom styles */
        .drawer-scroller::-webkit-scrollbar {
          width: 6px;
        }
        .drawer-scroller::-webkit-scrollbar-track {
          background: transparent;
        }
        .drawer-scroller::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 10px;
        }
        .drawer-scroller::-webkit-scrollbar-thumb:hover {
          background: var(--primary);
        }
      `}</style>

      {/* Header HUD */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.04em', color: '#fff', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: '10px', textShadow: 'none' }}>
            <Map size={26} style={{ color: 'var(--primary)' }} /> Level Pathway Roadmap
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>Climb the connected mountain summits, collect stars, and challenge the Dynamic Programming boss.</p>
        </div>
        
        {/* HUD Progress widget */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <div style={{ padding: '0.6rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px' }}>
            <Award size={20} style={{ color: '#fbbf24' }} />
            <div>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.5px' }}>Overall Progress</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#fff' }}>{solvedRoadmapProblems} / {totalRoadmapProblems} solved</span>
            </div>
          </div>
        </div>
      </div>

      {/* Game Mountain Arena Board */}
      <div className="game-board" style={{ height: '1380px' }}>
        
        {/* Curvy Path SVG Pipeline and Background Vector Mountains */}
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }} viewBox="0 0 800 1380" preserveAspectRatio="none">
          <defs>
            {/* Mountain and path gradients */}
            <linearGradient id="mountainSummitGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#a5b4fc" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#4338ca" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#0a0a0c" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="mountainMidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#312e81" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0a0a0c" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="mountainValleyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#064e3b" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#0a0a0c" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="pipelineGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="35%" stopColor="#818cf8" />
              <stop offset="70%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>

          {/* Layer 1: Snowy Summit Mountain (X=400, Y=75) */}
          <g className="sway-mount-1">
            <path
              d="M 100 650 L 400 50 L 700 650 Z"
              fill="url(#mountainSummitGradient)"
            />
            {/* Snow cap */}
            <path
              d="M 330 160 L 400 50 L 470 160 L 435 140 L 400 170 L 365 140 Z"
              fill="#ffffff"
              opacity="0.85"
              style={{ filter: 'drop-shadow(0 1px 2px rgba(255,255,255,0.3))' }}
            />
          </g>

          {/* Layer 2: Midground mountain peaks */}
          <g className="sway-mount-2">
            <path
              d="M -50 950 L 220 520 L 520 950 Z"
              fill="url(#mountainMidGradient)"
            />
            <path
              d="M 280 1000 L 580 480 L 850 1000 Z"
              fill="url(#mountainMidGradient)"
            />
          </g>

          {/* Layer 3: Valley hills / lower terrain */}
          <g className="sway-mount-1">
            <path
              d="M -100 1380 Q 200 1050 450 1380 Z"
              fill="url(#mountainValleyGradient)"
            />
            <path
              d="M 350 1380 Q 600 1100 900 1380 Z"
              fill="url(#mountainValleyGradient)"
            />
          </g>

          {/* Decorative Evergreen Pine Trees */}
          {/* Valley trees */}
          <g transform="translate(120, 1150)"><polygon points="10,0 0,20 20,20" fill="#047857" /><polygon points="10,-8 2,12 18,12" fill="#059669" /><rect x="9" y="20" width="2" height="6" fill="#78350f" /></g>
          <g transform="translate(140, 1170)"><polygon points="8,0 0,16 16,16" fill="#065f46" /><polygon points="8,-6 2,10 14,10" fill="#047857" /><rect x="7" y="16" width="2" height="4" fill="#78350f" /></g>
          <g transform="translate(680, 1080)"><polygon points="10,0 0,20 20,20" fill="#047857" /><polygon points="10,-8 2,12 18,12" fill="#059669" /><rect x="9" y="20" width="2" height="6" fill="#78350f" /></g>
          {/* Slopes trees */}
          <g transform="translate(70, 780)"><polygon points="10,0 0,20 20,20" fill="#1e3a8a" /><polygon points="10,-8 2,12 18,12" fill="#2563eb" /><rect x="9" y="20" width="2" height="6" fill="#1e293b" /></g>
          <g transform="translate(710, 680)"><polygon points="10,0 0,20 20,20" fill="#1e3a8a" /><polygon points="10,-8 2,12 18,12" fill="#2563eb" /><rect x="9" y="20" width="2" height="6" fill="#1e293b" /></g>
          <g transform="translate(260, 580)"><polygon points="8,0 0,16 16,16" fill="#312e81" /><polygon points="8,-6 2,10 14,10" fill="#3730a3" /><rect x="7" y="16" width="2" height="4" fill="#1e293b" /></g>
          
          {/* Floating Semitransparent Clouds */}
          <g style={{ animation: 'floatCloud 18s ease-in-out infinite', opacity: 0.2 }}>
            <path d="M 120 350 Q 140 320 170 330 Q 200 310 230 330 Q 250 350 230 370 L 130 370 Z" fill="#ffffff" />
          </g>
          <g style={{ animation: 'floatCloud 24s ease-in-out infinite alternate', opacity: 0.15 }}>
            <path d="M 520 680 Q 540 650 570 660 Q 600 640 630 660 Q 650 680 630 700 L 530 700 Z" fill="#ffffff" />
          </g>

          {/* Wind overlay lines */}
          <path d="M 50 200 L 250 200" stroke="rgba(99,102,241,0.08)" strokeWidth="1.5" strokeDasharray="30 15" style={{ animation: 'windBlow 12s linear infinite' }} />
          <path d="M 350 450 L 550 450" stroke="rgba(16,185,129,0.06)" strokeWidth="1.5" strokeDasharray="40 20" style={{ animation: 'windBlow 18s linear infinite 4s' }} />
          <path d="M 100 800 L 300 800" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="25 15" style={{ animation: 'windBlow 15s linear infinite 8s' }} />

          {/* Winding trail path */}
          {/* Trail backing shadow */}
          <path
            d="M 400 1250 C 300 1250, 200 1170, 200 1090 C 200 1010, 600 1025, 600 945 C 600 865, 200 880, 200 800 C 200 720, 600 735, 600 655 C 600 575, 200 590, 200 510 C 200 430, 600 445, 600 365 C 600 285, 200 300, 200 220 C 200 140, 400 140, 400 75"
            fill="none"
            stroke="rgba(0,0,0,0.5)"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Glowing central rope track */}
          <path
            d="M 400 1250 C 300 1250, 200 1170, 200 1090 C 200 1010, 600 1025, 600 945 C 600 865, 200 880, 200 800 C 200 720, 600 735, 600 655 C 600 575, 200 590, 200 510 C 200 430, 600 445, 600 365 C 600 285, 200 300, 200 220 C 200 140, 400 140, 400 75"
            fill="none"
            stroke="url(#pipelineGradient)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="10 8"
            style={{ filter: 'drop-shadow(0 1px 2px rgba(99, 102, 241, 0.12))' }}
          />
          {/* Active progress track line */}
          <path
            d="M 400 1250 C 300 1250, 200 1170, 200 1090 C 200 1010, 600 1025, 600 945 C 600 865, 200 880, 200 800 C 200 720, 600 735, 600 655 C 600 575, 200 590, 200 510 C 200 430, 600 445, 600 365 C 600 285, 200 300, 200 220 C 200 140, 400 140, 400 75"
            fill="none"
            stroke="#10b981"
            strokeWidth="6"
            strokeLinecap="round"
            pathLength="100"
            strokeDasharray="100"
            strokeDashoffset={100 - (playerActiveIndex / 8) * 100}
            style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1)', filter: 'drop-shadow(0 1px 3px rgba(16, 185, 129, 0.2))' }}
          />
        </svg>

        {/* Absolute Level Nodes Map */}
        {roadmap.map((cat, idx) => {
          const Icon = cat.icon || Database;
          const totalInCat = cat.problems.length;
          const solvedInCat = cat.problems.filter(p => solvedProblemIds.has(p.id)).length;
          const isCompleted = totalInCat > 0 && solvedInCat === totalInCat;
          const unlocked = isWorldUnlocked(idx);
          const starsCount = calculateStars(cat);
          const isActive = playerActiveIndex === idx;

          // Mountain Climbing ascending offsets (World 1 is at the bottom valley, World 9 is at the summit peak)
          const offsets = [

            { left: '50%', top: '1250px' }, // World 1: Sandy Arraylands (Valley Entry)
            { left: '25%', top: '1090px' }, // World 2: Sliding Shorelines
            { left: '75%', top: '945px' },  // World 3: Stacked Summit
            { left: '25%', top: '800px' },  // World 4: Pointer Pass
            { left: '75%', top: '655px' },  // World 5: Whispering Woods
            { left: '25%', top: '510px' },  // World 6: Network Nebula
            { left: '75%', top: '365px' },  // World 7: Logarithmic Depths
            { left: '25%', top: '220px' },  // World 8: Permutation Palace
            { left: '50%', top: '75px' }    // World 9: DP Boss Portal (Summit Peak)
          ];

          const isBoss = idx === 8;

          return (
            <div 
              key={cat.name} 
              className="level-node-wrapper"
              style={{ left: offsets[idx].left, top: offsets[idx].top }}
            >
              {/* Player avatar pin floating directly above the active node */}
              {isActive && unlocked && (
                <div className="player-token-pin">
                  <div className="player-avatar-hud" style={{
                    background: 'rgba(9, 9, 11, 0.92)',
                    border: '1px solid rgba(251, 191, 36, 0.4)',
                    borderRadius: '6px',
                    padding: '3px 8px',
                    fontSize: '8px',
                    fontFamily: 'var(--font-mono)',
                    color: '#fbbf24',
                    fontWeight: 700,
                    marginBottom: '4px',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1px'
                  }}>
                    <span style={{ fontSize: '7px', color: 'rgba(251,191,36,0.5)' }}>ALTITUDE</span>
                    <span>{100 + idx * 260}m</span>
                  </div>
                  <div className="player-avatar-badge">
                    {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'P'}
                  </div>
                  <div className="player-avatar-label">YOU</div>
                  <div className="player-avatar-arrow" />
                </div>
              )}

              {/* Node Bubble */}
              <div 
                className={`level-node-bubble ${unlocked ? 'unlocked' : 'locked'} ${isCompleted ? 'completed' : ''} ${isBoss ? 'boss-node' : ''}`}
                onClick={() => handleNodeClick(cat, idx)}
              >
                {!unlocked ? (
                  <Lock size={isBoss ? 32 : 24} style={{ color: 'rgba(255,255,255,0.15)' }} />
                ) : isBoss ? (
                  <Skull size={36} style={{ color: '#ef4444', filter: 'drop-shadow(0 1px 3px rgba(239, 68, 68, 0.25))' }} />
                ) : (
                  <Icon size={24} style={{ color: isCompleted ? '#10b981' : 'var(--text-main)' }} />
                )}
              </div>

              {/* Stars rating container */}
              {unlocked && (
                <div className="star-container">
                  {[1, 2, 3].map((s) => (
                    <Star 
                      key={s} 
                      size={12} 
                      className={`star-item ${s <= starsCount ? 'active' : ''}`}
                      fill={s <= starsCount ? '#fbbf24' : 'transparent'} 
                      stroke={s <= starsCount ? '#fbbf24' : 'rgba(255, 255, 255, 0.15)'} 
                      style={{ 
                        filter: s <= starsCount ? 'drop-shadow(0 1px 2px rgba(251, 191, 36, 0.3))' : 'none'
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Floating label */}
              <div className="level-label" style={{ color: unlocked ? 'var(--text-main)' : 'var(--text-muted)' }}>
                {isBoss ? '⚔️ WORLD 9: SUMMIT PORTAL' : cat.worldName.split(': ')[1]}
              </div>
            </div>
          );
        })}

      </div>

      {/* Quest Drawer Backdrop/Overlay */}
      <div 
        className={`drawer-overlay ${isDrawerOpen ? 'open' : ''}`} 
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* Slide-out Quest Objectives Drawer */}
      <div className={`quest-drawer ${isDrawerOpen ? 'open' : ''}`}>
        {selectedCategory && (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Drawer Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '6px' }}>
                  <Sparkles size={12} /> Quest World Selected
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-0.03em' }}>
                  {selectedCategory.worldName}
                </h2>
              </div>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                onMouseOver={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'none'; }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Lore and Details Card */}
            <div className="quest-objective-card">
              <span style={{ fontSize: '9px', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px', letterSpacing: '0.5px' }}>Realm Lore</span>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.45, fontStyle: 'italic' }}>
                "{selectedCategory.lore}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: 800 }}>Completion:</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 900, marginLeft: 'auto' }}>
                  {selectedCategory.problems.filter(p => solvedProblemIds.has(p.id)).length} / {selectedCategory.problems.length} Solved
                </span>
              </div>
            </div>

            {/* Missions Title */}
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.5rem', marginTop: '0.5rem' }}>
              <span style={{ fontSize: '10px', fontWeight: 900, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '1px' }}>Quest Objectives</span>
            </div>

            {/* Problems list scroller */}
            <div className="drawer-scroller" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '0.25rem' }}>
              {selectedCategory.problems.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic', padding: '2rem 1rem', textAlign: 'center' }}>
                  No targets pre-loaded in this region yet.
                </div>
              ) : (
                selectedCategory.problems.map((p) => {
                  const isSolved = solvedProblemIds.has(p.id);
                  return (
                    <div key={p.id} className="quest-mission-row">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', maxWidth: '65%' }}>
                        {isSolved ? (
                          <CheckCircle2 size={16} style={{ color: '#10b981', flexShrink: 0 }} />
                        ) : (
                          <HelpCircle size={16} style={{ color: 'var(--text-muted)', opacity: 0.3, flexShrink: 0 }} />
                        )}
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={p.title}>
                          {p.title}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span className={`difficulty-badge difficulty-${p.difficulty.toLowerCase()}`} style={{ fontSize: '8px', padding: '2px 8px', borderRadius: '4px', fontWeight: 900 }}>
                          {p.difficulty}
                        </span>
                        
                        <button 
                          style={{
                            padding: '6px 12px', fontSize: '9px', fontWeight: 900, borderRadius: '6px', cursor: 'pointer',
                            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff',
                            display: 'inline-flex', alignItems: 'center', gap: '4px', transition: 'all 0.2s', textTransform: 'uppercase', letterSpacing: '0.5px'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = 'var(--primary)';
                            e.currentTarget.style.borderColor = 'var(--primary)';
                            e.currentTarget.style.boxShadow = '0 0 8px var(--primary-glow)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                          onClick={() => {
                            setIsDrawerOpen(false);
                            onSelectProblem(p.id);
                          }}
                        >
                          Enter <Play size={8} fill="#fff" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
