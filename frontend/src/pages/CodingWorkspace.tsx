import { useEffect, useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import confetti from 'canvas-confetti';
import { ArrowLeft, Terminal, Play, CheckCircle2, ChevronUp, ChevronDown, Check, X, ShieldAlert, Cpu } from 'lucide-react';

interface TestCase {
  id: number;
  input: string;
  expectedOutput: string;
}

interface ProblemDetail {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  videoUrl?: string;
  timeLimitMs: number;
  memoryLimitMb: number;
  boilerplates: Record<string, string>;
  testCases: TestCase[];
}

interface CodingWorkspaceProps {
  problemId: string;
  onBack: () => void;
  currentUser: { name: string, email: string, role: string } | null;
}

const parseVideoUrls = (urlStr?: string): string[] => {
  if (!urlStr) return [];
  try {
    const parsed = JSON.parse(urlStr);
    if (Array.isArray(parsed)) {
      return parsed.filter(Boolean);
    }
  } catch (e) {}
  if (urlStr.includes(',')) {
    return urlStr.split(',').map(s => s.trim()).filter(Boolean);
  }
  return [urlStr.trim()].filter(Boolean);
};

export default function CodingWorkspace({ problemId, onBack, currentUser }: CodingWorkspaceProps) {
  const [problem, setProblem] = useState<ProblemDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('javascript');
  const [editorCode, setEditorCode] = useState('');
  
  // Keep track of code written in other languages so switching languages doesn't wipe progress
  const codeCache = useRef<Record<string, string>>({});
  
  // UI Tabs & Console states
  const [leftTab, setLeftTab] = useState<'desc' | 'submissions' | 'video'>('desc');
  const [consoleOpen, setConsoleOpen] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [execResult, setExecResult] = useState<any>(null);
  const [submissionsList, setSubmissionsList] = useState<any[]>([]);
  const [adminVideoUrls, setAdminVideoUrls] = useState<string[]>([]);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [savingVideo, setSavingVideo] = useState(false);

  const getYouTubeId = (url?: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleSaveVideoUrl = () => {
    if (!problem || !currentUser) return;
    setSavingVideo(true);
    const filteredUrls = adminVideoUrls.map(u => u.trim()).filter(Boolean);
    fetch(`http://localhost:5015/api/admin/problems/${problemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Email': currentUser.email
      },
      body: JSON.stringify({
        id: problem.id,
        title: problem.title,
        difficulty: problem.difficulty,
        category: problem.category,
        description: problem.description,
        videoUrl: JSON.stringify(filteredUrls),
        timeLimitMs: problem.timeLimitMs,
        memoryLimitMb: problem.memoryLimitMb,
        csharpBoilerplate: problem.boilerplates.csharp || '',
        javaBoilerplate: problem.boilerplates.java || '',
        pythonBoilerplate: problem.boilerplates.python || '',
        cppBoilerplate: problem.boilerplates.cpp || '',
        cBoilerplate: problem.boilerplates.c || '',
        jsBoilerplate: problem.boilerplates.javascript || ''
      })
    })
      .then(res => {
        if (!res.ok) throw new Error('Save failed');
        return res.json();
      })
      .then(data => {
        setProblem({
          ...problem,
          videoUrl: data.videoUrl
        });
        setAdminVideoUrls(parseVideoUrls(data.videoUrl));
        setSavingVideo(false);
      })
      .catch(err => {
        console.error(err);
        setSavingVideo(false);
      });
  };

  useEffect(() => {
    // Fetch problem details
    fetch(`http://localhost:5015/api/problems/${problemId}`)
      .then(res => res.json())
      .then(data => {
        setProblem(data);
        setAdminVideoUrls(parseVideoUrls(data.videoUrl));
        
        // Initialize boilerplates
        const boilerplates = data.boilerplates || {};
        codeCache.current = { ...boilerplates };
        
        // Select starting language
        const defaultLang = 'javascript';
        setLanguage(defaultLang);
        setEditorCode(boilerplates[defaultLang] || '');
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching problem details:', err);
        setLoading(false);
      });

    fetchSubmissions();
  }, [problemId]);

  const fetchSubmissions = () => {
    const headers: Record<string, string> = {};
    if (currentUser) {
      headers['X-User-Email'] = currentUser.email;
    }
    fetch(`http://localhost:5015/api/problems/submissions?problemId=${problemId}`, { headers })
      .then(res => res.json())
      .then(data => {
        setSubmissionsList(data);
      })
      .catch(err => console.error('Error fetching submissions:', err));
  };

  const handleLanguageChange = (newLang: string) => {
    // Cache current code
    codeCache.current[language] = editorCode;
    // Set new language
    setLanguage(newLang);
    // Load cached code or fallback
    setEditorCode(codeCache.current[newLang] || problem?.boilerplates[newLang] || '');
  };

  const handleRunCode = () => {
    if (!problem) return;
    setExecuting(true);
    setConsoleOpen(true);
    setExecResult(null);

    fetch(`http://localhost:5015/api/problems/${problemId}/run`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-User-Email': currentUser?.email || ''
      },
      body: JSON.stringify({ code: editorCode, language })
    })
      .then(res => res.json())
      .then(data => {
        setExecResult({ ...data, type: 'run' });
        setExecuting(false);
      })
      .catch(err => {
        console.error(err);
        setExecResult({ status: 'Runtime Error', compilerMessage: 'Network error communicating with compiler engine.' });
        setExecuting(false);
      });
  };

  const handleSubmitCode = () => {
    if (!problem) return;
    setExecuting(true);
    setConsoleOpen(true);
    setExecResult(null);

    fetch(`http://localhost:5015/api/problems/${problemId}/submit`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-User-Email': currentUser?.email || ''
      },
      body: JSON.stringify({ code: editorCode, language })
    })
      .then(res => res.json())
      .then(data => {
        setExecResult({ ...data, type: 'submit' });
        setExecuting(false);
        fetchSubmissions();

        if (data.status === 'Accepted') {
          // Play confetti!
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      })
      .catch(err => {
        console.error(err);
        setExecResult({ status: 'Runtime Error', compilerMessage: 'Network error submitting solution.' });
        setExecuting(false);
      });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>Problem not found.</h2>
        <button className="btn btn-secondary" onClick={onBack} style={{ marginTop: '1rem' }}><ArrowLeft size={16} /> Back to Arena</button>
      </div>
    );
  }

  const monacoLanguageMap: Record<string, string> = {
    csharp: 'csharp',
    java: 'java',
    python: 'python',
    cpp: 'cpp',
    c: 'c',
    javascript: 'javascript'
  };

  const attempts = submissionsList.length;
  const isSolved = submissionsList.some(sub => sub.status === 'Accepted');
  const isVideoUnlocked = isSolved || attempts >= 2;

  return (
    <div className="animate-fade-in workspace-container">
      
      {/* Left panel: Description & Submissions */}
      <div className="workspace-left glass-panel" style={{ padding: '0', background: '#18181b', border: '1px solid var(--border-color)' }}>
        <div className="tab-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '1rem', background: '#18181b' }}>
          <div style={{ display: 'flex' }}>
            <div 
              className={`tab ${leftTab === 'desc' ? 'active' : ''}`}
              onClick={() => setLeftTab('desc')}
            >
              Description
            </div>
            <div 
              className={`tab ${leftTab === 'submissions' ? 'active' : ''}`}
              onClick={() => setLeftTab('submissions')}
            >
              Submissions ({submissionsList.length})
            </div>
            <div 
              className={`tab ${leftTab === 'video' ? 'active' : ''}`}
              onClick={() => setLeftTab('video')}
            >
              Video Walkthrough {!isVideoUnlocked && '🔒'}
            </div>
          </div>
          <button className="btn btn-secondary" style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem', height: '28px' }} onClick={onBack}>
            <ArrowLeft size={12} /> Back
          </button>
        </div>

        <div className="tab-content" style={{ background: '#18181b', border: 'none' }}>
          {leftTab === 'desc' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>{problem.title}</h2>
                <span className={`difficulty-badge difficulty-${problem.difficulty.toLowerCase()}`}>
                  {problem.difficulty}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: '#09090b', padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                  {problem.category}
                </span>
              </div>

              {/* Markdown Render Wrapper */}
              <div 
                style={{ lineHeight: '1.6', fontSize: '0.9rem', color: 'var(--text-muted)', whiteSpace: 'pre-line' }}
                dangerouslySetInnerHTML={{ __html: problem.description }}
              />

              {/* Sample test cases preview */}
              <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, borderBottom: '1px solid var(--border-color)', paddingBottom: '0.35rem', color: '#fff', margin: 0 }}>Sample Test Cases</h3>
                {problem.testCases.map((tc, idx) => (
                  <div key={tc.id} style={{ background: '#09090b', padding: '0.85rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Example {idx + 1}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr', gap: '0.35rem', fontSize: '0.8rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Input:</span>
                      <pre style={{ fontFamily: 'var(--font-mono)', background: 'rgba(255,255,255,0.01)', padding: '0.2rem', borderRadius: '4px', whiteSpace: 'pre-wrap', color: '#fff' }}>{tc.input}</pre>
                      <span style={{ color: 'var(--text-muted)' }}>Expected:</span>
                      <pre style={{ fontFamily: 'var(--font-mono)', background: 'rgba(255,255,255,0.01)', padding: '0.2rem', borderRadius: '4px', whiteSpace: 'pre-wrap', color: '#fff' }}>{tc.expectedOutput}</pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {leftTab === 'submissions' && (
            // Submissions List
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem', color: '#fff' }}>Submission History</h3>
              {submissionsList.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem', fontSize: '0.85rem' }}>No submissions yet for this problem.</div>
              ) : (
                submissionsList.map((sub) => (
                  <div key={sub.id} style={{
                    padding: '0.85rem',
                    background: '#09090b',
                    borderRadius: '0.5rem',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        {sub.status === 'Accepted' ? (
                          <CheckCircle2 size={14} style={{ color: 'var(--success)' }} />
                        ) : (
                          <X size={14} style={{ color: 'var(--danger)' }} />
                        )}
                        <span style={{ fontWeight: 600, fontSize: '0.85rem', color: sub.status === 'Accepted' ? 'var(--success)' : 'var(--danger)' }}>{sub.status}</span>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {new Date(sub.submittedAt).toLocaleString()}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Language: <span style={{ color: '#fff', fontWeight: 500 }}>{sub.language.toUpperCase()}</span> • Run Time: <span style={{ color: '#fff', fontWeight: 500 }}>{sub.executionTimeMs} ms</span>
                    </div>
                    {sub.compilerMessage && (
                      <pre style={{
                        background: 'rgba(239, 68, 68, 0.03)',
                        border: '1px solid rgba(239, 68, 68, 0.15)',
                        padding: '0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontFamily: 'var(--font-mono)',
                        color: '#fca5a5',
                        overflowX: 'auto',
                        whiteSpace: 'pre-wrap'
                      }}>
                        {sub.compilerMessage}
                      </pre>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {leftTab === 'video' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
              {!isVideoUnlocked ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '3rem 1.5rem',
                  textAlign: 'center',
                  background: '#09090b',
                  borderRadius: '0.5rem',
                  border: '1px solid var(--border-color)',
                  gap: '0.85rem'
                }}>
                  <div style={{
                    fontSize: '1.5rem',
                    background: '#27272a',
                    border: '1px solid var(--border-color)',
                    padding: '0.85rem',
                    borderRadius: '50%',
                    width: '48px',
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    🔒
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1rem', color: '#fff' }}>Video solution locked</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '280px', lineHeight: '1.5', margin: 0 }}>
                    Try solving the problem first! Submit at least 2 attempts to unlock the solution explanation.
                  </p>
                  <div style={{
                    fontSize: '0.8rem',
                    background: '#18181b',
                    padding: '0.4rem 1rem',
                    borderRadius: '2rem',
                    border: '1px solid var(--border-color)',
                    fontWeight: 600,
                    color: '#fff'
                  }}>
                    Attempts: {attempts} / 2
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#fff' }}>Video Solution Walkthrough</h3>
                    {isSolved && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.2rem', fontWeight: 600 }}>
                        <CheckCircle2 size={12} /> Unlocked (Solved)
                      </span>
                    )}
                  </div>

                  {(() => {
                    const videoUrls = parseVideoUrls(problem.videoUrl);
                    const currentUrl = videoUrls[activeVideoIndex] || videoUrls[0] || '';
                    const ytId = getYouTubeId(currentUrl);
                    
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
                        {videoUrls.length > 1 && (
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', background: 'rgba(255,255,255,0.02)', padding: '0.25rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)' }}>
                            {videoUrls.map((_, idx) => (
                              <button
                                key={idx}
                                className={`btn ${activeVideoIndex === idx ? 'btn-primary' : 'btn-secondary'}`}
                                style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', border: 'none' }}
                                onClick={() => setActiveVideoIndex(idx)}
                              >
                                Video Solution #{idx + 1}
                              </button>
                            ))}
                          </div>
                        )}
                        
                        {currentUrl && ytId ? (
                          <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', height: 0, borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                            <iframe
                              src={`https://www.youtube.com/embed/${ytId}`}
                              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              title="YouTube video player"
                            />
                          </div>
                        ) : (
                          <div style={{ padding: '2rem', textAlign: 'center', background: '#09090b', borderRadius: '0.5rem', border: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                            No video walkthrough URL has been assigned to this challenge yet.
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {currentUser?.role === 'Admin' && (
                    <div className="glass-panel" style={{ marginTop: '1.5rem', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#09090b' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#fff' }}>
                          ⚙️ System Admin Controls: Manage Video Solutions
                        </span>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}
                          onClick={() => setAdminVideoUrls([...adminVideoUrls, ''])}
                        >
                          + Add Link
                        </button>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {(adminVideoUrls.length > 0 ? adminVideoUrls : ['']).map((url, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <input
                              type="url"
                              placeholder="YouTube URL (e.g. https://www.youtube.com/watch?v=...)"
                              value={url}
                              onChange={(e) => {
                                const newUrls = [...adminVideoUrls];
                                if (newUrls.length === 0) newUrls.push(e.target.value);
                                else newUrls[idx] = e.target.value;
                                setAdminVideoUrls(newUrls);
                              }}
                              style={{
                                flex: 1,
                                background: '#18181b',
                                border: '1px solid var(--border-color)',
                                borderRadius: '0.375rem',
                                padding: '0.45rem',
                                color: '#fff',
                                fontSize: '0.8rem',
                                outline: 'none'
                              }}
                            />
                            <button
                              type="button"
                              className="btn btn-secondary"
                              style={{ padding: '0.45rem', color: 'var(--danger)', border: 'none' }}
                              onClick={() => {
                                const newUrls = [...adminVideoUrls];
                                newUrls.splice(idx, 1);
                                setAdminVideoUrls(newUrls.length > 0 ? newUrls : ['']);
                              }}
                              disabled={adminVideoUrls.length <= 1 && url === ''}
                            >
                              Remove
                            </button>
                          </div>
                        ))}

                        <button
                          className="btn btn-primary"
                          style={{ padding: '0.45rem 1rem', fontSize: '0.8rem', marginTop: '0.5rem', alignSelf: 'flex-end' }}
                          onClick={handleSaveVideoUrl}
                          disabled={savingVideo}
                        >
                          {savingVideo ? 'Saving...' : 'Save All Video Links'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right panel: Editor & Console */}
      <div className="workspace-right">
        
        {/* Editor Settings Panel */}
        <div className="glass-panel" style={{ padding: '0.5rem 1.25rem', background: '#18181b', borderRadius: '0.75rem 0.75rem 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Cpu size={14} style={{ color: 'var(--primary)' }} />
            <span style={{ fontWeight: 500, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Language:</span>
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              style={{
                background: '#09090b',
                color: '#fff',
                border: '1px solid var(--border-color)',
                padding: '0.3rem 0.5rem',
                borderRadius: '0.375rem',
                fontSize: '0.8rem',
                outline: 'none',
                fontWeight: 600
              }}
            >
              <option value="javascript">JavaScript (Node.js)</option>
              <option value="csharp">C# (.NET 10)</option>
              <option value="python">Python 3</option>
              <option value="java">Java (JDK 21)</option>
              <option value="cpp">C++ (g++)</option>
              <option value="c">C (gcc)</option>
            </select>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-secondary" style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }} onClick={handleRunCode} disabled={executing}>
              <Play size={10} style={{ fill: 'currentColor' }} /> Run Code
            </button>
            <button className="btn btn-primary" style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }} onClick={handleSubmitCode} disabled={executing}>
              <Check size={10} /> Submit
            </button>
          </div>
        </div>

        {/* Monaco Editor Wrapper */}
        <div style={{ flex: 1, minHeight: 0, border: '1px solid var(--border-color)', borderTop: 'none', background: '#1e1e1e' }}>
          <Editor
            height="100%"
            language={monacoLanguageMap[language]}
            theme="vs-dark"
            value={editorCode}
            onChange={(val) => setEditorCode(val ?? '')}
            options={{
              fontSize: 13,
              fontFamily: 'var(--font-mono)',
              minimap: { enabled: false },
              automaticLayout: true,
              scrollBeyondLastLine: false,
              cursorBlinking: 'smooth',
              cursorSmoothCaretAnimation: 'on',
              padding: { top: 10, bottom: 10 }
            }}
          />
        </div>

        {/* Console drawer */}
        <div className="console-drawer" style={{ height: consoleOpen ? '220px' : '40px' }}>
          <div className="console-header" onClick={() => setConsoleOpen(!consoleOpen)} style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600 }}>
              <Terminal size={12} style={{ color: 'var(--primary)' }} />
              Console
            </div>
            {consoleOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </div>

          {consoleOpen && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', background: '#09090b', color: '#e5e7eb' }}>
              {executing ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
                  <div style={{ width: '10px', height: '10px', border: '2px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                  <span>Running code compiler on server sandbox...</span>
                </div>
              ) : execResult ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {/* Status row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {execResult.status === 'Accepted' ? (
                      <CheckCircle2 size={14} style={{ color: 'var(--success)' }} />
                    ) : (
                      <ShieldAlert size={14} style={{ color: 'var(--danger)' }} />
                    )}
                    <span style={{ fontWeight: 700, color: execResult.status === 'Accepted' ? 'var(--success)' : 'var(--danger)', fontSize: '0.9rem' }}>
                      {execResult.status} {execResult.type === 'submit' ? '(All Tests)' : '(Sample Run)'}
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                      in {execResult.executionTimeMs} ms
                    </span>
                  </div>

                  {/* Errors / Warnings */}
                  {execResult.compilerMessage && (
                    <div style={{ background: 'rgba(239,68,68,0.03)', padding: '0.6rem', borderLeft: '2px solid var(--danger)', borderRadius: '4px', border: '1px solid rgba(239,68,68,0.15)', borderLeftWidth: '3px' }}>
                      <div style={{ color: 'var(--danger)', fontWeight: 600, marginBottom: '0.2rem' }}>Diagnostics:</div>
                      <pre style={{ whiteSpace: 'pre-wrap', color: '#fca5a5' }}>{execResult.compilerMessage}</pre>
                    </div>
                  )}

                  {/* Output details for incorrect runs */}
                  {execResult.status !== 'Accepted' && execResult.failedTestCaseIndex !== undefined && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <div style={{ color: 'var(--warning)', fontWeight: 600 }}>Failed on Test Case #{execResult.failedTestCaseIndex + 1}</div>
                      
                      {execResult.actualOutput && (
                        <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '0.35rem' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Your Output:</span>
                          <span style={{ color: '#fff', background: 'rgba(239,68,68,0.1)', padding: '0.1rem 0.3rem', borderRadius: '3px', border: '1px solid rgba(239,68,68,0.15)', display: 'inline-block', justifySelf: 'start' }}>{execResult.actualOutput}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Success */}
                  {execResult.status === 'Accepted' && (
                    <div style={{ color: 'var(--success)', fontWeight: 500 }}>
                      🎉 Excellent job! All test assertions completed successfully.
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ color: 'var(--text-muted)' }}>
                  Output console. Compile or Run code to view standard output details.
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
