import React, { useState, useEffect } from 'react';
import { Terminal as TerminalIcon, Eye, EyeOff, ShieldAlert, CheckCircle2, User, Mail, Lock, Server, Cpu, ShieldCheck } from 'lucide-react';

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

  // Terminal Simulator Logs
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    // Reset and simulate logs based on tab selection
    setLogs([]);
    const initialLogs = activeTab === 'login' ? [
      '🚀 INITIALIZING AUTHENTICATION PROTOCOL...',
      '🔍 DETECTING HOST RUNTIME SYSTEM ENVIRONMENT...',
      '➔ Checking C# Roslyn scripting toolchain... [OK]',
      '➔ Checking Python 3.14 runner path... [OK]',
      '➔ Checking Node.js runtime process... [OK]',
      '📡 CONNECTING TO SUPABASE CLOUD DATABASE...',
      '➔ Handshaking with secure auth endpoint... [STABLE]',
      '➔ Awaiting client credentials...'
    ] : [
      '⚙️ INITIALIZING MEMBER ENROLLMENT PROTOCOL...',
      '🔍 PREPARING ISOLATED ENVIRONMENT...',
      '➔ Allocating sandbox workspace credentials... [OK]',
      '➔ Mapping LeetCode Top 150 progress states... [OK]',
      '📡 CONNECTING TO SUPABASE CLOUD DATABASE...',
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
        addTerminalLog(`✔ Authentication successful!`);
        addTerminalLog(`🔐 Generating local session token...`);
        addTerminalLog(`➔ Session details: Role = ${data.user.role}`);
        addTerminalLog(`🚀 Redirecting to student dashboard...`);
        
        setSuccessMsg(activeTab === 'login' ? 'Welcome back!' : 'Account registered successfully!');
        
        setTimeout(() => {
          onAuthSuccess(data.token, data.user);
        }, 1000);
      })
      .catch(err => {
        addTerminalLog(`❌ AUTHENTICATION ERROR: ${err.message || 'Connection failed'}`);
        setErrorMsg(err.message || 'Server error. Please try again.');
        setSubmitting(false);
      });
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '75vh', padding: '1rem 0' }}>
      
      {/* Premium Split Screen Layout */}
      <div className="auth-split-container">
        
        {/* Left Side: Glowing Code/Terminal Environment */}
        <div className="auth-terminal-side">
          <div>
            <div className="auth-terminal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', fontSize: '0.8rem', fontWeight: 600 }}>
                <TerminalIcon size={14} style={{ color: 'var(--primary)' }} />
                <span>Compiler Sandbox Auth System v2026.1</span>
              </div>
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#27272a' }}></div>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#27272a' }}></div>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#27272a' }}></div>
              </div>
            </div>

            <div className="auth-terminal-body">
              {logs.map((log, index) => (
                <div 
                  key={index} 
                  className="terminal-log-line"
                  style={{ 
                    color: log && log.startsWith('❌') ? 'var(--danger)' : log && log.startsWith('✔') ? 'var(--success)' : log && (log.startsWith('⚙️') || log.startsWith('🚀')) ? '#c084fc' : '#a1a1aa',
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  {log}
                </div>
              ))}
            </div>
          </div>

          <div className="auth-terminal-footer">
            <Server size={12} style={{ color: 'var(--primary)' }} />
            <span>Database: Supabase Cloud (PostgreSQL)</span>
            <span style={{ margin: '0 0.25rem', color: 'rgba(255,255,255,0.06)' }}>|</span>
            <Cpu size={12} style={{ color: 'var(--primary)' }} />
            <span>Local Compilers: Active</span>
          </div>
        </div>

        {/* Right Side: Authentication Form Card */}
        <div className="auth-form-side">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em', margin: 0, color: '#fff' }}>
              {activeTab === 'login' ? 'Welcome Back' : 'Join PrepArena'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
              {activeTab === 'login' ? 'Sign in to access your compiler sandbox.' : 'Create a free student profile to track DSA milestones.'}
            </p>
          </div>

          {/* Tab Selection Row */}
          <div style={{ display: 'flex', background: '#09090b', padding: '0.2rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
            <button 
              type="button"
              onClick={() => { setActiveTab('login'); setErrorMsg(''); }}
              style={{
                flex: 1,
                padding: '0.45rem',
                background: activeTab === 'login' ? '#27272a' : 'transparent',
                color: activeTab === 'login' ? '#fff' : 'var(--text-muted)',
                border: 'none',
                borderRadius: '0.375rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.8rem',
                transition: 'all 0.15s'
              }}
            >
              Sign In
            </button>
            <button 
              type="button"
              onClick={() => { setActiveTab('register'); setErrorMsg(''); }}
              style={{
                flex: 1,
                padding: '0.45rem',
                background: activeTab === 'register' ? '#27272a' : 'transparent',
                color: activeTab === 'register' ? '#fff' : 'var(--text-muted)',
                border: 'none',
                borderRadius: '0.375rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.8rem',
                transition: 'all 0.15s'
              }}
            >
              Register
            </button>
          </div>

          {/* Errors & Success Callout */}
          {errorMsg && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.03)',
              border: '1px solid rgba(239, 68, 68, 0.15)',
              color: '#fca5a5',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              animation: 'fadeIn 0.2s'
            }}>
              <ShieldAlert size={14} style={{ flexShrink: 0, color: 'var(--danger)' }} />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.03)',
              border: '1px solid rgba(16, 185, 129, 0.15)',
              color: '#a7f3d0',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              animation: 'fadeIn 0.2s'
            }}>
              <CheckCircle2 size={14} style={{ flexShrink: 0, color: 'var(--success)' }} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form Fields */}
          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {activeTab === 'register' && (
              <div className="form-group">
                <span className="form-label">Full Name</span>
                <div className="auth-input-wrapper">
                  <User size={14} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    className="form-input"
                    name="name"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <span className="form-label">Email Address</span>
              <div className="auth-input-wrapper">
                <Mail size={14} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  required
                  placeholder="developer@example.com"
                  className="form-input"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <span className="form-label">Password</span>
              <div className="auth-input-wrapper">
                <Lock size={14} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  className="form-input"
                  name="password"
                  autoComplete={activeTab === 'login' ? 'current-password' : 'new-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {activeTab === 'register' && (
              <div className="form-group">
                <span className="form-label">Confirm Password</span>
                <div className="auth-input-wrapper">
                  <Lock size={14} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    className="form-input"
                    name="confirm-password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}
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
                  <span>{activeTab === 'login' ? 'Authenticate Account' : 'Enroll Student'}</span>
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
