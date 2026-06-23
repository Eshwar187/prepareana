import { useEffect, useState } from 'react';
import { 
  Terminal, Award, Cpu, CheckCircle2, Zap, ArrowRight, 
  Star, Heart, Flame, Users, BookOpen, Sparkles, Code2 
} from 'lucide-react';

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
        // Start compiler simulation
        setTimeout(() => {
          setActiveTab('terminal');
          setTerminalOutput([
            '$ python3 solution.py --test',
            'Compiling twoSum.py...',
            'Running local test cases...'
          ]);
          
          setTimeout(() => {
            setTerminalOutput(prev => [
              ...prev,
              '✓ Test 1: [2,7,11,15], target=9 -> Passed (12ms)',
              '✓ Test 2: [3,2,4], target=6 -> Passed (8ms)',
              '-----------------------------------------',
              '🎉 Status: ACCEPTED (100% test cases passed)',
              'Footprint: 12ms execution | 14.2 MB memory'
            ]);
          }, 1000);
        }, 1200);
      }
    }, 35); // Typing speed

    return () => clearInterval(codeTypingInterval);
  }, []);

  return (
    <div className="animate-fade-in stagger-entry" style={{ display: 'flex', flexDirection: 'column', gap: '6rem', padding: '3rem 2rem 6rem', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Hero Section */}
      <section style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', padding: '3rem 0 1rem', position: 'relative' }}>
        
        <div style={{
          padding: '0.4rem 1rem',
          borderRadius: '2rem',
          fontSize: '0.75rem',
          fontWeight: 700,
          background: 'rgba(16, 185, 129, 0.05)',
          border: '1px solid rgba(16, 185, 129, 0.15)',
          color: 'var(--success)',
          letterSpacing: '0.5px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
        }}>
          <Zap size={11} fill="var(--success)" /> Unlocked: 100% Free DSA Practice Arena
        </div>
        
        <h1 style={{ fontSize: '3.75rem', fontWeight: 900, lineHeight: '1.1', maxWidth: '850px', letterSpacing: '-0.04em', margin: 0, color: '#fff' }}>
          Master Algorithms and Conquer Your Next <span className="text-gradient-violet">Technical Interview</span>
        </h1>
        
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', lineHeight: '1.6', fontWeight: 500 }}>
          Compile in 6 major languages, follow the LeetCode Top 150 sequentially, and receive feedback from our automated AI interview coach.
        </p>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button className="btn btn-primary" style={{ padding: '0.85rem 2.25rem', fontSize: '0.9rem', borderRadius: '10px' }} onClick={onGetStarted}>
            Get Started Free <ArrowRight size={16} />
          </button>
          <a href="#features" className="btn btn-secondary" style={{ padding: '0.85rem 2.25rem', fontSize: '0.9rem', textDecoration: 'none', borderRadius: '10px' }}>
            Explore Platform
          </a>
        </div>

        {/* Floating statistics widgets */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '3rem', flexWrap: 'wrap', justifyContent: 'center', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#0a0a0c', padding: '0.5rem 1.25rem', borderRadius: '2rem', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}>
            <Flame size={12} style={{ color: 'var(--warning)' }} />
            <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>150+ LeetCode Targets</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#0a0a0c', padding: '0.5rem 1.25rem', borderRadius: '2rem', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}>
            <Cpu size={12} style={{ color: 'var(--primary)' }} />
            <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>6 Sandboxed Compilers</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#0a0a0c', padding: '0.5rem 1.25rem', borderRadius: '2rem', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}>
            <Star size={12} style={{ color: 'var(--success)' }} />
            <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>100% Free / Open Source</span>
          </div>
        </div>
      </section>

      {/* Code Playground Showcase */}
      <section style={{ maxWidth: '840px', width: '100%', margin: '0 auto' }}>
        <div className="mock-ide" style={{ border: '1.5px solid var(--border-color)', background: '#0a0a0c', borderRadius: '14px', overflow: 'hidden' }}>
          <div className="mock-ide-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1.25rem', background: '#0e0e12', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <div className="mock-dot" style={{ background: '#f43f5e', width: '8px', height: '8px' }}></div>
              <div className="mock-dot" style={{ background: '#f59e0b', width: '8px', height: '8px' }}></div>
              <div className="mock-dot" style={{ background: '#10b981', width: '8px', height: '8px' }}></div>
            </div>
            
            <div style={{ display: 'flex', gap: '0.4rem', background: '#030303', padding: '0.2rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div 
                onClick={() => setActiveTab('editor')}
                style={{
                  padding: '0.25rem 0.85rem',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: activeTab === 'editor' ? '#fff' : 'var(--text-muted)',
                  background: activeTab === 'editor' ? '#0e0e12' : 'transparent',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.1s'
                }}
              >
                twoSum.py
              </div>
              <div 
                onClick={() => setActiveTab('terminal')}
                style={{
                  padding: '0.25rem 0.85rem',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: activeTab === 'terminal' ? '#fff' : 'var(--text-muted)',
                  background: activeTab === 'terminal' ? '#0e0e12' : 'transparent',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.1s'
                }}
              >
                terminal
              </div>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Python 3</div>
          </div>

          <div style={{ height: '240px', padding: '1.25rem 1.5rem', background: '#030303', overflowY: 'auto' }}>
            {activeTab === 'editor' ? (
              <pre style={{ margin: 0, fontSize: '0.85rem', color: '#818cf8', lineHeight: '1.6', fontFamily: 'var(--font-mono)' }}>
                <code>{typedCode}</code>
                <span style={{ borderLeft: '2px solid #fff', marginLeft: '2px', animation: 'blink 0.8s step-end infinite' }}></span>
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

      {/* Bento Grid Features Layout */}
      <section id="features" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 900, letterSpacing: '-0.03em', color: '#fff', margin: 0 }}>High-Craft Platform Features</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.4rem', fontSize: '0.95rem' }}>A structured, feature-complete suite designed for interview mastery.</p>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.5rem',
        }}>
          
          {/* Card 1: Compilers */}
          <div className="cyber-panel cyber-panel-hover" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', gridColumn: 'span 1' }}>
            <div style={{ background: '#0a0a0c', color: 'var(--primary)', padding: '0.75rem', borderRadius: '8px', alignSelf: 'flex-start', border: '1px solid var(--border-color)' }}>
              <Cpu size={18} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0 }}>6 Compiler Toolchains</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
              Run and evaluate code locally in C#, Java, Python, C, C++, and JavaScript. Auto-detects local compilers inside transient process sandboxes.
            </p>
          </div>

          {/* Card 2: Roadmap */}
          <div className="cyber-panel cyber-panel-hover" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', gridColumn: 'span 1' }}>
            <div style={{ background: '#0a0a0c', color: 'var(--primary)', padding: '0.75rem', borderRadius: '8px', alignSelf: 'flex-start', border: '1px solid var(--border-color)' }}>
              <Award size={18} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0 }}>Top 150 Roadmap</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
              Ascend a visual winding mountain path mapping 150 top-tier interview targets. Track stars, unlock worlds, and face the final DP portal.
            </p>
          </div>

          {/* Card 3: AI Interview Coach */}
          <div className="cyber-panel cyber-panel-hover" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', gridColumn: 'span 1' }}>
            <div style={{ background: '#0a0a0c', color: 'var(--primary)', padding: '0.75rem', borderRadius: '8px', alignSelf: 'flex-start', border: '1px solid var(--border-color)' }}>
              <Terminal size={18} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0 }}>AI Interview Coach</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
              Mock interview calls featuring System Design, Behavioral, and C#/.NET tracks. Evaluates transcripts objectively using STAR framework metrics.
            </p>
          </div>

          {/* Card 4: Student PrepHub (Spans 2 columns for asymmetry) */}
          <div className="cyber-panel cyber-panel-hover" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center' }}>
              <div style={{ display: 'flex', gap: '0.4rem', color: '#818cf8', fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                <Sparkles size={11} /> Student Exclusive Portal
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: 0 }}>PrepHub Student Suite</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
                A powerful workspace containing an **AI Resume Gap Analyzer** with direct drag-and-drop file scanning, **spaced repetition concept flashcards** to capture patterns, and **AI pair programming companions** to dry run logic.
              </p>
            </div>
            <div style={{ background: '#030303', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#fff' }}>
                <CheckCircle2 size={12} style={{ color: 'var(--success)' }} />
                <span>Resume scan and matches</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#fff' }}>
                <BookOpen size={12} style={{ color: 'var(--primary)' }} />
                <span>Spaced repetition recall</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#fff' }}>
                <Users size={12} style={{ color: '#fbbf24' }} />
                <span>Co-coding companion chat</span>
              </div>
            </div>
          </div>

          {/* Card 5: Competitive Leaderboard */}
          <div className="cyber-panel cyber-panel-hover" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', gridColumn: 'span 1' }}>
            <div style={{ background: '#0a0a0c', color: 'var(--primary)', padding: '0.75rem', borderRadius: '8px', alignSelf: 'flex-start', border: '1px solid var(--border-color)' }}>
              <Users size={18} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0 }}>Global Leaderboard</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
              Compete directly with the student developer community. Track streaks, podium rankings, and difficulty stats in real time.
            </p>
          </div>

        </div>
      </section>

      {/* Free Program Section */}
      <section id="free-program" style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="cyber-panel" style={{
          maxWidth: '800px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          border: '1.5px solid var(--border-color-active)',
          background: '#0a0a0c',
          padding: '2.5rem',
          borderRadius: '14px',
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
            fontWeight: 700,
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
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>100% Free DSA Practice for Every Student</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '550px', margin: '0 auto', fontWeight: 500 }}>
              We believe coding interview preparation should be accessible to everyone. PrepArena contains no paywalls or locked questions.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '0.15rem' }} />
                <div>
                  <h4 style={{ color: '#fff', fontWeight: 800, fontSize: '0.9rem', margin: 0 }}>All 150 LeetCode Problems</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.15rem', lineHeight: '1.4', margin: 0 }}>Get unrestricted access to the complete roadmap with no locked questions.</p>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '0.15rem' }} />
                <div>
                  <h4 style={{ color: '#fff', fontWeight: 800, fontSize: '0.9rem', margin: 0 }}>Full Multi-Language Support</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.15rem', lineHeight: '1.4', margin: 0 }}>Write, run, and compile solutions in C#, Java, Python, C++, C, and JavaScript.</p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '0.15rem' }} />
                <div>
                  <h4 style={{ color: '#fff', fontWeight: 800, fontSize: '0.9rem', margin: 0 }}>AI Interview Panels</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.15rem', lineHeight: '1.4', margin: 0 }}>Run unlimited mock interviews and get detailed feedback and STAR report cards.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '0.15rem' }} />
                <div>
                  <h4 style={{ color: '#fff', fontWeight: 800, fontSize: '0.9rem', margin: 0 }}>No Hidden Charges</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.15rem', lineHeight: '1.4', margin: 0 }}>No premium plans, no hidden limits, and absolutely no credit card details required.</p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Supported by open-source dev teams and university networks around the world.</span>
            <button className="btn btn-success" style={{ padding: '0.75rem 2rem', fontSize: '0.9rem', borderRadius: '8px' }} onClick={onGetStarted}>
              Claim Your Free Sandbox Account
            </button>
          </div>
        </div>
      </section>

      {/* bottom CTA */}
      <section className="cyber-panel" style={{
        background: 'linear-gradient(135deg, #0a0a0c 0%, #030303 100%)',
        border: '1.5px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        padding: '3rem',
        borderRadius: '14px',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 850, letterSpacing: '-0.02em', margin: 0, color: '#fff' }}>Ready to Master Technical Interviews?</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '450px', margin: 0, fontWeight: 550 }}>
          Create your developer account and start coding LeetCode solutions today.
        </p>
        <button className="btn btn-primary" style={{ padding: '0.85rem 2.5rem', fontSize: '0.9rem', borderRadius: '10px' }} onClick={onGetStarted}>
          Start Preparing Now <ArrowRight size={14} />
        </button>
      </section>

    </div>
  );
}
