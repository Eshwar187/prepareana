import { useState } from 'react';
import { Award, AlertCircle, RefreshCw, Send, CheckCircle, ChevronRight } from 'lucide-react';

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

export default function InterviewPrep() {
  const [stage, setStage] = useState<'select' | 'interview' | 'feedback'>('select');
  const [topic, setTopic] = useState('Behavioral');
  const [sessionId, setSessionId] = useState('');
  
  // Interviewing state
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);

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

  return (
    <div className="animate-fade-in" style={{ maxWidth: '750px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#fff', marginBottom: '0.25rem' }}>AI Interview Coach</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Practice technical and behavioral interview questions and get detailed, real-time feedback on your answers.</p>
      </div>

      {/* STAGE 1: TOPIC SELECTION */}
      {stage === 'select' && (
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', background: '#18181b', border: '1px solid var(--border-color)', borderRadius: '0.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', margin: 0 }}>Choose your focus area</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
            {['Behavioral', 'System Design', 'C# / .NET'].map((t) => (
              <div 
                key={t}
                onClick={() => setTopic(t)}
                style={{
                  padding: '1.25rem',
                  borderRadius: '0.5rem',
                  border: '1px solid ' + (topic === t ? 'var(--primary)' : 'var(--border-color)'),
                  background: topic === t ? 'rgba(59, 130, 246, 0.04)' : '#09090b',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.15s'
                }}
              >
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: topic === t ? '#fff' : 'var(--text-muted)', margin: 0 }}>{t}</h3>
              </div>
            ))}
          </div>

          <div style={{ background: '#09090b', padding: '0.85rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <AlertCircle size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <span>This mock interview contains 3 customized questions. Your responses will be analyzed for content, terminology, structure, and technical depth.</span>
          </div>

          <button className="btn btn-primary" onClick={startInterview} disabled={submitting} style={{ alignSelf: 'flex-start' }}>
            {submitting ? 'Initializing Session...' : 'Start Interview Session'}
          </button>
        </div>
      )}

      {/* STAGE 2: INTERVIEWING */}
      {stage === 'interview' && currentQuestion && (
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', background: '#18181b', border: '1px solid var(--border-color)', borderRadius: '0.5rem' }}>
          
          {/* Progress */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
              Category: {currentQuestion.category}
            </span>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)' }}>
              Question {questionIndex + 1} of {totalQuestions}
            </span>
          </div>
          <div style={{ background: '#09090b', height: '4px', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ background: 'var(--primary)', height: '100%', width: `${((questionIndex + 1) / totalQuestions) * 100}%` }}></div>
          </div>

          {/* Question Text */}
          <div style={{ background: '#09090b', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, lineHeight: '1.5', color: '#fff', margin: 0 }}>{currentQuestion.questionText}</h3>
          </div>

          {/* Tips box */}
          {currentQuestion.category === 'Behavioral' ? (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              💡 <strong>STAR Framework Tip:</strong> Structure your answer with a <strong>Situation</strong> (context), <strong>Task</strong> (responsibility), <strong>Action</strong> (what you did), and <strong>Result</strong> (what you achieved).
            </div>
          ) : (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              💡 <strong>Technical Tip:</strong> Mention architectural terms, pros/cons, trade-offs, and scaling bottlenecks.
            </div>
          )}

          {/* Response Area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <textarea
              rows={8}
              placeholder="Type your detailed response here..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              style={{
                background: '#09090b',
                color: '#fff',
                border: '1px solid var(--border-color)',
                borderRadius: '0.5rem',
                padding: '0.85rem 1rem',
                outline: 'none',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.9rem',
                resize: 'vertical',
                lineHeight: '1.5'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>Min. recommended length: 150 characters</span>
              <span>{answer.length} characters</span>
            </div>
          </div>

          {/* Submit */}
          <button 
            className="btn btn-primary" 
            onClick={submitAnswer} 
            disabled={submitting || !answer.trim()}
            style={{ alignSelf: 'flex-end' }}
          >
            {submitting ? 'Evaluating...' : 'Submit Answer'} <Send size={12} />
          </button>

        </div>
      )}

      {/* STAGE 3: FEEDBACK / REPORT CARD */}
      {stage === 'feedback' && feedback && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Summary Score Card */}
          <div className="glass-panel" style={{
            background: 'linear-gradient(135deg, #18181b 0%, #09090b 100%)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '2rem',
            borderRadius: '0.5rem',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Performance Assessment</span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', margin: 0 }}>{feedback.rating}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '400px', margin: 0, lineHeight: '1.4' }}>
                {feedback.strengthsSummary}
              </p>
            </div>
            
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid var(--success)'
              }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--success)' }}>{feedback.score}</span>
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.4rem', fontWeight: 600 }}>OVERALL SCORE</span>
            </div>
          </div>

          {/* Action Points */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1.25rem 1.5rem', background: '#18181b', border: '1px solid var(--border-color)', borderRadius: '0.5rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fff', margin: 0 }}>
              <Award size={14} style={{ color: 'var(--primary)' }} /> Coaching Advice
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
              {feedback.improvementsSummary}
            </p>
          </div>

          {/* Detailed Question Review */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', margin: 0 }}>Question-by-Question Breakdown</h3>
            
            {feedback.evaluations.map((evalObj, idx) => (
              <div key={evalObj.questionId} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', padding: '1.25rem 1.5rem', background: '#18181b', border: '1px solid var(--border-color)', borderRadius: '0.5rem' }}>
                
                {/* Question Text */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                  <h4 style={{ fontWeight: 600, fontSize: '0.95rem', color: '#fff', margin: 0, lineHeight: '1.4' }}>
                    Q{idx + 1}: {evalObj.questionText}
                  </h4>
                  <span style={{
                    padding: '0.2rem 0.5rem',
                    background: evalObj.score >= 7 ? 'rgba(16,185,129,0.06)' : 'rgba(245,158,11,0.06)',
                    color: evalObj.score >= 7 ? 'var(--success)' : 'var(--warning)',
                    border: '1px solid ' + (evalObj.score >= 7 ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)'),
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    whiteSpace: 'nowrap'
                  }}>
                    {evalObj.score} / 10
                  </span>
                </div>

                {/* Student Answer */}
                <div style={{ background: '#09090b', padding: '0.85rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>YOUR RESPONSE:</div>
                  <p style={{ fontSize: '0.85rem', lineHeight: '1.5', color: '#d1d5db', fontStyle: 'italic', margin: 0 }}>
                    "{evalObj.answerText || 'No answer provided.'}"
                  </p>
                </div>

                {/* Strengths & Improvements */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.25rem' }}>
                  
                  {/* Strengths */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      <CheckCircle size={10} /> Key Strengths:
                    </div>
                    <ul style={{ paddingLeft: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4', margin: 0 }}>
                      {evalObj.strengths.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>

                  {/* Improvements */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      <ChevronRight size={10} /> Needs Work:
                    </div>
                    <ul style={{ paddingLeft: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4', margin: 0 }}>
                      {evalObj.improvements.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>

                </div>

              </div>
            ))}
          </div>

          <button className="btn btn-secondary animate-fade-in" onClick={() => setStage('select')} style={{ alignSelf: 'center', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            <RefreshCw size={12} /> Start Another Session
          </button>

        </div>
      )}

    </div>
  );
}
