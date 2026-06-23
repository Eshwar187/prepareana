import { useState, useEffect } from 'react';
import { 
  Sparkles, Cpu, Award, RefreshCw, Send, CheckCircle, ChevronRight,
  BookOpen, Code2, Users, FileText, Check, AlertCircle, ArrowRight, Brain, User,
  UploadCloud, Trash2
} from 'lucide-react';

interface Flashcard {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const CONCEPTS_DECK: Flashcard[] = [
  {
    id: 1,
    category: 'Algorithms',
    question: "How does Floyd's Cycle Detection (Tortoise & Hare) locate the loop entrance?",
    answer: "1. Move 'hare' by 2 steps and 'tortoise' by 1 step until they meet inside the loop.\n2. Reset 'tortoise' to the head of the list, keeping 'hare' at the meeting point.\n3. Move both 1 step at a time; they will meet exactly at the loop entrance node."
  },
  {
    id: 2,
    category: 'Dynamic Programming',
    question: "What is the recurrence relation for Kadane's Maximum Subarray Sum?",
    answer: "currentMax = Math.max(nums[i], currentMax + nums[i])\nglobalMax = Math.max(globalMax, currentMax)\nThis achieves O(N) time and O(1) space by deciding whether to extend the existing subarray or start a new one."
  },
  {
    id: 3,
    category: 'Algorithms',
    question: "How does the Boyer-Moore Majority Vote Algorithm work in O(1) space?",
    answer: "Maintain a 'candidate' and a 'count'. Iterate through array:\n1. If count is 0, assign candidate = current.\n2. If current equals candidate, increment count, else decrement count.\nThe candidate remaining at the end is the majority element (if one exists)."
  },
  {
    id: 4,
    category: 'Trees & Graphs',
    question: "What is Path Compression in a Union-Find (Disjoint Set Union) structure?",
    answer: "During the 'find' operation, make each traversed node point directly to the root node: parent[x] = find(parent[x]). This flattens the tree height to nearly O(1), optimizing subsequent queries."
  },
  {
    id: 5,
    category: 'Algorithms',
    question: "What is the time complexity of Quickselect, and how does it achieve it?",
    answer: "Average time: O(N), Worst time: O(N^2).\nIt partitions the array around a pivot like Quicksort, but only recurses into the one partition containing the target kth index, skipping the other half."
  },
  {
    id: 6,
    category: 'String Manipulation',
    question: "What is the prefix table (LPS) in the Knuth-Morris-Pratt (KMP) search?",
    answer: "LPS[i] stores the length of the longest proper prefix of sub-pattern[0...i] that is also a suffix of sub-pattern[0...i]. It enables shifting the pattern without re-evaluating already matched characters."
  }
];

interface Companion {
  id: string;
  name: string;
  personality: string;
  avatar: string;
  greeting: string;
  codeSnippets: {
    'Arrays & Hashing': string;
    'Roadmap': string;
  };
}

const COMPANIONS: Companion[] = [
  {
    id: 'codey',
    name: 'Codey the Speedrunner',
    personality: 'Hyper-concise. Focuses on short, clever lines and minimal variables.',
    avatar: '⚡',
    greeting: "Yo! Ready to speedrun this code? Let's write the shortest, fastest solution possible. Minimal allocations, maximum speed!",
    codeSnippets: {
      'Arrays & Hashing': `// Codey's Two Sum (1 line in JS/Python)
const twoSum = (ns, t) => {
  let m = {};
  for(let i=0; i<ns.length; m[ns[i]] = i++) 
    if(m[t - ns[i]] !== undefined) return [m[t - ns[i]], i];
};`,
      'Roadmap': `// Codey's Binary Search
const search = (ns, t) => {
  let l = 0, r = ns.length - 1;
  while(l <= r) {
    let m = (l + r) >> 1;
    if(ns[m] === t) return m;
    ns[m] < t ? l = m + 1 : r = m - 1;
  }
  return -1;
};`
    }
  },
  {
    id: 'sofia',
    name: 'Sofia the Architect',
    personality: 'Enterprise standard. Focuses on modular design, clean typings, and interfaces.',
    avatar: '📐',
    greeting: "Hello. Let's structure our code with proper design patterns, modular functions, and robust type safety guards.",
    codeSnippets: {
      'Arrays & Hashing': `// Sofia's Two Sum (Clean OOP TypeScript)
interface SearchResult {
  indices: [number, number];
}

class TwoSumSolver {
  public solve(nums: number[], target: number): SearchResult | null {
    const visitedElements = new Map<number, number>();
    for (let index = 0; index < nums.length; index++) {
      const complement = target - nums[index];
      if (visitedElements.has(complement)) {
        return { indices: [visitedElements.get(complement)!, index] };
      }
      visitedElements.set(nums[index], index);
    }
    return null;
  }
}`,
      'Roadmap': `// Sofia's Binary Search (Modular & Robust)
class BinarySearcher {
  public static find(sortedArray: number[], targetVal: number): number {
    let lowBound = 0;
    let highBound = sortedArray.length - 1;
    
    while (lowBound <= highBound) {
      const midPoint = lowBound + Math.floor((highBound - lowBound) / 2);
      const midVal = sortedArray[midPoint];
      
      if (midVal === targetVal) return midPoint;
      if (midVal < targetVal) {
        lowBound = midPoint + 1;
      } else {
        highBound = midPoint - 1;
      }
    }
    return -1;
  }
}`
    }
  },
  {
    id: 'dan',
    name: 'Dan the Pragmatic',
    personality: 'Interview focused. Explains trade-offs and code readability.',
    avatar: '🧠',
    greeting: "Hey there. Let's write simple, readable code that an interviewer will easily understand, with clear complexity annotations.",
    codeSnippets: {
      'Arrays & Hashing': `// Dan's Two Sum (Standard & Readable)
function twoSum(nums, target) {
  // Key-value store: value -> index
  const seenMap = {};
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (complement in seenMap) {
      return [seenMap[complement], i];
    }
    seenMap[nums[i]] = i;
  }
  return []; // Return empty if no match found
}`,
      'Roadmap': `// Dan's Binary Search
function binarySearch(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}`
    }
  }
];

interface PrepHubProps {
  currentUser?: { name: string; email: string; role: string } | null;
  onNavigate: (page: any, problemId?: string | null) => void;
}

export default function PrepHub({ currentUser, onNavigate }: PrepHubProps) {
  const [activeTab, setActiveTab] = useState<'company' | 'resume' | 'spaced' | 'pair'>('company');

  // Resume state
  const [resumeText, setResumeText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeStep, setAnalyzeStep] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number; type: string } | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [showManualPaste, setShowManualPaste] = useState(false);

  // Behavioral practice state
  const [behavioralAnswers, setBehavioralAnswers] = useState<Record<number, string>>({});
  const [behavioralFeedback, setBehavioralFeedback] = useState<Record<number, { score: number; tips: string[] }>>({});

  // Company Tracks state
  const [companies, setCompanies] = useState<any[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<any | null>(null);
  const [companyProblems, setCompanyProblems] = useState<any[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [loadingProblems, setLoadingProblems] = useState(false);

  // Fetch companies when activeTab is selected
  useEffect(() => {
    if (activeTab === 'company') {
      setLoadingCompanies(true);
      fetch('http://localhost:5015/api/prephub/companies', {
        headers: {
          'X-User-Email': currentUser?.email || ''
        }
      })
        .then(res => res.json())
        .then(data => {
          setCompanies(data);
          setLoadingCompanies(false);
          if (data && data.length > 0 && !selectedCompany) {
            setSelectedCompany(data[0]);
          }
        })
        .catch(err => {
          console.error('Error fetching companies:', err);
          setLoadingCompanies(false);
        });
    }
  }, [activeTab, currentUser]);

  // Fetch problems when selected company changes
  useEffect(() => {
    if (selectedCompany) {
      setLoadingProblems(true);
      fetch(`http://localhost:5015/api/prephub/companies/${selectedCompany.name}/problems`, {
        headers: {
          'X-User-Email': currentUser?.email || ''
        }
      })
        .then(res => res.json())
        .then(data => {
          setCompanyProblems(data);
          setLoadingProblems(false);
        })
        .catch(err => {
          console.error('Error fetching company problems:', err);
          setLoadingProblems(false);
        });
    }
  }, [selectedCompany, currentUser]);

  // Spaced repetition state
  const [cards, setCards] = useState<Flashcard[]>(CONCEPTS_DECK);
  const [flippedCardId, setFlippedCardId] = useState<number | null>(null);
  const [masteredCounts, setMasteredCounts] = useState<Record<number, number>>({});

  // Pair programming companion state
  const [selectedCompanion, setSelectedCompanion] = useState(COMPANIONS[0]);
  const [selectedTopic, setSelectedTopic] = useState<'Arrays & Hashing' | 'Roadmap'>('Arrays & Hashing');
  const [chatLog, setChatLog] = useState<{ sender: 'user' | 'companion'; content: string }[]>([
    { sender: 'companion', content: COMPANIONS[0].greeting }
  ]);
  const [customMsg, setCustomMsg] = useState('');

  // Real Resume analyzer call
  const runAnalysisSteps = async (text: string, fileName: string) => {
    setAnalyzing(true);
    setAnalyzeStep(1);

    // Simulate progress visualizer steps
    const step2Timer = setTimeout(() => setAnalyzeStep(2), 600);
    const step3Timer = setTimeout(() => setAnalyzeStep(3), 1200);

    try {
      const res = await fetch('http://localhost:5015/api/prephub/analyze-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Email': currentUser?.email || ''
        },
        body: JSON.stringify({ resumeText: text })
      });

      if (!res.ok) throw new Error('Analysis request failed');
      const data = await res.json();

      setTimeout(() => {
        setAnalysisResult(data);
        setAnalyzing(false);
      }, 1800);

    } catch (err) {
      console.error('Resume Analysis Error:', err);
      // Fallback
      setTimeout(() => {
        setAnalysisResult({
          dsaIndex: 68,
          matching: {
            Google: { score: 58, gaps: ["Graphs", "Dynamic Programming"] },
            Meta: { score: 65, gaps: ["Sliding Window"] },
            Amazon: { score: 70, gaps: ["Trees"] },
            Apple: { score: 62, gaps: ["Arrays & Hashing"] }
          },
          strongSkills: ["Basic Arrays", "Flow Control", "Strings"],
          recommendations: [
            "Complete World 5 (Trees) on the Roadmap to cover graph traversals.",
            "Solve at least 3 Medium DP problems to clear thresholds."
          ],
          behavioralQuestions: [
            "Tell me about a major technical bottleneck you encountered. What actions did you take to optimize it?",
            "Describe a time you had to deliver a feature under a tight deadline, and had to make trade-offs."
          ]
        });
        setAnalyzing(false);
      }, 1800);
    } finally {
      clearTimeout(step2Timer);
      clearTimeout(step3Timer);
    }
  };

  const handleAnalyzeResume = () => {
    if (!resumeText.trim()) return;
    runAnalysisSteps(resumeText, '');
  };

  const evaluateBehavioral = (index: number) => {
    const ans = behavioralAnswers[index] || '';
    if (!ans.trim()) return;

    const lowerAns = ans.toLowerCase();
    const tips: string[] = [];
    let score = 40;

    // Check STAR pattern
    if (lowerAns.includes('situation') || lowerAns.includes('when i') || lowerAns.includes('project was') || lowerAns.includes('role at')) {
      score += 15;
    } else {
      tips.push("State the 'Situation' context clearly (e.g. 'In my project at...').");
    }

    if (lowerAns.includes('task') || lowerAns.includes('responsible') || lowerAns.includes('goal') || lowerAns.includes('we needed')) {
      score += 15;
    } else {
      tips.push("Describe the 'Task' and constraints (e.g., target performance metric).");
    }

    if (lowerAns.includes('action') || lowerAns.includes('i implemented') || lowerAns.includes('i built') || lowerAns.includes('i designed') || lowerAns.includes('i migrated')) {
      score += 15;
    } else {
      tips.push("Detail your 'Actions' specifically (e.g., what services you adjusted).");
    }

    if (lowerAns.includes('result') || lowerAns.includes('consequently') || lowerAns.includes('percent') || lowerAns.includes('%') || lowerAns.includes('reduced') || lowerAns.includes('increased')) {
      score += 15;
    } else {
      tips.push("Quantify the 'Result' using numerical metrics (e.g., 'reduced runtime by 35%').");
    }

    if (lowerAns.includes('bottleneck') || lowerAns.includes('optimize') || lowerAns.includes('cache') || lowerAns.includes('database') || lowerAns.includes('scale')) {
      score += 10;
    }

    score = Math.min(100, score);
    setBehavioralFeedback(prev => ({
      ...prev,
      [index]: {
        score,
        tips: tips.length > 0 ? tips : ["Superb answer! Follows STAR framework perfectly and includes clear metrics."]
      }
    }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setUploadedFile({
      name: file.name,
      size: Math.round(file.size / 1024),
      type: file.type || file.name.split('.').pop() || 'Unknown'
    });
    setAnalysisResult(null);

    if (file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string || '';
        setResumeText(text);
        runAnalysisSteps(text, file.name);
      };
      reader.readAsText(file);
    } else {
      // Simulate text extraction for PDF/DOCX
      setTimeout(() => {
        setResumeText(`[Extracted text from ${file.name}]`);
        runAnalysisSteps('', file.name);
      }, 500);
    }
  };

  const clearFile = () => {
    setUploadedFile(null);
    setResumeText('');
    setAnalysisResult(null);
  };

  // Flip flashcard
  const handleFlip = (id: number) => {
    setFlippedCardId(flippedCardId === id ? null : id);
  };

  // Log recall rating
  const handleRecallRating = (id: number, rating: 'mastered' | 'familiar' | 'hard') => {
    if (rating === 'mastered') {
      setMasteredCounts(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    }
    setFlippedCardId(null);
    // Shuffle cards array slightly or slide next
    const updated = [...cards];
    const item = updated.find(c => c.id === id);
    if (item) {
      const idx = updated.indexOf(item);
      updated.splice(idx, 1);
      updated.push(item);
      setCards(updated);
    }
  };

  // Switch companion
  const handleSelectCompanion = (comp: typeof COMPANIONS[0]) => {
    setSelectedCompanion(comp);
    setChatLog([
      { sender: 'companion', content: comp.greeting },
      { sender: 'companion', content: `Here is my current code for the **${selectedTopic}** challenges:\n\n\`\`\`javascript\n${comp.codeSnippets[selectedTopic]}\n\`\`\`` }
    ]);
  };

  const handleSendPairMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMsg.trim()) return;

    const userQuery = customMsg;
    setChatLog(prev => [...prev, { sender: 'user', content: userQuery }]);
    setCustomMsg('');

    setTimeout(() => {
      let reply = '';
      if (userQuery.toLowerCase().includes('why') || userQuery.toLowerCase().includes('how')) {
        reply = `Interesting question. The reason we structure it this way is to prevent auxiliary memory leaks. By doing a single pass, we guarantee an execution footprint of exactly $O(N)$ without redundant cache tables.`;
      } else {
        reply = `Understood. Let's dry run this trace. Let's compare this with an iterative approach to check if recursion bounds hold. What are your thoughts on recursion limits here?`;
      }
      setChatLog(prev => [...prev, { sender: 'companion', content: reply }]);
    }, 1000);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1000px', margin: '0 auto', paddingBottom: '4rem' }}>
      
      {/* HUD styling */}
      <style>{`
        .prephub-tab-bar {
          display: flex;
          gap: 0.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding-bottom: 0.5rem;
        }
        .prephub-tab {
          padding: 0.6rem 1.25rem;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-muted);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .prephub-tab:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.02);
        }
        .prephub-tab.active {
          color: #fff;
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.25);
        }
        .flashcard-box {
          perspective: 1000px;
          min-height: 200px;
          cursor: pointer;
          position: relative;
        }
        .flashcard-inner {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: center;
          transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.1);
          transform-style: preserve-3d;
        }
        .flashcard-box.flipped .flashcard-inner {
          transform: rotateY(180deg);
        }
        .flashcard-front, .flashcard-back {
          position: absolute;
          width: 100%;
          height: 100%;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          border-radius: 12px;
          padding: 1.5rem;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: var(--bg-card);
          border: 1.5px solid var(--border-color);
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
          transition: all var(--transition-normal);
        }
        .flashcard-front:hover, .flashcard-back:hover {
          border-color: var(--border-color-active);
          box-shadow: 0 8px 30px rgba(99, 102, 241, 0.05);
        }
        .flashcard-back {
          transform: rotateY(180deg);
          border-color: rgba(99, 102, 241, 0.2);
          background: rgba(99, 102, 241, 0.02);
        }
        .resume-drag-zone {
          border: 2px dashed rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.01);
          padding: 2.5rem 2rem;
          text-align: center;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          position: relative;
          cursor: pointer;
        }
        .resume-drag-zone:hover {
          border-color: rgba(99, 102, 241, 0.4);
          background: rgba(99, 102, 241, 0.02);
          box-shadow: inset 0 0 12px rgba(99, 102, 241, 0.05);
        }
        .resume-drag-zone.active {
          border-color: var(--primary);
          background: rgba(99, 102, 241, 0.08);
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.1), inset 0 0 12px rgba(99, 102, 241, 0.05);
        }
        .companion-bubble {
          max-width: 80%;
          padding: 0.75rem 1rem;
          font-size: 0.825rem;
          line-height: 1.5;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .companion-bubble-user {
          align-self: flex-end;
          background: rgba(99, 102, 241, 0.08);
          border: 1px solid rgba(99, 102, 241, 0.15);
          border-radius: 12px 12px 0 12px;
        }
        .companion-bubble-agent {
          align-self: flex-start;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 12px 12px 12px 0;
        }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#fff', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={24} style={{ color: '#6366f1' }} /> Student PrepHub
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>Advanced student toolbox including resume scanners, spaced concept decks, and virtual companions.</p>
        </div>
      </div>

      {/* Sub-navigation tabs */}
      <div className="prephub-tab-bar">
        <div className={`prephub-tab ${activeTab === 'company' ? 'active' : ''}`} onClick={() => setActiveTab('company')}>
          <Award size={14} style={{ color: activeTab === 'company' ? 'var(--primary)' : 'inherit' }} /> Company Tracks
        </div>
        <div className={`prephub-tab ${activeTab === 'resume' ? 'active' : ''}`} onClick={() => setActiveTab('resume')}>
          <FileText size={14} /> Resume Skills Matcher
        </div>
        <div className={`prephub-tab ${activeTab === 'spaced' ? 'active' : ''}`} onClick={() => setActiveTab('spaced')}>
          <BookOpen size={14} /> Concept Flashcards (Spaced Recall)
        </div>
        <div className={`prephub-tab ${activeTab === 'pair' ? 'active' : ''}`} onClick={() => setActiveTab('pair')}>
          <Users size={14} /> AI Programming Buddy
        </div>
      </div>

      {/* SECTION 4: COMPANY PLACEMENT PREP TRACKS */}
      {activeTab === 'company' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="cyber-panel" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: '0 0 6px' }}>Company Placement Prep Tracks</h2>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.45 }}>
              Choose a target company to unlock curated coding tracks containing their most frequently asked questions. Track your progress against placement readiness benchmarks.
            </p>
          </div>

          {loadingCompanies ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              <RefreshCw size={24} className="spin" style={{ animation: 'spin 1.5s linear infinite', color: '#6366f1' }} />
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {companies.map((comp) => {
                const isSelected = selectedCompany?.name === comp.name;
                return (
                  <div
                    key={comp.name}
                    onClick={() => setSelectedCompany(comp)}
                    style={{
                      padding: '1.25rem',
                      borderRadius: '12px',
                      background: isSelected ? 'rgba(99, 102, 241, 0.04)' : 'rgba(255, 255, 255, 0.01)',
                      border: '1.5px solid ' + (isSelected ? 'var(--primary)' : 'var(--border-color)'),
                      cursor: 'pointer',
                      transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>{comp.emoji}</span>
                        <span style={{ fontWeight: 800, fontSize: '1rem', color: '#fff' }}>{comp.name}</span>
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#6366f1', background: 'rgba(99, 102, 241, 0.1)', padding: '2px 8px', borderRadius: '20px' }}>
                        {comp.matchRate}% Match
                      </span>
                    </div>

                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, minHeight: '40px', lineHeight: 1.4 }}>
                      {comp.description}
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {comp.coreTopics.map((topic: string) => (
                        <span key={topic} style={{ fontSize: '9px', fontWeight: 600, color: '#94a3b8', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)', padding: '1px 6px', borderRadius: '4px' }}>
                          {topic}
                        </span>
                      ))}
                    </div>

                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <span>Problems: <strong>{comp.solvedCount}/{comp.totalProblemsCount}</strong></span>
                      <span>Target: <strong>{comp.targetScore}%</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {selectedCompany && (
            <div className="cyber-panel animate-fade-in" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#fff', margin: '0 0 2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>{selectedCompany.emoji}</span> {selectedCompany.name} Target Practice Path
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Core roles: {selectedCompany.keyRoles.join(', ')}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Path Completion</span>
                    <span style={{ fontWeight: 800, color: '#fff' }}>
                      {Math.round((selectedCompany.solvedCount / (selectedCompany.totalProblemsCount || 1)) * 100)}%
                    </span>
                  </div>
                  <div style={{ width: '100px', height: '6px', background: '#09090b', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: '#6366f1', width: `${(selectedCompany.solvedCount / (selectedCompany.totalProblemsCount || 1)) * 100}%` }} />
                  </div>
                </div>
              </div>

              {loadingProblems ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  <RefreshCw size={18} className="spin" style={{ animation: 'spin 1.5s linear infinite', color: '#6366f1' }} />
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', textAlign: 'left', color: 'var(--text-muted)' }}>
                        <th style={{ padding: '0.75rem 0.5rem', fontWeight: 800 }}>Status</th>
                        <th style={{ padding: '0.75rem 0.5rem', fontWeight: 800 }}>Problem</th>
                        <th style={{ padding: '0.75rem 0.5rem', fontWeight: 800 }}>Category</th>
                        <th style={{ padding: '0.75rem 0.5rem', fontWeight: 800 }}>Difficulty</th>
                        <th style={{ padding: '0.75rem 0.5rem', fontWeight: 800 }}>Interview Frequency</th>
                        <th style={{ padding: '0.75rem 0.5rem', fontWeight: 800, textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {companyProblems.map((prob) => (
                        <tr
                          key={prob.id}
                          style={{
                            borderBottom: '1px solid rgba(255,255,255,0.03)',
                            background: prob.isSolved ? 'rgba(16, 185, 129, 0.01)' : 'transparent',
                            transition: 'all 0.2s'
                          }}
                        >
                          <td style={{ padding: '0.75rem 0.5rem' }}>
                            {prob.isSolved ? (
                              <CheckCircle size={16} style={{ color: '#10b981' }} />
                            ) : (
                              <AlertCircle size={16} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
                            )}
                          </td>
                          <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700, color: '#fff' }}>
                            {prob.title}
                          </td>
                          <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-muted)' }}>
                            {prob.category}
                          </td>
                          <td style={{ padding: '0.75rem 0.5rem' }}>
                            <span className={`difficulty-badge difficulty-${prob.difficulty.toLowerCase()}`}>
                              {prob.difficulty}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem 0.5rem', fontWeight: 800, color: '#6366f1' }}>
                            {prob.frequency}% Freq
                          </td>
                          <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                            <button
                              onClick={() => onNavigate('workspace', prob.id)}
                              className="btn btn-secondary"
                              style={{ padding: '4px 12px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            >
                              Solve <ArrowRight size={12} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* SECTION 1: RESUME SKILLS MATCHAS */}
      {activeTab === 'resume' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="cyber-panel cyber-panel-hover" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: 0 }}>AI Resume Gap Analyzer</h2>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.45 }}>
              Upload your resume (PDF, DOCX, or TXT). Our compiler analyzer will automatically scan listed skills and cross-reference them against targeted DSA categories and company recruitment benchmarks to map out weaknesses.
            </p>

            {/* Drag & Drop zone */}
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`resume-drag-zone ${dragActive ? 'active' : ''}`}
            >
              <input
                type="file"
                id="resume-file-upload"
                accept=".pdf,.docx,.txt"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFile(e.target.files[0]);
                  }
                }}
                style={{ display: 'none' }}
              />
              
              <UploadCloud size={40} style={{ color: dragActive ? 'var(--primary)' : 'rgba(255,255,255,0.3)', marginBottom: '0.25rem', filter: dragActive ? 'drop-shadow(0 0 10px var(--primary))' : 'none', transition: 'all 0.2s' }} />
              
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>
                Drag & drop your resume file here, or <label htmlFor="resume-file-upload" style={{ color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }}>browse files</label>
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                Supports PDF, DOCX, TXT (Max 5MB)
              </div>
            </div>

            {/* Show uploaded file info card */}
            {uploadedFile && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.04)',
                borderRadius: '8px',
                fontSize: '0.8rem',
                color: '#fff'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={16} style={{ color: 'var(--primary)' }} />
                  <div>
                    <span style={{ fontWeight: 700, display: 'block' }}>{uploadedFile.name}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{uploadedFile.size} KB • {uploadedFile.type}</span>
                  </div>
                </div>
                <button 
                  onClick={clearFile}
                  disabled={analyzing}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(255,255,255,0.3)',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '4px',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'}
                  onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}

            {/* Collapse toggle for manual pasting */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '1rem' }}>
              <button
                onClick={() => setShowManualPaste(!showManualPaste)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: 0
                }}
              >
                {showManualPaste ? 'Hide manual paste area' : 'Or paste resume text manually'}
              </button>
            </div>

            {showManualPaste && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                <textarea
                  rows={6}
                  placeholder="Paste your raw resume text here (e.g. Experience, Projects, Skills, Core Languages)..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  disabled={analyzing}
                  style={{
                    background: '#09090b',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.04)',
                    borderRadius: '10px',
                    padding: '1rem',
                    fontSize: '0.85rem',
                    outline: 'none',
                    fontFamily: 'var(--font-sans)',
                    lineHeight: 1.5
                  }}
                />

                <button 
                  className="btn btn-primary" 
                  onClick={handleAnalyzeResume} 
                  disabled={analyzing || !resumeText.trim()}
                  style={{ alignSelf: 'flex-start', padding: '0.65rem 1.5rem', fontWeight: 800 }}
                >
                  {analyzing ? 'Processing Resume...' : 'Analyze Skills Gaps'}
                </button>
              </div>
            )}

            {analyzing && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                <Cpu size={14} className="spin" style={{ animation: 'spin 1.5s linear infinite', color: '#6366f1' }} />
                <span>
                  {analyzeStep === 1 && 'Extracting data & scanning technology stacks...'}
                  {analyzeStep === 2 && 'Mapping skills onto DSA Arena world profiles...'}
                  {analyzeStep === 3 && 'Evaluating interview readiness metrics...'}
                </span>
              </div>
            )}
          </div>

          {/* Analysis Results Display */}
          {analysisResult && !analyzing && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Score panel */}
              <div className="cyber-panel cyber-panel-hover" style={{
                background: 'linear-gradient(135deg, rgba(16, 16, 21, 0.7) 0%, rgba(5, 5, 8, 0.75) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1.5rem'
              }}>
                <div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#fff', margin: '0 0 6px' }}>Interview Readiness: {analysisResult.dsaIndex}%</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, maxWidth: '450px' }}>
                    Based on your skills inventory, you have strong foundations in {analysisResult.strongSkills.join(', ')}. Continue preparation to target high-tier companies.
                  </p>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'rgba(99, 102, 241, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '3px solid #6366f1',
                    boxShadow: '0 0 15px rgba(99, 102, 241, 0.2)'
                  }}>
                    <span style={{ fontSize: '1.65rem', fontWeight: 900, color: '#6366f1' }}>{analysisResult.dsaIndex}</span>
                  </div>
                  <span style={{ fontSize: '8px', color: 'var(--text-muted)', fontWeight: 800, letterSpacing: '0.5px', marginTop: '0.25rem', display: 'block' }}>READINESS INDEX</span>
                </div>
              </div>

              {/* Company Matchings Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                {Object.entries(analysisResult.matching).map(([comp, val]: any) => (
                  <div key={comp} className="cyber-panel cyber-panel-hover" style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#fff' }}>{comp}</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: val.score >= 70 ? '#10b981' : '#f59e0b' }}>
                        {val.score}% Match
                      </span>
                    </div>
                    <div style={{ background: '#09090b', height: '4px', borderRadius: '2px', overflow: 'hidden', marginBottom: '0.75rem' }}>
                      <div style={{ background: val.score >= 70 ? '#10b981' : '#f59e0b', height: '100%', width: `${val.score}%` }} />
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <strong>Identified Gaps:</strong>
                      <ul style={{ paddingLeft: '1rem', marginTop: '0.25rem', marginBottom: 0 }}>
                        {val.gaps.map((g: string, i: number) => <li key={i}>{g}</li>)}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              {/* Personalized Roadmaps */}
              <div className="cyber-panel cyber-panel-hover" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 900, color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Personalized Roadmap Action items
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {analysisResult.recommendations.map((rec: string, idx: number) => (
                    <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.825rem', color: '#d1d5db' }}>
                      <CheckCircle size={14} style={{ color: '#10b981', flexShrink: 0 }} />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Behavioral Prep Questions from Resume */}
              {analysisResult.behavioralQuestions && analysisResult.behavioralQuestions.length > 0 && (
                <div className="cyber-panel cyber-panel-hover" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 900, color: '#fff', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Resume-Tailored Behavioral Mock Questions
                    </h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                      Answer these custom behavioral questions compiled from your projects. Click 'Analyze Answer' to get instant feedback on your STAR method alignment.
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {analysisResult.behavioralQuestions.map((question: string, idx: number) => {
                      const feedback = behavioralFeedback[idx];
                      const answer = behavioralAnswers[idx] || '';

                      return (
                        <div key={idx} style={{ padding: '1rem', background: '#09090b', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.03)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          <span style={{ fontSize: '9px', fontWeight: 900, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Question #{idx + 1}</span>
                          <p style={{ fontSize: '0.825rem', color: '#fff', fontWeight: 700, margin: 0 }} dangerouslySetInnerHTML={{ __html: question.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                          
                          <textarea
                            rows={3}
                            placeholder="Type your response here using the Situation, Task, Action, and Result (STAR) framework..."
                            value={answer}
                            onChange={(e) => setBehavioralAnswers(prev => ({ ...prev, [idx]: e.target.value }))}
                            style={{
                              background: '#121214',
                              color: '#fff',
                              border: '1px solid rgba(255,255,255,0.05)',
                              borderRadius: '8px',
                              padding: '0.75rem',
                              fontSize: '0.8rem',
                              outline: 'none',
                              fontFamily: 'inherit',
                              resize: 'vertical',
                              lineHeight: 1.45
                            }}
                          />

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <button
                              onClick={() => evaluateBehavioral(idx)}
                              disabled={!answer.trim()}
                              className="btn btn-secondary"
                              style={{ padding: '4px 12px', fontSize: '0.75rem' }}
                            >
                              Analyze Answer
                            </button>

                            {feedback && (
                              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: feedback.score >= 70 ? '#10b981' : '#f59e0b' }}>
                                STAR Score: {feedback.score}/100
                              </span>
                            )}
                          </div>

                          {feedback && (
                            <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '6px', fontSize: '0.75rem' }}>
                              <span style={{ fontWeight: 800, display: 'block', marginBottom: '4px', color: 'var(--text-muted)' }}>Feedback & Tips:</span>
                              <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#cbd5e1' }}>
                                {feedback.tips.map((tip, tIdx) => (
                                  <li key={tIdx} style={{ marginBottom: '2px' }}>{tip}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      )}

      {/* SECTION 2: FLASHCARDS */}
      {activeTab === 'spaced' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="cyber-panel cyber-panel-hover" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#fff', margin: '0 0 4px' }}>Active Recall Decks</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Review flashcards for core DSA patterns. Rating the cards will cycle them into spaced repetition buckets.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {cards.slice(0, 3).map((card) => {
              const isFlipped = flippedCardId === card.id;
              const mastered = masteredCounts[card.id] || 0;

              return (
                <div key={card.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div 
                    className={`flashcard-box ${isFlipped ? 'flipped' : ''}`}
                    onClick={() => handleFlip(card.id)}
                    style={{ height: '220px' }}
                  >
                    <div className="flashcard-inner" style={{ height: '100%' }}>
                      
                      {/* Front Panel */}
                      <div className="flashcard-front">
                        <span style={{ fontSize: '8px', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', display: 'block' }}>
                          {card.category}
                        </span>
                        <p style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 700, margin: 0 }}>
                          {card.question}
                        </p>
                        <span style={{ fontSize: '8px', color: 'var(--text-muted)', position: 'absolute', bottom: '12px' }}>
                          CLICK TO FLIP
                        </span>
                      </div>

                      {/* Back Panel */}
                      <div className="flashcard-back">
                        <p style={{ fontSize: '0.8rem', color: '#d1d5db', margin: 0, textAlign: 'left', whiteSpace: 'pre-wrap', lineHeight: 1.45 }}>
                          {card.answer}
                        </p>
                        <span style={{ fontSize: '8px', color: 'var(--text-muted)', position: 'absolute', bottom: '12px' }}>
                          CLICK TO FLIP
                        </span>
                      </div>

                    </div>
                  </div>

                  {/* Spaced Recall Options (Only visible when flipped) */}
                  {isFlipped && (
                    <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.25rem' }}>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleRecallRating(card.id, 'hard'); }}
                        style={{ flex: 1, padding: '6px', fontSize: '9px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', borderRadius: '6px', cursor: 'pointer', fontWeight: 800 }}
                      >
                        Hard (Repeat)
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleRecallRating(card.id, 'familiar'); }}
                        style={{ flex: 1, padding: '6px', fontSize: '9px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', color: '#f59e0b', borderRadius: '6px', cursor: 'pointer', fontWeight: 800 }}
                      >
                        Familiar (3d)
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleRecallRating(card.id, 'mastered'); }}
                        style={{ flex: 1, padding: '6px', fontSize: '9px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#10b981', borderRadius: '6px', cursor: 'pointer', fontWeight: 800 }}
                      >
                        Mastered (7d)
                      </button>
                    </div>
                  )}

                  {/* Mastery stats */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', padding: '0 4px' }}>
                    <span>Rating intervals holding</span>
                    <span>Mastered count: {mastered}</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* SECTION 3: AI PAIR PROGRAMMING BUDDY */}
      {activeTab === 'pair' && (
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.5rem', height: '550px' }}>
          
          {/* Companions Sidebar Selector */}
          <div className="cyber-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 900, color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>AI Coding Companions</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {COMPANIONS.map((comp) => {
                const isActive = selectedCompanion.id === comp.id;
                return (
                  <div
                    key={comp.id}
                    onClick={() => handleSelectCompanion(comp)}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: '10px',
                      background: isActive ? 'rgba(99, 102, 241, 0.05)' : '#09090b',
                      border: '1px solid ' + (isActive ? 'var(--primary)' : 'rgba(255,255,255,0.03)'),
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}
                  >
                    <div style={{ fontSize: '1.5rem' }}>{comp.avatar}</div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.825rem', fontWeight: 800, color: isActive ? '#fff' : 'var(--text-muted)' }}>{comp.name}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{comp.personality.split('.')[0]}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '0.85rem' }}>
              <span style={{ fontSize: '9px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Target Topic code</span>
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                {['Arrays & Hashing', 'Roadmap'].map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setSelectedTopic(t as 'Arrays & Hashing' | 'Roadmap');
                      // Refresh logs
                      setChatLog([
                        { sender: 'companion', content: selectedCompanion.greeting },
                        { sender: 'companion', content: `Here is my current code for the **${t}** challenges:\n\n\`\`\`javascript\n${selectedCompanion.codeSnippets[t as 'Arrays & Hashing' | 'Roadmap']}\n\`\`\`` }
                      ]);
                    }}
                    style={{
                      flex: 1,
                      padding: '4px 8px',
                      fontSize: '9px',
                      borderRadius: '4px',
                      border: '1px solid ' + (selectedTopic === t ? 'var(--primary)' : 'rgba(255,255,255,0.05)'),
                      background: selectedTopic === t ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                      color: '#fff',
                      cursor: 'pointer'
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Live sandbox chat console */}
          <div className="cyber-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%', boxSizing: 'border-box' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.25rem' }}>{selectedCompanion.avatar}</span>
                <div>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff', margin: 0 }}>{selectedCompanion.name}</h3>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Status: Co-coding active</span>
                </div>
              </div>
            </div>

            {/* Chat list */}
            <div className="drawer-scroller" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem', paddingRight: '0.25rem' }}>
              {chatLog.map((msg, idx) => (
                <div
                  key={idx}
                  className={`companion-bubble ${msg.sender === 'user' ? 'companion-bubble-user' : 'companion-bubble-agent'}`}
                >
                  <span style={{ fontSize: '9px', fontWeight: 800, color: msg.sender === 'user' ? '#c084fc' : 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    {msg.sender === 'user' ? 'You' : selectedCompanion.name}
                  </span>
                  
                  {/* Text or custom formatted codes */}
                  {msg.content.includes('```javascript') ? (
                    <div>
                      <p style={{ margin: '0 0 0.5rem' }}>{msg.content.split('```javascript')[0]}</p>
                      <pre style={{ background: '#09090b', border: '1px solid rgba(255,255,255,0.04)', padding: '0.75rem', borderRadius: '6px', overflowX: 'auto', fontFamily: 'monospace', color: '#38bdf8', fontSize: '0.75rem' }}>
                        <code>{msg.content.split('```javascript')[1].replace(/```/g, '')}</code>
                      </pre>
                    </div>
                  ) : (
                    <p style={{ margin: 0, color: '#e5e7eb' }}>{msg.content}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendPairMsg} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder={`Ask ${selectedCompanion.name.split(' ')[0]} a question about coding logic...`}
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                style={{
                  flex: 1,
                  background: '#09090b',
                  border: '1px solid rgba(255,255,255,0.04)',
                  borderRadius: '8px',
                  padding: '0.65rem 0.85rem',
                  color: '#fff',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1.25rem', fontSize: '0.8rem', borderRadius: '8px' }}>
                Chat
              </button>
            </form>

          </div>

        </div>
      )}

    </div>
  );
}
