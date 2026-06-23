import React, { useState, useEffect } from 'react';
import { Terminal as TerminalIcon, Eye, EyeOff, ShieldAlert, CheckCircle2, User, Mail, Lock, ShieldCheck } from 'lucide-react';

interface AuthPageProps {
  onAuthSuccess: (token: string, user: any) => void;
}

export default function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // States
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [consoleExpanded, setConsoleExpanded] = useState(false);

  // Terminal Simulator Logs
  const [logs, setLogs] = useState<string[]>([]);

  // Force Light Theme on document body when mounting this page
  useEffect(() => {
    document.body.classList.add('auth-light-theme');
    return () => {
      document.body.classList.remove('auth-light-theme');
    };
  }, []);

  useEffect(() => {
    // Reset and simulate logs based on tab selection
    setLogs([]);
    const initialLogs = activeTab === 'login' ? [
      '[SYSTEM] INITIALIZING AUTHENTICATION PROTOCOL...',
      '[SYSTEM] DETECTING HOST RUNTIME SYSTEM ENVIRONMENT...',
      '➔ Checking C# Roslyn scripting toolchain... [OK]',
      '➔ Checking Python 3.14 runner path... [OK]',
      '➔ Checking Node.js runtime process... [OK]',
      '[DATABASE] CONNECTING TO SUPABASE CLOUD DATABASE...',
      '➔ Handshaking with secure auth endpoint... [STABLE]',
      '➔ Awaiting client credentials...'
    ] : [
      '[SYSTEM] INITIALIZING MEMBER ENROLLMENT PROTOCOL...',
      '[SYSTEM] PREPARING ISOLATED ENVIRONMENT...',
      '➔ Allocating sandbox workspace credentials... [OK]',
      '➔ Mapping LeetCode Top 150 progress states... [OK]',
      '[DATABASE] CONNECTING TO SUPABASE CLOUD DATABASE...',
      '➔ Handshaking with secure registration API... [STABLE]',
      '➔ Awaiting input from enrollment form...'
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < initialLogs.length) {
        const nextLog = initialLogs[currentLogIndex];
        setLogs(prev => [...prev, nextLog]);
        currentLogIndex++;
      } else {
        clearInterval(interval);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [activeTab]);

  const addTerminalLog = (log: string) => {
    setLogs(prev => [...prev, log]);
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    
    if (!email || !password) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    if (activeTab === 'register') {
      if (!name) {
        setErrorMsg('Please enter your name.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters.');
        return;
      }
    }

    setSubmitting(true);
    setConsoleExpanded(true); // Automatically expand console on submission
    addTerminalLog(`➔ Transmitting client payload to authentication server...`);
    addTerminalLog(`➔ Evaluating credentials...`);

    const endpoint = activeTab === 'login' ? 'login' : 'register';
    const payload = activeTab === 'login' 
      ? { email, password }
      : { name, email, password };

    fetch(`http://localhost:5015/api/auth/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(data => { throw new Error(data.message || 'Authentication failed.') });
        }
        return res.json();
      })
      .then(data => {
        addTerminalLog(`[SUCCESS] Authentication successful!`);
        addTerminalLog(`[SECURITY] Generating local session token...`);
        addTerminalLog(`➔ Session details: Role = ${data.user.role}`);
        addTerminalLog(`[SYSTEM] Redirecting to student dashboard...`);
        
        setSuccessMsg(activeTab === 'login' ? 'Welcome back!' : 'Account registered successfully!');
        
        setTimeout(() => {
          onAuthSuccess(data.token, data.user);
        }, 1000);
      })
      .catch(err => {
        addTerminalLog(`[ERROR] AUTHENTICATION ERROR: ${err.message || 'Connection failed'}`);
        setErrorMsg(err.message || 'Server error. Please try again.');
        setSubmitting(false);
      });
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '1rem 0' }}>
      
      {/* Premium Split Screen Layout */}
      <div className="auth-split-container">
        
        {/* Left Side: Center 3D Iridescent Cube Image */}
        <div className="auth-cube-side">
          {/* Floating compiler code tokens */}
          <div className="code-particle" style={{ top: '12%', left: '12%', animationDelay: '0s' }}>
            <div className="particle-badge success">✓ Accepted</div>
          </div>
          <div className="code-particle" style={{ top: '24%', right: '12%', animationDelay: '1.5s' }}>
            <div className="particle-badge code">O(log N)</div>
          </div>
          <div className="code-particle" style={{ bottom: '26%', left: '10%', animationDelay: '3s' }}>
            <div className="particle-badge primary">compiler.run()</div>
          </div>
          <div className="code-particle" style={{ bottom: '14%', right: '14%', animationDelay: '4.5s' }}>
            <div className="particle-badge warning">C# | Roslyn</div>
          </div>

          {/* Compiler Scanner Laser Line */}
          <div className="compiler-scan-line"></div>

          <img src="/auth_cube.png" className="auth-cube-image" alt="Auth Illustration" />
        </div>

        {/* Right Side: Authentication Form Card */}
        <div className="auth-form-side">
          
          {/* Logo Brand Header Block */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1rem', gap: '0.5rem' }}>
            <img src="/logo.png" style={{ height: '48px', objectFit: 'contain' }} alt="PrepArena Logo" />
            <p style={{ color: '#71717a', fontSize: '0.8rem', margin: 0, fontWeight: 500 }}>
              {activeTab === 'login' ? 'Sign in to access your compiler sandbox' : 'Create a free student profile to track DSA milestones'}
            </p>
          </div>

          {/* Tab Selection Switch */}
          <div className="auth-tabs-container">
            <button 
              type="button" 
              className={`auth-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => { setActiveTab('login'); setErrorMsg(''); }}
            >
              Sign in
            </button>
            <button 
              type="button" 
              className={`auth-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => { setActiveTab('register'); setErrorMsg(''); }}
            >
              Register
            </button>
          </div>

          {/* Errors & Success Callout */}
          {errorMsg && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.05)',
              border: '1px solid rgba(239, 68, 68, 0.15)',
              color: '#ef4444',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              animation: 'fadeIn 0.2s'
            }}>
              <ShieldAlert size={14} style={{ flexShrink: 0, color: '#ef4444' }} />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.05)',
              border: '1px solid rgba(16, 185, 129, 0.15)',
              color: '#10b981',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              animation: 'fadeIn 0.2s'
            }}>
              <CheckCircle2 size={14} style={{ flexShrink: 0, color: '#10b981' }} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form Fields */}
          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {activeTab === 'register' && (
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="auth-input-label">Full Name</span>
                <div className="auth-input-wrapper">
                  <User size={14} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    name="name"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="auth-input-label">Email</span>
              <div className="auth-input-wrapper">
                <Mail size={14} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  required
                  placeholder="username@example.com"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="auth-input-label">Password</span>
              <div className="auth-input-wrapper">
                <Lock size={14} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  name="password"
                  autoComplete={activeTab === 'login' ? 'current-password' : 'new-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {activeTab === 'login' && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-0.5rem' }}>
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    setConsoleExpanded(true);
                    addTerminalLog("➔ Password recovery workflow requested...");
                    setTimeout(() => {
                      addTerminalLog("[ERROR] Recovery Error: SMTP server not configured in local environment.");
                      setErrorMsg("Password recovery is not supported on the local dev server.");
                    }, 500);
                  }}
                  style={{ color: '#71717a', fontSize: '0.75rem', textDecoration: 'none' }}
                >
                  Forgot password?
                </a>
              </div>
            )}

            {activeTab === 'register' && (
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="auth-input-label">Confirm Password</span>
                <div className="auth-input-wrapper">
                  <Lock size={14} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    name="confirm-password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button 
                type="submit" 
                className="auth-btn-primary" 
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <div style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    <span>Connecting sandbox...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={14} />
                    <span>{activeTab === 'login' ? 'Login and start free trial' : 'Register and start free trial'}</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Collapsible Logs Sandbox Console */}
          <div className="auth-console-container" style={{ marginTop: '0.5rem' }}>
            <div 
              className="auth-console-header"
              onClick={() => setConsoleExpanded(!consoleExpanded)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff', fontSize: '0.75rem', fontWeight: 600 }}>
                <TerminalIcon size={12} style={{ color: '#818cf8' }} />
                <span>System Sandbox Console</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.7rem', color: '#a1a1aa' }}>
                  {logs.length > 0 ? logs[logs.length - 1].substring(0, 30) + '...' : 'Awaiting credentials...'}
                </span>
                <span style={{ color: '#a1a1aa', fontSize: '0.8rem' }}>{consoleExpanded ? '▲' : '▼'}</span>
              </div>
            </div>
            
            {consoleExpanded && (
              <div className="auth-console-body">
                {logs.map((log, index) => (
                  <div 
                    key={index} 
                    className="terminal-log-line"
                    style={{ 
                      color: log && log.startsWith('[ERROR]') 
                        ? 'var(--danger)' 
                        : log && log.startsWith('[SUCCESS]') 
                        ? 'var(--success)' 
                        : log && (log.startsWith('[SYSTEM]') || log.startsWith('[DATABASE]') || log.startsWith('[SECURITY]')) 
                        ? '#818cf8' 
                        : '#a1a1aa'
                    }}
                  >
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
