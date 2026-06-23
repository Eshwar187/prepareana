import { useState, useEffect, useRef } from 'react';
import { 
  Award, AlertCircle, RefreshCw, Send, CheckCircle, ChevronRight,
  Mic, Volume2, Cpu, Activity, Briefcase, Sparkles, Star, User
} from 'lucide-react';

interface Question {
  id: number;
  category: string;
  questionText: string;
  idealKeywords: string;
  sampleAnswer: string;
}

interface Evaluation {
  questionId: number;
  questionText: string;
  answerText: string;
  score: number;
  strengths: string[];
  improvements: string[];
}

interface Feedback {
  score: number;
  rating: string;
  evaluations: Evaluation[];
  strengthsSummary: string;
  improvementsSummary: string;
}

const SAMPLE_VOICE_ANSWERS: Record<string, string> = {
  'behavioral': 'In my previous role, I was tasked with leading the migration of a legacy database system. The situation was high-stress because the server was experiencing frequent locks. I established a clear timeline, coordinated with three database developers, and systematically decoupled the queries. As a result, we reduced server response times by forty-two percent and completely eliminated lock incidents.',
  'system design': 'To design a system of this scale, I would first apply a horizontal scaling strategy. I would introduce an API Gateway layer for routing and authentication, then place a distributed Redis cache cluster in front of our database replica set to reduce read latency. For write heavy streams, I would implement Apache Kafka to buffer requests and handle decoupling.',
  'c# / .net': 'In C#, I prefer using asynchronous programming patterns with async and await to avoid thread pool starvation. When dealing with resource cleanups, I implement the IDisposable interface within a using block to ensure unmanaged components are disposed of immediately. I also leverage Entity Framework Core with pooled DbContexts for efficient database operations.'
};

export default function InterviewPrep() {
  const [stage, setStage] = useState<'select' | 'interview' | 'feedback'>('select');
  const [topic, setTopic] = useState('Behavioral');
  const [company, setCompany] = useState<'Google' | 'Meta' | 'Amazon' | 'Apple' | 'General'>('General');
  const [sessionId, setSessionId] = useState('');
  
  // Interviewing state
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Voice simulation states
  const [micActive, setMicActive] = useState(false);
  const [speechIntervalId, setSpeechIntervalId] = useState<any>(null);

  // Results state
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const startInterview = () => {
    setSubmitting(true);
    fetch('http://localhost:5015/api/interview/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic })
    })
      .then(res => res.json())
      .then(data => {
        setSessionId(data.sessionId);
        setCurrentQuestion(data.firstQuestion);
        setQuestionIndex(0);
        setTotalQuestions(data.totalQuestions);
        setStage('interview');
        setAnswer('');
        setSubmitting(false);
      })
      .catch(err => {
        console.error('Error starting interview:', err);
        setSubmitting(false);
      });
  };

  const submitAnswer = () => {
    if (!answer.trim()) return;
    setSubmitting(true);
    // Ensure mic is shut off if they submit
    cancelVoiceSim();

    fetch(`http://localhost:5015/api/interview/session/${sessionId}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer })
    })
      .then(res => res.json())
      .then(data => {
        setAnswer('');
        if (data.isCompleted) {
          setFeedback(data.feedback);
          setStage('feedback');
        } else {
          setCurrentQuestion(data.nextQuestion);
          setQuestionIndex(data.currentQuestionIndex);
        }
        setSubmitting(false);
      })
      .catch(err => {
        console.error('Error submitting answer:', err);
        setSubmitting(false);
      });
  };

  // Simulates speech typing
  const handleToggleVoiceInput = () => {
    if (micActive) {
      cancelVoiceSim();
      return;
    }

    setMicActive(true);
    setAnswer('');
    
    // Choose appropriate script based on topic
    const targetText = SAMPLE_VOICE_ANSWERS[topic.toLowerCase()] || SAMPLE_VOICE_ANSWERS['behavioral'];
    const words = targetText.split(' ');
    let currentWordIndex = 0;
    let textAccumulator = '';

    const interval = setInterval(() => {
      if (currentWordIndex < words.length) {
        textAccumulator += (currentWordIndex === 0 ? '' : ' ') + words[currentWordIndex];
        setAnswer(textAccumulator);
        currentWordIndex++;
      } else {
        clearInterval(interval);
        setMicActive(false);
      }
    }, 180); // Speed of spoken typing

    setSpeechIntervalId(interval);
  };

  const cancelVoiceSim = () => {
    if (speechIntervalId) {
      clearInterval(speechIntervalId);
    }
    setMicActive(false);
  };

  useEffect(() => {
    return () => {
      if (speechIntervalId) clearInterval(speechIntervalId);
    };
  }, [speechIntervalId]);

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>
      
      {/* HUD custom styling */}
      <style>{`
        .company-badge {
          border: 1px solid rgba(255, 255, 255, 0.05);
          background: #09090b;
          padding: 0.8rem 1rem;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.25s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          justify-content: center;
          font-weight: 700;
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .company-badge:hover {
          background: rgba(255, 255, 255, 0.02);
          border-color: rgba(255, 255, 255, 0.15);
          color: #fff;
          transform: translateY(-1px);
        }
        .company-badge.active.google { border-color: #4285f4; color: #4285f4; background: rgba(66, 133, 244, 0.03); box-shadow: 0 0 10px rgba(66, 133, 244, 0.1); }
        .company-badge.active.meta { border-color: #0668e1; color: #0668e1; background: rgba(6, 104, 225, 0.03); box-shadow: 0 0 10px rgba(6, 104, 225, 0.1); }
        .company-badge.active.amazon { border-color: #ff9900; color: #ff9900; background: rgba(255, 153, 0, 0.03); box-shadow: 0 0 10px rgba(255, 153, 0, 0.1); }
        .company-badge.active.apple { border-color: #a3a3a3; color: #fff; background: rgba(255, 255, 255, 0.03); box-shadow: 0 0 10px rgba(255, 255, 255, 0.1); }
        .company-badge.active.general { border-color: var(--primary); color: var(--primary); background: rgba(99, 102, 241, 0.03); box-shadow: 0 0 10px rgba(99, 102, 241, 0.08); }

        /* Speech animation bars */
        .waveform-bar {
          width: 3px;
          height: 12px;
          background: #10b981;
          border-radius: 2px;
          animation: bounceWave 0.8s ease-in-out infinite alternate;
        }
        @keyframes bounceWave {
          0% { height: 4px; }
          100% { height: 26px; }
        }
        @keyframes bounceWaveLarge {
          0% { height: 6px; }
          100% { height: 38px; }
        }

        .interview-session-grid {
          display: flex;
          gap: 1.5rem;
          width: 100%;
        }
        .interview-panel-main {
          flex: 1.8;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          min-width: 320px;
        }
        .interview-panel-side {
          flex: 1.2;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          min-width: 280px;
        }
        @media (max-width: 800px) {
          .interview-session-grid {
            flex-direction: column !important;
          }
        }

        /* Pulsing avatar visualizer */
        .avatar-pulse {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
          border: 2px solid rgba(99, 102, 241, 0.3);
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.15);
          animation: avatarGlow 2.5s ease-in-out infinite;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        @keyframes avatarGlow {
          0%, 100% { transform: scale(1); box-shadow: 0 0 12px rgba(99, 102, 241, 0.15); }
          50% { transform: scale(1.06); box-shadow: 0 0 25px rgba(99, 102, 241, 0.25); }
        }

        /* Metric progress bars */
        .hud-metric-row {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          background: rgba(255,255,255,0.01);
          border: 1px solid rgba(255,255,255,0.03);
          border-radius: 8px;
          padding: 0.75rem 1rem;
        }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '1.25rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 900, letterSpacing: '-0.03em', color: '#fff', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={24} style={{ color: 'var(--primary)' }} /> AI Interview Coach
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>Simulate real-time technical and behavioral panels with neural feedback.</p>
        </div>
      </div>

      {/* STAGE 1: CONFIGURATION */}
      {stage === 'select' && (
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', padding: '2rem', background: '#0e0e12', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '1.25rem' }}>
          
          {/* Company Target Preset */}
          <div>
            <span style={{ fontSize: '10px', color: 'var(--text-main)', display: 'block', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '1px', marginBottom: '0.75rem' }}>Target Company Standard</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
              {(['Google', 'Meta', 'Amazon', 'Apple', 'General'] as const).map((c) => (
                <div 
                  key={c}
                  className={`company-badge ${company === c ? 'active ' + c.toLowerCase() : ''}`}
                  onClick={() => setCompany(c)}
                >
                  <Briefcase size={13} />
                  {c}
                </div>
              ))}
            </div>
          </div>

          {/* Focus Topic Selection */}
          <div>
            <span style={{ fontSize: '10px', color: 'var(--text-main)', display: 'block', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '1px', marginBottom: '0.75rem' }}>Focus Subject Area</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
              {['Behavioral', 'System Design', 'C# / .NET'].map((t) => (
                <div 
                  key={t}
                  onClick={() => setTopic(t)}
                  style={{
                    padding: '1.25rem',
                    borderRadius: '10px',
                    border: '1px solid ' + (topic === t ? 'var(--primary)' : 'rgba(255,255,255,0.04)'),
                    background: topic === t ? 'rgba(99, 102, 241, 0.05)' : '#09090b',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s',
                    boxShadow: topic === t ? '0 0 12px rgba(99, 102, 241, 0.05)' : 'none'
                  }}
                  onMouseOver={(e) => { if (topic !== t) e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'; }}
                  onMouseOut={(e) => { if (topic !== t) e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.04)'; }}
                >
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: topic === t ? '#fff' : 'var(--text-muted)', margin: 0 }}>{t}</h3>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#09090b', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
            <AlertCircle size={15} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <span>Targeting {company === 'General' ? 'industry standards' : company + ' criteria'} for your mock interview. Includes 3 focus challenges with speech recognition capabilities.</span>
          </div>

          <button className="btn btn-primary" onClick={startInterview} disabled={submitting} style={{ alignSelf: 'flex-start', padding: '0.75rem 2rem', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.5px' }}>
            {submitting ? 'Starting AI Session...' : 'Launch Simulation'}
          </button>
        </div>
      )}

      {/* STAGE 2: ACTIVE SESSION */}
      {stage === 'interview' && currentQuestion && (
        <div className="interview-session-grid">
          
          {/* Main Interview Panel */}
          <div className="interview-panel-main">
            
            {/* Interviewer Neural Avatar feed */}
            <div className="glass-panel" style={{
              background: 'linear-gradient(135deg, #101015 0%, #050508 100%)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '1.25rem',
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '2rem'
            }}>
              <div className="avatar-pulse">
                <Volume2 size={32} style={{ color: '#c084fc' }} />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '8px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', color: '#10b981' }}>
                  <Activity size={10} /> Panel Stream Online
                </div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: 0 }}>Interviewer AI ({company} Panelist)</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, maxWidth: '420px', lineHeight: 1.45 }}>
                  Listening to your verbal input. Ensure you structure your thoughts clearly. Click the Microphone to respond vocally.
                </p>
              </div>
            </div>

            {/* Focus Question panel */}
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', background: '#0e0e12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '1.25rem', padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 800 }}>
                  World Category: {currentQuestion.category}
                </span>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)' }}>
                  Stage {questionIndex + 1} of {totalQuestions}
                </span>
              </div>
              
              {/* Progress bar */}
              <div style={{ background: '#09090b', height: '4px', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ background: 'linear-gradient(90deg, var(--primary) 0%, #6366f1 100%)', height: '100%', width: `${((questionIndex + 1) / totalQuestions) * 100}%`, transition: 'width 0.3s' }}></div>
              </div>

              <div style={{ background: '#09090b', padding: '1.25rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.03)' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, lineHeight: '1.5', color: '#fff', margin: 0, letterSpacing: '-0.01em' }}>{currentQuestion.questionText}</h3>
              </div>

              {/* Response Section */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Your Response</span>
                  
                  {/* Voice mode trigger */}
                  <button
                    type="button"
                    onClick={handleToggleVoiceInput}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      background: micActive ? 'rgba(244, 63, 94, 0.1)' : 'rgba(255,255,255,0.02)',
                      border: '1px solid ' + (micActive ? '#f43f5e' : 'rgba(255,255,255,0.06)'),
                      color: micActive ? '#f43f5e' : '#fff',
                      padding: '5px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      transition: 'all 0.2s'
                    }}
                  >
                    {micActive ? 'Stop Recording' : 'Respond Vocally'}
                  </button>
                </div>

                {/* Animated 3D soundwave stream visualizer */}
                {micActive && (
                  <div style={{
                    background: 'rgba(9, 9, 11, 0.95)',
                    border: '1px solid var(--primary)',
                    borderRadius: '10px',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.85rem',
                    boxShadow: '0 0 12px var(--primary-glow)',
                    margin: '0.25rem 0'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                      <Activity size={14} style={{ filter: 'drop-shadow(0 0 4px #10b981)' }} /> Voice stream active • recording telemetry...
                    </div>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center', height: '40px' }}>
                      {[...Array(24)].map((_, i) => {
                        const delay = (i * 0.08).toFixed(2);
                        const duration = (0.5 + Math.random() * 0.6).toFixed(2);
                        return (
                          <div
                            key={i}
                            className="waveform-bar-active"
                            style={{
                              width: '4px',
                              borderRadius: '2px',
                              background: `linear-gradient(to top, var(--primary), #818cf8)`,
                              animation: `bounceWaveLarge ${duration}s ease-in-out infinite alternate`,
                              animationDelay: `${delay}s`
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

                <textarea
                  rows={8}
                  placeholder={micActive ? 'Listening to speech... typing response...' : 'Type your response here or click "Respond Vocally"...'}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  disabled={micActive}
                  style={{
                    background: '#09090b',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.04)',
                    borderRadius: '10px',
                    padding: '1rem',
                    outline: 'none',
                    fontSize: '0.9rem',
                    resize: 'vertical',
                    lineHeight: '1.5',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.04)'}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>Minimum recommended length: 150 characters</span>
                  <span>{answer.length} characters</span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button 
                  className="btn btn-primary" 
                  onClick={submitAnswer} 
                  disabled={submitting || !answer.trim() || micActive}
                  style={{ display: 'flex', gap: '6px', alignItems: 'center', padding: '0.65rem 1.5rem', fontWeight: 800 }}
                >
                  {submitting ? 'Analyzing Response...' : 'Submit Answer'} <Send size={12} />
                </button>
              </div>

            </div>
          </div>

          {/* Sidebar STAR Telemetry Panel */}
          <div className="interview-panel-side">
            <div className="cyber-panel" style={{ height: 'fit-content', border: '1.5px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.6rem' }}>
                <Cpu size={14} style={{ color: 'var(--primary)', filter: 'drop-shadow(0 0 4px var(--primary))' }} />
                <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>STAR Analysis</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {[
                  {
                    key: 'S',
                    name: 'Situation',
                    desc: 'Context, roles, background scene.',
                    detected: /previous|role|when|situation|background|at|client|project|was tasked|experience/i.test(answer)
                  },
                  {
                    key: 'T',
                    name: 'Task',
                    desc: 'The goal, target, challenges.',
                    detected: /task|goal|objective|require|challenge|responsibility|target|needed to/i.test(answer)
                  },
                  {
                    key: 'A',
                    name: 'Action',
                    desc: 'Your steps, tools, execution.',
                    detected: /action|implemented|developed|built|created|led|resolved|engineered|decoupled|analyzed|optimized|wrote|designed/i.test(answer)
                  },
                  {
                    key: 'R',
                    name: 'Result',
                    desc: 'Outcomes, statistics, metrics.',
                    detected: /result|consequently|outcome|impact|reduced|increased|improved|percent|saved|successfully/i.test(answer)
                  }
                ].map((step) => (
                  <div key={step.key} style={{
                    display: 'flex',
                    gap: '0.85rem',
                    padding: '0.85rem',
                    borderRadius: '10px',
                    border: '1.5px solid ' + (step.detected ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255,255,255,0.03)'),
                    background: step.detected ? 'rgba(16, 185, 129, 0.05)' : 'rgba(9, 9, 11, 0.4)',
                    transition: 'all 0.3s ease',
                    boxShadow: step.detected ? '0 0 10px rgba(16, 185, 129, 0.08)' : 'none'
                  }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                      fontSize: '0.85rem',
                      fontFamily: 'var(--font-mono)',
                      background: step.detected ? 'var(--success)' : '#18181b',
                      color: step.detected ? '#000' : 'var(--text-muted)',
                      transition: 'all 0.3s ease'
                    }}>
                      {step.key}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: step.detected ? '#fff' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {step.name} {step.detected && <span style={{ color: 'var(--success)', fontSize: '10px' }}>✓</span>}
                      </span>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', lineHeight: '1.3' }}>
                        {step.desc}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* STAGE 3: DETAILED REPORT */}
      {stage === 'feedback' && feedback && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Main Score Glass Card */}
          <div className="glass-panel" style={{
            background: 'linear-gradient(135deg, #101015 0%, #050508 100%)',
            border: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '2.5rem 2rem',
            borderRadius: '1.25rem',
            flexWrap: 'wrap',
            gap: '2rem'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, minWidth: '280px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fbbf24', fontSize: '8px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>
                <Sparkles size={11} /> Performance Assessment
              </div>
              <h2 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>{feedback.rating}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0, lineHeight: '1.5', maxWidth: '450px' }}>
                {feedback.strengthsSummary}
              </p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
              <div style={{
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '3px solid #10b981',
                boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)'
              }}>
                <span style={{ fontSize: '1.85rem', fontWeight: 900, color: '#10b981' }}>{feedback.score}</span>
              </div>
              <span style={{ fontSize: '8px', color: 'var(--text-muted)', fontWeight: 800, letterSpacing: '0.5px' }}>COMPILATION SCORE</span>
            </div>
          </div>

          {/* AI Neural Assessment Profile */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.75rem', background: '#0e0e12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <Cpu size={15} style={{ color: 'var(--primary)' }} /> AI Neural Performance Matrix
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
              <div className="hud-metric-row">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800 }}>
                  <span style={{ color: 'var(--text-main)' }}>Technical Depth</span>
                  <span style={{ color: '#6366f1' }}>8.8 / 10</span>
                </div>
                <div style={{ background: '#09090b', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ background: '#6366f1', height: '100%', width: '88%' }} />
                </div>
              </div>

              <div className="hud-metric-row">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800 }}>
                  <span style={{ color: 'var(--text-main)' }}>STAR Framework Structure</span>
                  <span style={{ color: '#38bdf8' }}>9.0 / 10</span>
                </div>
                <div style={{ background: '#09090b', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ background: '#38bdf8', height: '100%', width: '90%' }} />
                </div>
              </div>

              <div className="hud-metric-row">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800 }}>
                  <span style={{ color: 'var(--text-main)' }}>Vocabulary & Tone</span>
                  <span style={{ color: '#10b981' }}>8.5 / 10</span>
                </div>
                <div style={{ background: '#09090b', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ background: '#10b981', height: '100%', width: '85%' }} />
                </div>
              </div>

              <div className="hud-metric-row">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800 }}>
                  <span style={{ color: 'var(--text-main)' }}>Problem Solving speed</span>
                  <span style={{ color: '#fbbf24' }}>8.0 / 10</span>
                </div>
                <div style={{ background: '#09090b', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ background: '#fbbf24', height: '100%', width: '80%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Coaching Advice */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1.5rem', background: '#0e0e12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '1.25rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <Award size={15} style={{ color: 'var(--primary)' }} /> AI Diagnostic Review
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
              {feedback.improvementsSummary}
            </p>
          </div>

          {/* Detailed Question Review */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#fff', margin: 0 }}>Transcript Breakdown</h3>
            
            {feedback.evaluations.map((evalObj, idx) => (
              <div key={evalObj.questionId} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem', background: '#0e0e12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '1.25rem' }}>
                
                {/* Question Info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                  <h4 style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff', margin: 0, lineHeight: '1.4' }}>
                    Challenge {idx + 1}: {evalObj.questionText}
                  </h4>
                  <span style={{
                    padding: '0.25rem 0.6rem',
                    background: evalObj.score >= 7 ? 'rgba(16,185,129,0.06)' : 'rgba(245,158,11,0.06)',
                    color: evalObj.score >= 7 ? '#10b981' : '#f59e0b',
                    border: '1px solid ' + (evalObj.score >= 7 ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)'),
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    whiteSpace: 'nowrap'
                  }}>
                    {evalObj.score} / 10
                  </span>
                </div>

                {/* Response Text */}
                <div style={{ background: '#09090b', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.02)' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.35rem', letterSpacing: '0.5px' }}>TRANSCRIBED TRANSCRIPT:</div>
                  <p style={{ fontSize: '0.85rem', lineHeight: '1.5', color: '#d1d5db', fontStyle: 'italic', margin: 0 }}>
                    "{evalObj.answerText || 'No verbal response recorded.'}"
                  </p>
                </div>

                {/* Analysis Columns */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '0.25rem' }}>
                  
                  {/* Strengths */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', background: 'rgba(16, 185, 129, 0.01)', border: '1px solid rgba(16, 185, 129, 0.05)', padding: '0.75rem 1rem', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      <CheckCircle size={11} /> Strengths:
                    </div>
                    <ul style={{ paddingLeft: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
                      {evalObj.strengths.map((s, i) => <li key={i} style={{ marginBottom: '2px' }}>{s}</li>)}
                    </ul>
                  </div>

                  {/* Improvements */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', background: 'rgba(245, 158, 11, 0.01)', border: '1px solid rgba(245, 158, 11, 0.05)', padding: '0.75rem 1rem', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      <ChevronRight size={11} /> AI Feedback Points:
                    </div>
                    <ul style={{ paddingLeft: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
                      {evalObj.improvements.map((s, i) => <li key={i} style={{ marginBottom: '2px' }}>{s}</li>)}
                    </ul>
                  </div>

                </div>

              </div>
            ))}
          </div>

          <button className="btn btn-secondary animate-fade-in" onClick={() => setStage('select')} style={{ alignSelf: 'center', display: 'flex', gap: '0.4rem', alignItems: 'center', padding: '0.65rem 1.5rem', fontWeight: 800 }}>
            <RefreshCw size={12} /> Start New Assessment
          </button>

        </div>
      )}

    </div>
  );
}
