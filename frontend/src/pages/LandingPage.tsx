import { useEffect, useState } from 'react';
import { Terminal, Award, Cpu, CheckCircle, Zap, ArrowRight, Star, Heart, Flame } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const [typedCode, setTypedCode] = useState('');
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'editor' | 'terminal'>('editor');

  const pythonCode = `def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []`;

  useEffect(() => {
    let index = 0;
    let codeAccumulator = '';
    const codeTypingInterval = setInterval(() => {
      if (index < pythonCode.length) {
        codeAccumulator += pythonCode[index];
        setTypedCode(codeAccumulator);
        index++;
      } else {
        clearInterval(codeTypingInterval);
        // Start compilation simulation after typing finishes
        setTimeout(() => {
          setActiveTab('terminal');
          setTerminalOutput(['$ python solution.py --test-cases', 'Compiling solution.py...', 'Running test cases...']);
          
          setTimeout(() => {
            setTerminalOutput(prev => [
              ...prev,
              '✓ Test Case 1: [2,7,11,15], target=9 -> Expected [0,1], Got [0,1] (Passed)',
              '✓ Test Case 2: [3,2,4], target=6 -> Expected [1,2], Got [1,2] (Passed)',
              '---------------------------------------',
              '🎉 Status: ACCEPTED',
              'Execution time: 14ms | Memory: 14.8 MB'
            ]);
          }, 1200);
        }, 1500);
      }
    }, 45); // Typing speed

    return () => clearInterval(codeTypingInterval);
  }, []);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '5rem', paddingBottom: '5rem' }}>
      
      {/* Hero Section */}
      <section style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', padding: '4rem 1rem 2rem 1rem', position: 'relative' }}>
        
        <div className="badge-free" style={{
          padding: '0.4rem 1rem',
          borderRadius: '2rem',
          fontSize: '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.5px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
        }}>
          <Zap size={12} style={{ color: 'var(--success)' }} fill="var(--success)" /> Unlocked: 100% Free DSA Practice
        </div>
        
        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: '1.1', maxWidth: '850px', letterSpacing: '-0.04em', margin: 0, color: '#fff' }}>
          Master DSA and Ace Your Next <span className="text-gradient" style={{ background: 'linear-gradient(135deg, #fff 40%, var(--primary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Technical Interview</span>
        </h1>
        
        <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: '600px', lineHeight: '1.6', fontWeight: 400 }}>
          Compile in 6 major languages, follow the LeetCode Top 150 sequentially, and receive feedback from our automated AI interview coach.
        </p>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '0.95rem' }} onClick={onGetStarted}>
            Get Started Free <ArrowRight size={16} />
          </button>
          <a href="#free-program" className="btn btn-secondary" style={{ padding: '0.85rem 2rem', fontSize: '0.95rem', textDecoration: 'none' }}>
            Learn More
          </a>
        </div>

        {/* Floating statistics micro-banners */}
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2.5rem', flexWrap: 'wrap', justifyContent: 'center', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#18181b', padding: '0.4rem 1rem', borderRadius: '2rem', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}>
            <Flame size={12} style={{ color: 'var(--warning)' }} />
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>150+ Questions Loaded</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#18181b', padding: '0.4rem 1rem', borderRadius: '2rem', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}>
            <Cpu size={12} style={{ color: 'var(--primary)' }} />
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>6 Compiler Toolchains</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#18181b', padding: '0.4rem 1rem', borderRadius: '2rem', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}>
            <Star size={12} style={{ color: 'var(--success)' }} />
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>100% Free Forever</span>
          </div>
        </div>
      </section>

      {/* Code Playground Interactive Showcase */}
      <section style={{ maxWidth: '840px', width: '100%', margin: '0 auto', padding: '0 1rem' }}>
        <div className="mock-ide" style={{ border: '1px solid var(--border-color)' }}>
          <div className="mock-ide-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 1.25rem', background: '#18181b' }}>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <div className="mock-dot" style={{ background: '#3f3f46', width: '9px', height: '9px' }}></div>
              <div className="mock-dot" style={{ background: '#3f3f46', width: '9px', height: '9px' }}></div>
              <div className="mock-dot" style={{ background: '#3f3f46', width: '9px', height: '9px' }}></div>
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem', background: '#09090b', padding: '0.2rem', borderRadius: '0.35rem', border: '1px solid var(--border-color)' }}>
              <div 
                onClick={() => setActiveTab('editor')}
                style={{
                  padding: '0.2rem 0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: activeTab === 'editor' ? '#fff' : 'var(--text-muted)',
                  background: activeTab === 'editor' ? '#18181b' : 'transparent',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                twoSum.py
              </div>
              <div 
                onClick={() => setActiveTab('terminal')}
                style={{
                  padding: '0.2rem 0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: activeTab === 'terminal' ? '#fff' : 'var(--text-muted)',
                  background: activeTab === 'terminal' ? '#18181b' : 'transparent',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                terminal
              </div>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Python 3</div>
          </div>

          <div style={{ height: '300px', padding: '1.5rem', background: '#09090b', overflowY: 'auto' }}>
            {activeTab === 'editor' ? (
              <pre style={{ margin: 0, fontSize: '0.85rem', color: '#c084fc', lineHeight: '1.6', fontFamily: 'var(--font-mono)' }}>
                <code>{typedCode}</code>
                <span style={{ borderLeft: '2px solid #fff', marginLeft: '2px', animation: 'blink 1s step-end infinite' }}></span>
              </pre>
            ) : (
              <pre style={{ margin: 0, fontSize: '0.8rem', color: '#e5e7eb', lineHeight: '1.7', fontFamily: 'var(--font-mono)' }}>
                {terminalOutput.map((line, idx) => (
                  <div key={idx} style={{ color: line.startsWith('✓') ? 'var(--success)' : line.startsWith('🎉') ? 'var(--primary)' : '#e5e7eb' }}>
                    {line}
                  </div>
                ))}
              </pre>
            )}
          </div>
        </div>
        
        <style>{`
          @keyframes blink { from, to { border-color: transparent } 50% { border-color: #fff } }
        `}</style>
      </section>

      {/* Features Grid */}
      <section id="features" style={{ padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em', color: '#fff' }}>Everything You Need to Ace the Interview</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.4rem', fontSize: '1rem' }}>No fee gates, no premium limits, and no credit card required.</p>
        </div>
        
        <div className="grid-3">
          
          <div className="glass-panel glass-panel-hover" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: '#18181b', color: 'var(--primary)', padding: '0.75rem', borderRadius: '0.5rem', alignSelf: 'flex-start', border: '1px solid var(--border-color)' }}>
              <Cpu size={20} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#fff' }}>6 Sandboxed Compilers</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: '1.5' }}>
              Compile and run code in C#, Java, Python, C, C++, and JavaScript. Our backend detects your local environment to execute solutions locally inside fast, time-limited process sandboxes.
            </p>
          </div>

          <div className="glass-panel glass-panel-hover" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: '#18181b', color: 'var(--primary)', padding: '0.75rem', borderRadius: '0.5rem', alignSelf: 'flex-start', border: '1px solid var(--border-color)' }}>
              <Award size={20} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#fff' }}>LeetCode Top 150 Roadmap</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: '1.5' }}>
              Navigate a curated sequentially structured timeline connecting 150 high-yield interview questions. Filter by category, track your streak progress, and get details for each question.
            </p>
          </div>

          <div className="glass-panel glass-panel-hover" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: '#18181b', color: 'var(--primary)', padding: '0.75rem', borderRadius: '0.5rem', alignSelf: 'flex-start', border: '1px solid var(--border-color)' }}>
              <Terminal size={20} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#fff' }}>AI Interview Coach</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: '1.5' }}>
              Simulate actual mock interview calls covering Behavioral, C#/.NET, and System Design tracks. Evaluates answers objectively using response length audits and STAR method metrics.
            </p>
          </div>

        </div>
      </section>

      {/* Free Program Section */}
      <section id="free-program" style={{ padding: '2rem 1rem', display: 'flex', justifyContent: 'center' }}>
        <div className="glass-panel" style={{
          maxWidth: '800px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          border: '1px solid var(--border-color-active)',
          background: '#18181b',
          padding: '2.5rem',
          borderRadius: '0.75rem',
          position: 'relative'
        }}>
          {/* Top visual accent badge */}
          <div style={{
            position: 'absolute',
            top: '-13px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--success)',
            color: '#fff',
            fontSize: '0.7rem',
            fontWeight: 600,
            padding: '0.25rem 1rem',
            borderRadius: '2rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            <Heart size={10} fill="#fff" /> Open Source Student Program
          </div>

          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: '0.5rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>100% Free DSA Practice for Every Student</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '550px', margin: '0 auto' }}>
              We believe coding interview prep should be accessible to everyone, not locked behind expensive paywalls. PrepArena is completely free.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <CheckCircle size={16} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '0.15rem' }} />
                <div>
                  <h4 style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem', margin: 0 }}>All 150 LeetCode Problems</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.15rem', lineHeight: '1.4' }}>Get unrestricted access to the complete roadmap with no locked questions.</p>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <CheckCircle size={16} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '0.15rem' }} />
                <div>
                  <h4 style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem', margin: 0 }}>Full Multi-Language Support</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.15rem', lineHeight: '1.4' }}>Write, run, and compile solutions in C#, Java, Python, C++, C, and JavaScript.</p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <CheckCircle size={16} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '0.15rem' }} />
                <div>
                  <h4 style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem', margin: 0 }}>AI Interview Panels</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.15rem', lineHeight: '1.4' }}>Run unlimited mock interviews and get detailed feedback and STAR report cards.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <CheckCircle size={16} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '0.15rem' }} />
                <div>
                  <h4 style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem', margin: 0 }}>No Hidden Charges</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.15rem', lineHeight: '1.4' }}>No premium plans, no hidden limits, and absolutely no credit card details required.</p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Supported by open-source dev teams and university networks around the world.</span>
            <button className="btn btn-success" style={{ padding: '0.75rem 2rem', fontSize: '0.9rem' }} onClick={onGetStarted}>
              Claim Your Free Sandbox Account Now
            </button>
          </div>
        </div>
      </section>

      {/* bottom CTA */}
      <section className="glass-panel" style={{
        background: 'linear-gradient(135deg, #18181b 0%, #09090b 100%)',
        border: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        padding: '3rem',
        borderRadius: '0.75rem',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em', margin: 0, color: '#fff' }}>Ready to Master Technical Interviews?</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '450px', margin: 0 }}>
          Create your developer account and start coding LeetCode solutions today.
        </p>
        <button className="btn btn-primary" style={{ padding: '0.85rem 2.5rem', fontSize: '0.9rem' }} onClick={onGetStarted}>
          Start Preparing Now <ArrowRight size={14} />
        </button>
      </section>

    </div>
  );
}
