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
          Stop Memorizing LeetCode. Build Core <span className="text-gradient-violet">Engineering Intuition</span>.
        </h1>
        
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '650px', lineHeight: '1.6', fontWeight: 500 }}>
          PrepArena is a fully-featured algorithmic sandbox designed to build true problem-solving intuition. Compile in 6 languages, trace curations visually, scan resumes for gaps, and train memory patterns — all 100% free.
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
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0 }}>6 Sandbox Compilers</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
              Write, compile, and run code instantly in C#, Java, Python, C++, C, and JavaScript inside local browser sandboxes.
            </p>
          </div>

          {/* Card 2: Roadmap */}
          <div className="cyber-panel cyber-panel-hover" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', gridColumn: 'span 1' }}>
            <div style={{ background: '#0a0a0c', color: 'var(--primary)', padding: '0.75rem', borderRadius: '8px', alignSelf: 'flex-start', border: '1px solid var(--border-color)' }}>
              <Award size={18} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0 }}>Curated Top 150 Targets</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
              Ascend a visual mountain path mapping 150 top-tier interview questions. Unlock progress worlds and track achievements.
            </p>
          </div>

          {/* Card 3: AI Resume Gap Scanner */}
          <div className="cyber-panel cyber-panel-hover" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', gridColumn: 'span 1' }}>
            <div style={{ background: '#0a0a0c', color: 'var(--primary)', padding: '0.75rem', borderRadius: '8px', alignSelf: 'flex-start', border: '1px solid var(--border-color)' }}>
              <CheckCircle2 size={18} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0 }}>AI Resume Gap Scanner</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
              Drag and drop your CV to instantly scan for algorithmic topic gaps and skills missing from top company hiring bars.
            </p>
          </div>

          {/* Card 4: AI Coding Tutor Coach */}
          <div className="cyber-panel cyber-panel-hover" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center' }}>
              <div style={{ display: 'flex', gap: '0.4rem', color: '#818cf8', fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                <Sparkles size={11} /> Co-Pilot Code Mentor
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: 0 }}>AI Pair Programming Coach</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
                Get real-time line-by-line support, time-space complexity metrics, logic dry runs, and refactoring tips from our integrated AI coding tutor.
              </p>
            </div>
            <div style={{ background: '#030303', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
              <div style={{ color: 'var(--text-muted)' }}>[Coach]: Recursion time is O(2^N). Let's optimize it.</div>
              <div style={{ color: '#818cf8' }}>➔ Try memoization with a cache array.</div>
              <div style={{ color: 'var(--success)' }}>✓ Optimized to O(N) complexity!</div>
            </div>
          </div>

          {/* Card 5: Spaced Repetition Cards */}
          <div className="cyber-panel cyber-panel-hover" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', gridColumn: 'span 1' }}>
            <div style={{ background: '#0a0a0c', color: 'var(--primary)', padding: '0.75rem', borderRadius: '8px', alignSelf: 'flex-start', border: '1px solid var(--border-color)' }}>
              <BookOpen size={18} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0 }}>Spaced Repetition Recall</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
              Train and lock in core patterns (Sliding Window, Trees DFS, Dynamic Programming) with interactive recall cards.
            </p>
          </div>

          {/* Card 6: AI Mock Interview Panels */}
          <div className="cyber-panel cyber-panel-hover" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', gridColumn: 'span 1' }}>
            <div style={{ background: '#0a0a0c', color: 'var(--primary)', padding: '0.75rem', borderRadius: '8px', alignSelf: 'flex-start', border: '1px solid var(--border-color)' }}>
              <Terminal size={18} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0 }}>AI Mock Interview Panels</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
              Simulate chat/voice interview rooms covering C# Core, System Design, and Behavioral tracks using STAR standards.
            </p>
          </div>

          {/* Card 7: Competitive Leaderboard */}
          <div className="cyber-panel cyber-panel-hover" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center' }}>
              <div style={{ display: 'flex', gap: '0.4rem', color: '#fbbf24', fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                <Users size={11} style={{ color: '#fbbf24' }} /> Competitive Rankings
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: 0 }}>Esports-Style Leaderboards</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
                Compete with other student developers on streaks, podium medals, and daily challenges to track your competitive standing.
              </p>
            </div>
            <div style={{ background: '#030303', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', justifyContent: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'rgba(251, 191, 36, 0.05)', borderRadius: '4px' }}>
                <span style={{ color: '#fbbf24', fontWeight: 700 }}>#1 eshwar 👑</span>
                <span style={{ color: 'var(--text-muted)' }}>125 Solved</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>
                <span style={{ color: '#fff' }}>#2 alphaDev</span>
                <span style={{ color: 'var(--text-muted)' }}>110 Solved</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>
                <span style={{ color: '#fff' }}>#3 coderX</span>
                <span style={{ color: 'var(--text-muted)' }}>98 Solved</span>
              </div>
            </div>
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
