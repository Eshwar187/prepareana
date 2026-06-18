import { useEffect, useState } from 'react';
import { Award, CheckCircle2, Lock, Unlock, Play, ChevronRight, HelpCircle } from 'lucide-react';

interface Problem {
  id: string;
  title: string;
  difficulty: string;
  category: string;
}

interface RoadmapCategory {
  name: string;
  description: string;
  problems: Problem[];
  unlocked: boolean;
}

interface RoadmapProps {
  onSelectProblem: (id: string) => void;
}

export default function Roadmap({ onSelectProblem }: RoadmapProps) {
  const [roadmap, setRoadmap] = useState<RoadmapCategory[]>([]);
  const [solvedProblemIds, setSolvedProblemIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState<string | null>('Arrays & Hashing');

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

        // Group into roadmap stages
        const problemsList = problemsData as Problem[];
        const stages: RoadmapCategory[] = [
          {
            name: '1. Arrays & Hashmaps',
            description: 'Master array traversal, value counting, caching, and hash map lookups. (Foundations)',
            problems: problemsList.filter(p => p.category === 'Arrays & Hashing' || p.category === 'Array / String' || p.category === 'Hashmap'),
            unlocked: true
          },
          {
            name: '2. Two Pointers & Sliding Window',
            description: 'Traverse sorted inputs, dynamic window ranges, and sliding subsegment optimization.',
            problems: problemsList.filter(p => p.category === 'Two Pointers' || p.category === 'Sliding Window'),
            unlocked: true
          },
          {
            name: '3. Stacks, Matrices & Intervals',
            description: 'Practice LIFO parsing, 2D coordinates, cellular logic, and overlapping segment merges.',
            problems: problemsList.filter(p => p.category === 'Stacks' || p.category === 'Stack' || p.category === 'Matrix' || p.category === 'Intervals'),
            unlocked: true
          },
          {
            name: '4. Linked Lists & Heap Cache',
            description: 'Manipulate pointers, list loops, node reversals, and min/max priority heap queues.',
            problems: problemsList.filter(p => p.category === 'Linked List' || p.category === 'Heap'),
            unlocked: true
          },
          {
            name: '5. Binary Trees & BSTs',
            description: 'Understand recursive tree traversals, DFS/BFS hierarchies, and search-tree validations.',
            problems: problemsList.filter(p => p.category.includes('Tree')),
            unlocked: true
          },
          {
            name: '6. Graphs & Tries',
            description: 'Master island counters, course prerequisites, topological sort, and prefix tries.',
            problems: problemsList.filter(p => p.category.includes('Graph') || p.category === 'Trie'),
            unlocked: true
          },
          {
            name: '7. Binary Search & Bit Manipulation',
            description: 'Logarithmic segment reductions, peak finders, bitwise operations, and mask registers.',
            problems: problemsList.filter(p => p.category === 'Binary Search' || p.category === 'Bit Manipulation'),
            unlocked: true
          },
          {
            name: '8. Math & Backtracking',
            description: 'Permutations, combinations, subsets, word search, and prime calculations.',
            problems: problemsList.filter(p => p.category === 'Math' || p.category === 'Backtracking'),
            unlocked: true
          },
          {
            name: '9. Dynamic Programming',
            description: 'Optimize recursive structures, bottom-up DP matrices, coin changes, and path sums.',
            problems: problemsList.filter(p => p.category.includes('DP') || p.category === "Kadane's Algorithm" || p.category === "Divide & Conquer"),
            unlocked: true
          }
        ];

        setRoadmap(stages);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching roadmap data:', err);
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

  // Calculate stats
  const totalRoadmapProblems = roadmap.reduce((acc, cat) => acc + cat.problems.length, 0);
  const solvedRoadmapProblems = roadmap.reduce(
    (acc, cat) => acc + cat.problems.filter(p => solvedProblemIds.has(p.id)).length,
    0
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#fff', margin: 0, marginBottom: '0.25rem' }}>LeetCode 150 Roadmap</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Follow this structured path to master algorithms step-by-step.</p>
        </div>
        
        {/* Progress Card */}
        <div className="glass-panel" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#18181b' }}>
          <Award size={20} style={{ color: 'var(--warning)' }} />
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Milestones Reached</span>
            <span style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>{solvedRoadmapProblems} / {totalRoadmapProblems} Solved</span>
          </div>
        </div>
      </div>

      {/* Roadmap Graph */}
      <div className="roadmap-container">
        <div className="roadmap-line"></div>
        
        {roadmap.map((cat) => {
          const solvedInCat = cat.problems.filter(p => solvedProblemIds.has(p.id)).length;
          const totalInCat = cat.problems.length;
          const isCatCompleted = totalInCat > 0 && solvedInCat === totalInCat;
          const isExpanded = expandedCategory === cat.name;

          return (
            <div key={cat.name} className="roadmap-node-wrapper">
              
              <div 
                className={`roadmap-node ${isCatCompleted ? 'completed' : ''}`}
                style={{
                  border: isExpanded ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                  background: '#18181b'
                }}
              >
                {/* Node Top row */}
                <div 
                  onClick={() => setExpandedCategory(isExpanded ? null : cat.name)}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '1.5rem' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {cat.unlocked ? (
                      isCatCompleted ? (
                        <CheckCircle2 size={20} style={{ color: 'var(--success)' }} />
                      ) : (
                        <Unlock size={16} style={{ color: 'var(--primary)' }} />
                      )
                    ) : (
                      <Lock size={16} style={{ color: 'var(--text-muted)' }} />
                    )}
                    
                    <div style={{ textAlign: 'left' }}>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff', margin: 0 }}>{cat.name}</h3>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {solvedInCat} / {totalInCat} Complete
                      </span>
                    </div>
                  </div>

                  <ChevronRight 
                    size={14} 
                    style={{
                      transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s',
                      color: 'var(--text-muted)'
                    }} 
                  />
                </div>

                {/* Node description */}
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'left', width: '100%', marginTop: '0.4rem', lineHeight: '1.4', margin: 0 }}>
                  {cat.description}
                </p>

                {/* Category Problems list (expanded) */}
                {isExpanded && (
                  <div style={{
                    width: '100%',
                    marginTop: '1.25rem',
                    borderTop: '1px solid var(--border-color)',
                    paddingTop: '0.85rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}>
                    {totalInCat === 0 ? (
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontStyle: 'italic', padding: '0.5rem' }}>
                        No problems pre-loaded for this stage yet.
                      </div>
                    ) : (
                      cat.problems.map((p) => {
                        const isSolved = solvedProblemIds.has(p.id);
                        return (
                          <div 
                            key={p.id}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '0.6rem 0.85rem',
                              background: '#09090b',
                              border: '1px solid var(--border-color)',
                              borderRadius: '0.375rem'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              {isSolved ? (
                                <CheckCircle2 size={14} style={{ color: 'var(--success)' }} />
                              ) : (
                                <HelpCircle size={14} style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
                              )}
                              <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#fff' }}>{p.title}</span>
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <span className={`difficulty-badge difficulty-${p.difficulty.toLowerCase()}`} style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem' }}>
                                {p.difficulty}
                              </span>
                              <button 
                                className="btn btn-secondary" 
                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                                onClick={() => onSelectProblem(p.id)}
                              >
                                <Play size={8} style={{ fill: 'currentColor' }} /> Solve
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
