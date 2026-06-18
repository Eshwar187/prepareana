import { useState, useEffect } from 'react';
import { 
  Shield, UserPlus, Search, Edit3, Trash2, Plus, 
  Save, X, Check, Video, BookOpen, AlertCircle 
} from 'lucide-react';

interface User {
  email: string;
  name: string;
  role: string;
}

interface TestCase {
  id?: number;
  input: string;
  expectedOutput: string;
  isSample: boolean;
}

interface Problem {
  id: string;
  title: string;
  difficulty: string;
  category: string;
  description: string;
  videoUrl?: string;
  timeLimitMs: number;
  memoryLimitMb: number;
  csharpBoilerplate: string;
  javaBoilerplate: string;
  pythonBoilerplate: string;
  cppBoilerplate: string;
  cBoilerplate: string;
  jsBoilerplate: string;
  csharpDriver: string;
  javaDriver: string;
  pythonDriver: string;
  cppDriver: string;
  cDriver: string;
  jsDriver: string;
  testCases?: TestCase[];
}

interface AdminPanelProps {
  currentUserEmail: string;
}

const parseVideoUrls = (urlStr?: string): string[] => {
  if (!urlStr) return [''];
  try {
    const parsed = JSON.parse(urlStr);
    if (Array.isArray(parsed)) {
      return parsed.length > 0 ? parsed : [''];
    }
  } catch (e) {}
  if (urlStr.includes(',')) {
    const split = urlStr.split(',').map(s => s.trim()).filter(Boolean);
    return split.length > 0 ? split : [''];
  }
  return [urlStr.trim()].filter(Boolean).length > 0 ? [urlStr.trim()] : [''];
};

export default function AdminPanel({ currentUserEmail }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'members' | 'problems'>('members');
  
  // Users state
  const [users, setUsers] = useState<User[]>([]);
  const [usersSearch, setUsersSearch] = useState('');
  const [promoteStatus, setPromoteStatus] = useState<string | null>(null);
  
  // Problems state
  const [problems, setProblems] = useState<any[]>([]);
  const [problemsSearch, setProblemsSearch] = useState('');
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);
  const [editingVideoUrls, setEditingVideoUrls] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Load initial data
  useEffect(() => {
    fetchUsers();
    fetchProblems();
  }, []);

  const fetchUsers = () => {
    fetch('http://localhost:5015/api/admin/users', {
      headers: { 'X-User-Email': currentUserEmail }
    })
      .then(res => {
        if (!res.ok) throw new Error('Forbidden');
        return res.json();
      })
      .then(data => setUsers(data))
      .catch(err => console.error('Error fetching users:', err));
  };

  const fetchProblems = () => {
    fetch('http://localhost:5015/api/problems')
      .then(res => res.json())
      .then(data => setProblems(data))
      .catch(err => console.error('Error fetching problems:', err));
  };

  const handlePromote = (email: string) => {
    setPromoteStatus(email);
    fetch(`http://localhost:5015/api/admin/users/${email}/promote`, {
      method: 'POST',
      headers: { 'X-User-Email': currentUserEmail }
    })
      .then(res => res.json())
      .then(() => {
        setPromoteStatus(null);
        fetchUsers();
      })
      .catch(err => {
        console.error(err);
        setPromoteStatus(null);
      });
  };

  const handleDeleteProblem = (id: string) => {
    if (!window.confirm(`Are you sure you want to delete problem '${id}'?`)) return;

    fetch(`http://localhost:5015/api/admin/problems/${id}`, {
      method: 'DELETE',
      headers: { 'X-User-Email': currentUserEmail }
    })
      .then(res => {
        if (!res.ok) throw new Error('Delete failed');
        setStatusMessage({ type: 'success', text: `Problem '${id}' deleted successfully.` });
        fetchProblems();
        setTimeout(() => setStatusMessage(null), 3000);
      })
      .catch(err => {
        console.error(err);
        setStatusMessage({ type: 'error', text: `Failed to delete problem.` });
        setTimeout(() => setStatusMessage(null), 3000);
      });
  };

  const handleEditClick = (problemSummary: any) => {
    // Fetch complete problem details
    fetch(`http://localhost:5015/api/admin/problems/${problemSummary.id}`, {
      headers: { 'X-User-Email': currentUserEmail }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch problem details');
        return res.json();
      })
      .then(data => {
        // Map boilerplate and test cases
        const mapped: Problem = {
          id: data.id,
          title: data.title,
          difficulty: data.difficulty,
          category: data.category,
          description: data.description,
          videoUrl: data.videoUrl || '',
          timeLimitMs: data.timeLimitMs || 2000,
          memoryLimitMb: data.memoryLimitMb || 256,
          csharpBoilerplate: data.csharpBoilerplate || '',
          javaBoilerplate: data.javaBoilerplate || '',
          pythonBoilerplate: data.pythonBoilerplate || '',
          cppBoilerplate: data.cppBoilerplate || '',
          cBoilerplate: data.cBoilerplate || '',
          jsBoilerplate: data.jsBoilerplate || '',
          csharpDriver: data.csharpDriver || '',
          javaDriver: data.javaDriver || '',
          pythonDriver: data.pythonDriver || '',
          cppDriver: data.cppDriver || '',
          cDriver: data.cDriver || '',
          jsDriver: data.jsDriver || '',
          testCases: data.testCases || []
        };
        
        setEditingProblem(mapped);
        setEditingVideoUrls(parseVideoUrls(mapped.videoUrl));
        setIsCreating(false);
      })
      .catch(err => {
        console.error(err);
        setStatusMessage({ type: 'error', text: 'Failed to load complete problem details.' });
        setTimeout(() => setStatusMessage(null), 3000);
      });
  };

  const handleNewProblemClick = () => {
    setEditingProblem({
      id: '',
      title: '',
      difficulty: 'Easy',
      category: 'Arrays & Hashing',
      description: '',
      videoUrl: '',
      timeLimitMs: 2000,
      memoryLimitMb: 256,
      csharpBoilerplate: '',
      javaBoilerplate: '',
      pythonBoilerplate: '',
      cppBoilerplate: '',
      cBoilerplate: '',
      jsBoilerplate: '',
      csharpDriver: '// C# Driver wrapper...',
      javaDriver: '// Java Driver wrapper...',
      pythonDriver: '# Python Driver wrapper...',
      cppDriver: '// C++ Driver wrapper...',
      cDriver: '// C Driver wrapper...',
      jsDriver: '// JS Driver wrapper...',
      testCases: [
        { input: '', expectedOutput: '', isSample: true }
      ]
    });
    setEditingVideoUrls(['']);
    setIsCreating(true);
  };

  const handleSaveProblem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProblem) return;

    const filteredUrls = editingVideoUrls.map(u => u.trim()).filter(Boolean);
    const savePayload = {
      ...editingProblem,
      videoUrl: JSON.stringify(filteredUrls)
    };

    const url = isCreating 
      ? 'http://localhost:5015/api/admin/problems' 
      : `http://localhost:5015/api/admin/problems/${editingProblem.id}`;

    const method = isCreating ? 'POST' : 'PUT';

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-User-Email': currentUserEmail
      },
      body: JSON.stringify(savePayload)
    })
      .then(res => {
        if (!res.ok) throw new Error('Save failed');
        return res.json();
      })
      .then(() => {
        setStatusMessage({ type: 'success', text: `Problem '${editingProblem.title}' saved successfully.` });
        setEditingProblem(null);
        fetchProblems();
        setTimeout(() => setStatusMessage(null), 3000);
      })
      .catch(err => {
        console.error(err);
        setStatusMessage({ type: 'error', text: `Failed to save problem. Check that the ID is unique.` });
        setTimeout(() => setStatusMessage(null), 4000);
      });
  };

  // Filtered lists
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(usersSearch.toLowerCase()) || 
    u.email.toLowerCase().includes(usersSearch.toLowerCase())
  );

  const filteredProblems = problems.filter(p => 
    p.title.toLowerCase().includes(problemsSearch.toLowerCase()) || 
    p.category.toLowerCase().includes(problemsSearch.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
            <Shield style={{ color: 'var(--primary)' }} /> System Admin Panel
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Configure interview prep challenges, promote student access roles, and assign video solutions.</p>
        </div>
        
        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.25rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
          <button 
            className={`btn ${activeTab === 'members' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', border: 'none' }}
            onClick={() => setActiveTab('members')}
          >
            Manage Members
          </button>
          <button 
            className={`btn ${activeTab === 'problems' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', border: 'none' }}
            onClick={() => setActiveTab('problems')}
          >
            Manage Problems
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="glass-panel animate-fade-in" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem', 
          padding: '1rem', 
          borderColor: statusMessage.type === 'success' ? 'var(--success)' : 'var(--danger)',
          background: statusMessage.type === 'success' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)',
          color: statusMessage.type === 'success' ? 'var(--success)' : 'var(--danger)'
        }}>
          {statusMessage.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
          <span style={{ fontWeight: 600 }}>{statusMessage.text}</span>
        </div>
      )}

      {/* ================= TAB 1: MEMBERS MANAGEMENT ================= */}
      {activeTab === 'members' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', minWidth: '300px' }}>
              <Search size={16} style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search registered members..."
                value={usersSearch}
                onChange={(e) => setUsersSearch(e.target.value)}
                style={{ background: 'none', border: 'none', color: '#fff', outline: 'none', width: '100%', fontSize: '0.875rem' }}
              />
            </div>
            
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Total registered users: <span style={{ color: '#fff', fontWeight: 700 }}>{users.length}</span>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)' }}>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Member Name</th>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Email Address</th>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>System Access Role</th>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No members found matching search.</td>
                  </tr>
                ) : (
                  filteredUsers.map(u => (
                    <tr key={u.email} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>{u.name}</td>
                      <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{u.email}</td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <span className={`difficulty-badge ${u.role === 'Admin' ? 'difficulty-hard' : 'difficulty-easy'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                        {u.role === 'Student' ? (
                          <button 
                            className="btn btn-secondary" 
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                            onClick={() => handlePromote(u.email)}
                            disabled={promoteStatus === u.email}
                          >
                            <UserPlus size={12} /> {promoteStatus === u.email ? 'Promoting...' : 'Make Admin'}
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Authorized Admin</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 2: PROBLEMS MANAGEMENT ================= */}
      {activeTab === 'problems' && !editingProblem && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', minWidth: '300px' }}>
              <Search size={16} style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search problems by name or category..."
                value={problemsSearch}
                onChange={(e) => setProblemsSearch(e.target.value)}
                style={{ background: 'none', border: 'none', color: '#fff', outline: 'none', width: '100%', fontSize: '0.875rem' }}
              />
            </div>
            
            <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={handleNewProblemClick}>
              <Plus size={14} /> Create Problem
            </button>
          </div>

          <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)' }}>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Problem Title</th>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Category</th>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Difficulty</th>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Video URL</th>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProblems.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>{p.title}</td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{p.category}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span className={`difficulty-badge difficulty-${p.difficulty.toLowerCase()}`}>
                        {p.difficulty}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      {(() => {
                        const urls = parseVideoUrls(p.videoUrl);
                        if (urls.length > 0) {
                          return (
                            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                              {urls.map((url, idx) => (
                                <a 
                                  key={idx} 
                                  href={url} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  style={{ display: 'flex', alignItems: 'center', gap: '0.15rem', color: 'var(--primary)', textDecoration: 'none', fontSize: '0.75rem' }}
                                >
                                  <Video size={12} /> {urls.length > 1 ? `#${idx + 1}` : 'View'}
                                </a>
                              ))}
                            </div>
                          );
                        }
                        return <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>None Added</span>;
                      })()}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button className="btn btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }} onClick={() => handleEditClick(p)}>
                          <Edit3 size={12} /> Edit
                        </button>
                        <button className="btn btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', color: 'var(--danger)' }} onClick={() => handleDeleteProblem(p.id)}>
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ================= VIEW: EDIT / CREATE PROBLEM FORM ================= */}
      {editingProblem && (
        <form onSubmit={handleSaveProblem} className="glass-panel animate-fade-in" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>
              {isCreating ? 'Create Custom DSA Problem' : `Edit Problem: ${editingProblem.title}`}
            </h3>
            <button type="button" className="btn btn-secondary" onClick={() => setEditingProblem(null)}>
              <X size={16} /> Cancel
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            
            {/* Title & ID */}
            <div className="form-group">
              <span className="form-label">Problem Title</span>
              <input
                type="text"
                required
                className="form-input"
                value={editingProblem.title}
                onChange={(e) => setEditingProblem({ ...editingProblem, title: e.target.value })}
                placeholder="e.g. Reverse a String"
              />
            </div>

            <div className="form-group">
              <span className="form-label">Problem Slug ID (no spaces)</span>
              <input
                type="text"
                required
                disabled={!isCreating}
                className="form-input"
                value={editingProblem.id}
                onChange={(e) => setEditingProblem({ ...editingProblem, id: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                placeholder="e.g. reverse-a-string"
              />
            </div>

            {/* Category & Difficulty */}
            <div className="form-group">
              <span className="form-label">Category</span>
              <input
                type="text"
                required
                className="form-input"
                value={editingProblem.category}
                onChange={(e) => setEditingProblem({ ...editingProblem, category: e.target.value })}
                placeholder="e.g. Strings"
              />
            </div>

            <div className="form-group">
              <span className="form-label">Difficulty</span>
              <select
                value={editingProblem.difficulty}
                onChange={(e) => setEditingProblem({ ...editingProblem, difficulty: e.target.value })}
                style={{
                  background: 'var(--bg-workspace)',
                  color: '#fff',
                  border: '1px solid var(--border-color)',
                  padding: '0.85rem 1.25rem',
                  borderRadius: '0.75rem',
                  outline: 'none'
                }}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            {/* Time & Memory Limit */}
            <div className="form-group">
              <span className="form-label">Time Limit (milliseconds)</span>
              <input
                type="number"
                required
                className="form-input"
                value={editingProblem.timeLimitMs}
                onChange={(e) => setEditingProblem({ ...editingProblem, timeLimitMs: parseInt(e.target.value) || 2000 })}
              />
            </div>

            <div className="form-group">
              <span className="form-label">Memory Limit (MB)</span>
              <input
                type="number"
                required
                className="form-input"
                value={editingProblem.memoryLimitMb}
                onChange={(e) => setEditingProblem({ ...editingProblem, memoryLimitMb: parseInt(e.target.value) || 256 })}
              />
            </div>

            {/* YouTube Links (Multiple) */}
            <div className="form-group" style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', margin: 0 }}>
                  <Video size={14} style={{ color: 'var(--primary)' }} /> YouTube Walkthrough URLs (NeetCode / Video explanations)
                </span>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                  onClick={() => setEditingVideoUrls([...editingVideoUrls, ''])}
                >
                  <Plus size={12} /> Add Video URL
                </button>
              </div>
              
              {editingVideoUrls.map((url, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://www.youtube.com/watch?v=xxxxxxxx"
                    value={url}
                    onChange={(e) => {
                      const newUrls = [...editingVideoUrls];
                      newUrls[idx] = e.target.value;
                      setEditingVideoUrls(newUrls);
                    }}
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ padding: '0.55rem', color: 'var(--danger)', border: 'none' }}
                    onClick={() => {
                      const newUrls = [...editingVideoUrls];
                      newUrls.splice(idx, 1);
                      setEditingVideoUrls(newUrls.length > 0 ? newUrls : ['']);
                    }}
                    disabled={editingVideoUrls.length <= 1 && url === ''}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Description (Markdown) */}
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <span className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <BookOpen size={14} style={{ color: 'var(--primary)' }} /> Problem Description (Markdown supported)
              </span>
              <textarea
                required
                rows={8}
                className="form-input"
                style={{ resize: 'vertical', fontFamily: 'var(--font-mono)' }}
                value={editingProblem.description}
                onChange={(e) => setEditingProblem({ ...editingProblem, description: e.target.value })}
                placeholder="Describe the problem, input format, output format, examples, constraints..."
              />
            </div>
            
            {/* JS Boilerplate */}
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <span className="form-label">JavaScript Starter Boilerplate</span>
              <textarea
                rows={4}
                className="form-input"
                style={{ fontFamily: 'var(--font-mono)' }}
                value={editingProblem.jsBoilerplate}
                onChange={(e) => setEditingProblem({ ...editingProblem, jsBoilerplate: e.target.value })}
                placeholder="var functionName = function(...) { ... }"
              />
            </div>

            {/* C# Boilerplate */}
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <span className="form-label">C# Starter Boilerplate</span>
              <textarea
                rows={4}
                className="form-input"
                style={{ fontFamily: 'var(--font-mono)' }}
                value={editingProblem.csharpBoilerplate}
                onChange={(e) => setEditingProblem({ ...editingProblem, csharpBoilerplate: e.target.value })}
                placeholder="public class Solution { ... }"
              />
            </div>

          </div>

          {/* Test cases editor */}
          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              <h4 style={{ margin: 0 }}>Test Cases (Minimum 1 Required)</h4>
              <button 
                type="button" 
                className="btn btn-secondary" 
                style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                onClick={() => {
                  const cases = [...(editingProblem.testCases || [])];
                  cases.push({ input: '', expectedOutput: '', isSample: true });
                  setEditingProblem({ ...editingProblem, testCases: cases });
                }}
              >
                <Plus size={12} /> Add Test Case
              </button>
            </div>

            {(editingProblem.testCases || []).map((tc, index) => (
              <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px 50px', gap: '1rem', background: 'rgba(0,0,0,0.15)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', alignItems: 'center' }}>
                <div className="form-group">
                  <span className="form-label" style={{ fontSize: '0.75rem' }}>Standard Input / Args (Line Separated)</span>
                  <textarea
                    rows={2}
                    required
                    className="form-input"
                    style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}
                    value={tc.input}
                    onChange={(e) => {
                      const cases = [...(editingProblem.testCases || [])];
                      cases[index].input = e.target.value;
                      setEditingProblem({ ...editingProblem, testCases: cases });
                    }}
                    placeholder="e.g. [2,7,11,15]\n9"
                  />
                </div>
                
                <div className="form-group">
                  <span className="form-label" style={{ fontSize: '0.75rem' }}>Expected Output</span>
                  <textarea
                    rows={2}
                    required
                    className="form-input"
                    style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}
                    value={tc.expectedOutput}
                    onChange={(e) => {
                      const cases = [...(editingProblem.testCases || [])];
                      cases[index].expectedOutput = e.target.value;
                      setEditingProblem({ ...editingProblem, testCases: cases });
                    }}
                    placeholder="e.g. [0,1]"
                  />
                </div>

                <div className="form-group">
                  <span className="form-label" style={{ fontSize: '0.75rem' }}>Is Sample (Visible)</span>
                  <select
                    value={tc.isSample ? 'true' : 'false'}
                    onChange={(e) => {
                      const cases = [...(editingProblem.testCases || [])];
                      cases[index].isSample = e.target.value === 'true';
                      setEditingProblem({ ...editingProblem, testCases: cases });
                    }}
                    style={{
                      background: 'var(--bg-workspace)',
                      color: '#fff',
                      border: '1px solid var(--border-color)',
                      padding: '0.35rem 0.5rem',
                      borderRadius: '0.375rem',
                      outline: 'none',
                      fontSize: '0.8rem'
                    }}
                  >
                    <option value="true">Sample</option>
                    <option value="false">Hidden</option>
                  </select>
                </div>

                <div>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    style={{ padding: '0.5rem', color: 'var(--danger)', border: 'none', width: '100%', marginTop: '1rem' }}
                    onClick={() => {
                      const cases = [...(editingProblem.testCases || [])];
                      cases.splice(index, 1);
                      setEditingProblem({ ...editingProblem, testCases: cases });
                    }}
                    disabled={(editingProblem.testCases || []).length <= 1}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '1rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setEditingProblem(null)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Save size={16} /> Save Problem
            </button>
          </div>
        </form>
      )}

    </div>
  );
}
