import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import ProblemsList from './pages/ProblemsList';
import CodingWorkspace from './pages/CodingWorkspace';
import InterviewPrep from './pages/InterviewPrep';
import Roadmap from './pages/Roadmap';
import AdminPanel from './pages/AdminPanel';
import Leaderboard from './pages/Leaderboard';
import PrepHub from './pages/PrepHub';
import { 
  Terminal, Flame, LogOut, User as UserIcon, 
  MessageCircle, Mail, 
  MapPin, ChevronUp, X, Send, Check,
  LayoutDashboard, Map, Code2, Video, Shield,
  ChevronLeft, ChevronRight, Trophy
} from 'lucide-react';
type Page = 'landing' | 'auth' | 'dashboard' | 'problems' | 'workspace' | 'interview' | 'roadmap' | 'admin' | 'leaderboard' | 'prephub';
type ModalType = 'privacy' | 'terms' | 'contact' | null;

interface User {
  name: string;
  email: string;
  role: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [activeProblemId, setActiveProblemId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userStreak, setUserStreak] = useState<number>(0);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Auto-collapse sidebar in workspace to save space
  useEffect(() => {
    if (currentPage === 'workspace') {
      setIsSidebarCollapsed(true);
    }
  }, [currentPage]);

  // Load real streak
  useEffect(() => {
    if (!user) {
      setUserStreak(0);
      return;
    }
    fetch('http://localhost:5015/api/problems/stats', {
      headers: { 'X-User-Email': user.email }
    })
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.streak === 'number') {
          setUserStreak(data.streak);
        }
      })
      .catch(err => console.error('Error fetching user streak:', err));
  }, [user, currentPage]);

  // Modal State
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Support Ticket Form State
  const [supportEmail, setSupportEmail] = useState('');
  const [supportCategory, setSupportCategory] = useState('technical');
  const [supportMessage, setSupportMessage] = useState('');
  const [supportStatus, setSupportStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  // Auto-restore user session
  useEffect(() => {
    const savedUser = localStorage.getItem('prearena_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setCurrentPage('dashboard');
      } catch {
        localStorage.removeItem('prearena_user');
      }
    }
  }, []);

  const navigateTo = (page: Page, problemId: string | null = null) => {
    if (page === 'workspace' && problemId) {
      setActiveProblemId(problemId);
    }
    
    // Auth Guard
    if (!user && page !== 'landing' && page !== 'auth') {
      setCurrentPage('auth');
      return;
    }

    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthSuccess = (_token: string, userData: User) => {
    setUser(userData);
    localStorage.setItem('prearena_user', JSON.stringify(userData));
    setCurrentPage('dashboard');
  };

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem('prearena_user');
    setCurrentPage('landing');
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
    }, 2000);
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportEmail.trim() || !supportMessage.trim()) return;
    setSupportStatus('sending');
    setTimeout(() => {
      setSupportStatus('success');
      setTimeout(() => {
        setSupportStatus('idle');
        setSupportEmail('');
        setSupportMessage('');
        setActiveModal(null);
      }, 1500);
    }, 1200);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      <div className="noise-overlay"></div>

      {/* Navigation Header */}
      <header className="navbar" style={{ background: 'rgba(10, 10, 12, 0.7)', backdropFilter: 'var(--blur-amount)', borderBottom: '1px solid var(--border-color)' }}>
        <a href="#" className="logo" onClick={() => navigateTo(user ? 'dashboard' : 'landing')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', textDecoration: 'none', fontWeight: 800 }}>
          <Terminal size={20} style={{ color: 'var(--primary)' }} />
          PrepArena
        </a>
        
        {user ? (
          <>
            {/* Authenticated Navigation Links */}
            <nav className="nav-links">
              <a 
                href="#" 
                className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`}
                onClick={() => navigateTo('dashboard')}
              >
                Dashboard
              </a>
              <a 
                href="#" 
                className={`nav-link ${currentPage === 'roadmap' ? 'active' : ''}`}
                onClick={() => navigateTo('roadmap')}
              >
                Roadmap
              </a>
              <a 
                href="#" 
                className={`nav-link ${currentPage === 'problems' || currentPage === 'workspace' ? 'active' : ''}`}
                onClick={() => navigateTo('problems')}
              >
                DSA Arena
              </a>
              <a 
                href="#" 
                className={`nav-link ${currentPage === 'interview' ? 'active' : ''}`}
                onClick={() => navigateTo('interview')}
              >
                Interview Coach
              </a>
              <a 
                href="#" 
                className={`nav-link ${currentPage === 'leaderboard' ? 'active' : ''}`}
                onClick={() => navigateTo('leaderboard')}
              >
                Leaderboard
              </a>
              <a 
                href="#" 
                className={`nav-link ${currentPage === 'prephub' ? 'active' : ''}`}
                onClick={() => navigateTo('prephub')}
                style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                PrepHub
                <span style={{ background: 'var(--danger)', color: '#fff', fontSize: '8px', padding: '1px 4px', borderRadius: '4px', fontWeight: 900, lineHeight: '1.2' }}>NEW</span>
              </a>
              {user.role === 'Admin' && (
                <a 
                  href="#" 
                  className={`nav-link ${currentPage === 'admin' ? 'active' : ''}`}
                  onClick={() => navigateTo('admin')}
                >
                  Admin Panel
                </a>
              )}
            </nav>

            {/* Authenticated User Stats & Widget */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {/* Streak info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(245, 158, 11, 0.06)', border: '1px solid rgba(245, 158, 11, 0.15)', padding: '0.35rem 0.75rem', borderRadius: '8px', color: 'var(--warning)', fontSize: '0.8rem', fontWeight: 700 }}>
                <Flame size={12} fill="var(--warning)" />
                <span>{userStreak} {userStreak === 1 ? 'Day' : 'Days'}</span>
              </div>

              {/* User Avatar & Dropdown / Sign out */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', paddingLeft: '0.75rem', borderLeft: '1px solid var(--border-color)' }}>
                <div style={{ 
                  width: '28px', 
                  height: '28px', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, var(--primary) 0%, #4338ca 100%)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '0.8rem', 
                  fontWeight: 900, 
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff', lineHeight: '1.2' }}>{user.name}</span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{user.role}</span>
                </div>
                <button 
                  onClick={handleSignOut}
                  className="nav-link"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.35rem 0.5rem', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                  onMouseOver={(e) => { e.currentTarget.style.color = 'var(--danger)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
                  title="Sign Out"
                >
                  <LogOut size={14} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Unauthenticated Nav Links */}
            <nav className="nav-links">
              <a href="#features" className="nav-link" onClick={() => navigateTo('landing')}>
                Features
              </a>
              <a href="#" className="nav-link" onClick={() => navigateTo('auth')}>
                Sign In
              </a>
            </nav>
            <button className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }} onClick={() => navigateTo('auth')}>
              Get Started
            </button>
          </>
        )}
      </header>

      {/* Main Viewport */}
      <main 
        className="main-content" 
        style={{ 
          flex: 1, 
          padding: user ? '2.5rem 3rem 4rem' : 0, 
          width: '100%', 
          boxSizing: 'border-box', 
          maxWidth: '100%',
          marginLeft: 0,
          transition: 'none'
        }}
      >
        {currentPage === 'landing' && (
          <LandingPage onGetStarted={() => navigateTo('auth')} />
        )}
        {currentPage === 'auth' && (
          <AuthPage onAuthSuccess={handleAuthSuccess} />
        )}
        {currentPage === 'dashboard' && (
          <Dashboard onNavigate={(page, probId) => navigateTo(page as Page, probId)} currentUser={user} />
        )}
        {currentPage === 'roadmap' && (
          <Roadmap onSelectProblem={(id) => navigateTo('workspace', id)} currentUser={user} />
        )}
        {currentPage === 'problems' && (
          <ProblemsList 
            onSelectProblem={(id) => navigateTo('workspace', id)} 
            currentUserEmail={user?.email}
          />
        )}
        {currentPage === 'workspace' && activeProblemId && (
          <CodingWorkspace 
            problemId={activeProblemId} 
            onBack={() => navigateTo('problems')} 
            currentUser={user}
          />
        )}
        {currentPage === 'interview' && (
          <InterviewPrep />
        )}
        {currentPage === 'leaderboard' && (
          <Leaderboard onNavigate={(page) => navigateTo(page as Page)} />
        )}
        {currentPage === 'prephub' && (
          <PrepHub currentUser={user} onNavigate={navigateTo} />
        )}
        {currentPage === 'admin' && user?.role === 'Admin' && (
          <AdminPanel currentUserEmail={user.email} />
        )}
      </main>

      {/* Pulsing Neon Shimmer Border Divider */}
      <div className="footer-shimmer" style={{
        marginLeft: 0,
        transition: 'none'
      }}></div>

      {/* Premium Multi-Column Footer */}
      <footer className="footer-container" style={{
        marginLeft: 0,
        transition: 'none'
      }}>
        <div className="footer-grid">
          
          {/* Column 1: Brand & pitch */}
          <div className="footer-col">
            <a href="#" className="logo" onClick={() => navigateTo(user ? 'dashboard' : 'landing')} style={{ fontSize: '1.4rem', alignSelf: 'flex-start' }}>
              <Terminal size={20} style={{ color: 'var(--primary)' }} />
              PrepArena
            </a>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.6', color: 'var(--text-muted)' }}>
              Next-generation coding workspace and AI mock interview panels. Built for developers preparing to step into top tech companies.
            </p>
            <div className="social-links">
              <button className="social-btn" aria-label="GitHub">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
              </button>
              <button className="social-btn" aria-label="Twitter">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
              </button>
              <button className="social-btn" aria-label="Discord"><MessageCircle size={16} /></button>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="footer-col">
            <h4 className="footer-col-title">Platform</h4>
            <ul className="footer-links-list">
              <li>
                <span className="footer-link" onClick={() => navigateTo(user ? 'roadmap' : 'auth')}>
                  LeetCode Roadmap
                </span>
              </li>
              <li>
                <span className="footer-link" onClick={() => navigateTo(user ? 'problems' : 'auth')}>
                  DSA Practice Arena
                </span>
              </li>
              <li>
                <span className="footer-link" onClick={() => navigateTo(user ? 'interview' : 'auth')}>
                  AI Interview Coach
                </span>
              </li>
              <li>
                <span className="footer-link" onClick={() => navigateTo(user ? 'prephub' : 'auth')}>
                  PrepHub Student Suite
                </span>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Docs */}
          <div className="footer-col">
            <h4 className="footer-col-title">Legal</h4>
            <ul className="footer-links-list">
              <li>
                <span className="footer-link" onClick={() => setActiveModal('privacy')}>
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="footer-link" onClick={() => setActiveModal('terms')}>
                  Terms of Service
                </span>
              </li>
              <li>
                <span className="footer-link" onClick={() => setActiveModal('contact')}>
                  Support Helpdesk
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Contact */}
          <div className="footer-col">
            <h4 className="footer-col-title">Stay Updated</h4>
            <p style={{ fontSize: '0.8rem', lineHeight: '1.5' }}>Subscribe to get coding tips and Top 150 questions breakdowns.</p>
            
            <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', gap: '0.5rem', position: 'relative' }}>
              <input
                type="email"
                required
                placeholder="developer@domain.com"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                style={{
                  flex: 1,
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '0.5rem',
                  padding: '0.5rem 0.75rem',
                  color: '#fff',
                  fontSize: '0.8rem',
                  outline: 'none'
                }}
              />
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', borderRadius: '0.5rem' }}
                disabled={newsletterSubscribed}
              >
                {newsletterSubscribed ? <Check size={14} /> : 'Join'}
              </button>
            </form>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={12} style={{ color: 'var(--primary)' }} />
                <span>support@preparena.dev</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={12} style={{ color: 'var(--primary)' }} />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Bottom Row */}
        <div className="footer-bottom">
          <span>
            PrepArena DSA Systems © 2026. Hand-crafted with dynamic micro-animations.
          </span>
          <button 
            onClick={scrollToTop}
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-muted)',
              padding: '0.5rem 0.75rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary)';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.boxShadow = '0 0 10px var(--primary-glow)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.color = 'var(--text-muted)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <ChevronUp size={12} /> Back to Top
          </button>
        </div>
      </footer>

      {/* ================= MODAL OVERLAYS ================= */}

      {/* Privacy Policy Modal */}
      {activeModal === 'privacy' && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Privacy & Data Policy</h3>
              <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ fontWeight: 600, color: '#fff' }}>Last Updated: June 2026</p>
              
              <h4>1. Information We Collect</h4>
              <p>
                We collect account credentials (name, email address) to manage student progress tracking and solution submission histories. Your code files are processed locally or within transient sandboxes.
              </p>

              <h4>2. Code Sandboxing & Compiler Execution</h4>
              <p>
                Student-submitted solutions are processed strictly to score test cases. We do not store, distribute, or claim copyrights on original code files submitted for DSA challenges.
              </p>

              <h4>3. Cookies and Analytics</h4>
              <p>
                We use secure local state storage (cookies/localStorage) to persist login sessions and local code workspace cache.
              </p>

              <button className="btn btn-secondary" onClick={() => setActiveModal(null)} style={{ width: '100%', marginTop: '1.5rem' }}>
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Terms of Service Modal */}
      {activeModal === 'terms' && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Terms of Service</h3>
              <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ fontWeight: 600, color: '#fff' }}>Effective Date: June 12, 2026</p>

              <h4>1. Usage Terms</h4>
              <p>
                PrepArena provides an automated code execution sandbox. Users are granted a non-exclusive license to practice DSA problems. Commercial exploitation or malicious scraping of problem repositories is prohibited.
              </p>

              <h4>2. Sandbox Resource Limits</h4>
              <p>
                To prevent server overload, compiled solutions are subject to resource limitations (2000ms CPU execution limits and 256MB RAM constraints). Code causing infinity loops or thread injection will be terminated immediately.
              </p>

              <h4>3. Academic Integrity</h4>
              <p>
                PrepArena is designed for personal learning. Scraping solutions or utilizing automated bots to spam grading endpoints is strictly monitored.
              </p>

              <button className="btn btn-secondary" onClick={() => setActiveModal(null)} style={{ width: '100%', marginTop: '1.5rem' }}>
                I Agree
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Support Helpdesk / Contact Modal */}
      {activeModal === 'contact' && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Submit Support Ticket</h3>
              <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSupportSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '1.5rem' }}>
                
                {supportStatus === 'success' ? (
                  <div style={{ textAlign: 'center', padding: '2rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', padding: '1rem', borderRadius: '50%', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                      <Check size={36} />
                    </div>
                    <h4 style={{ margin: 0 }}>Ticket Created Successfully!</h4>
                    <p style={{ fontSize: '0.85rem' }}>We have received your issue report. A support developer will contact you within 24 hours.</p>
                  </div>
                ) : (
                  <>
                    <div className="form-group">
                      <span className="form-label">Contact Email Address</span>
                      <input
                        type="email"
                        required
                        className="form-input"
                        placeholder="yourname@domain.com"
                        value={supportEmail}
                        onChange={(e) => setSupportEmail(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <span className="form-label">Category</span>
                      <select
                        value={supportCategory}
                        onChange={(e) => setSupportCategory(e.target.value)}
                        style={{
                          background: 'var(--bg-workspace)',
                          color: '#fff',
                          border: '1px solid var(--border-color)',
                          padding: '0.85rem 1.25rem',
                          borderRadius: '0.75rem',
                          fontSize: '0.95rem',
                          outline: 'none'
                        }}
                      >
                        <option value="technical">Sandbox/Compiler Issues</option>
                        <option value="billing">Billing & Subscriptions</option>
                        <option value="account">Account Management</option>
                        <option value="feedback">Problem Repos Feedback</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <span className="form-label">Detailed Message</span>
                      <textarea
                        required
                        rows={4}
                        className="form-input"
                        placeholder="Explain the technical issue or feedback..."
                        value={supportMessage}
                        onChange={(e) => setSupportMessage(e.target.value)}
                        style={{ resize: 'vertical' }}
                      />
                    </div>
                  </>
                )}

              </div>
              
              {supportStatus !== 'success' && (
                <div style={{ padding: '0 2rem 2rem 2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end', background: 'rgba(0,0,0,0.15)', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={supportStatus === 'sending' || !supportEmail.trim() || !supportMessage.trim()}>
                    {supportStatus === 'sending' ? 'Creating Ticket...' : 'Send Message'} <Send size={12} />
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
