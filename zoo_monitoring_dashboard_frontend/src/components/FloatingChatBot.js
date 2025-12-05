import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * FloatingChatBot
 * A persistent floating button (bottom-right) that opens a chat window with message bubbles and action buttons.
 */
function FloatingChatBot() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, who: 'bot', text: 'Hi! Need help with the Giant Anteater data?' }
  ]);
  const navigate = useNavigate();

  const send = () => {
    if (!text.trim()) return;
    const myMsg = { id: Date.now(), who: 'me', text };
    setMessages(prev => [...prev, myMsg, { id: Date.now() + 1, who: 'bot', text: 'Got it. Try opening the Timeline, a Video, or Generate a Report.' }]);
    setText('');
  };

  const size = open ? 420 : 0;

  return (
    <>
      {/* Floating button */}
      <button
        aria-label="Open assistant chat"
        className="btn btn-primary"
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed',
          right: 20,
          bottom: 20,
          zIndex: 60,
          borderRadius: 999,
          boxShadow: 'var(--shadow)'
        }}
        title="Assistant"
      >
        {open ? 'Close' : 'Ask Assistant'}
      </button>

      {/* Chat window */}
      {open && (
        <div
          className="card"
          role="dialog"
          aria-modal="false"
          aria-label="Assistant chat window"
          style={{
            position: 'fixed',
            right: 20,
            bottom: 76,
            width: 420,
            maxWidth: '94vw',
            height: 480,
            display: 'grid',
            gridTemplateRows: 'auto 1fr auto',
            boxShadow: 'var(--shadow)',
            zIndex: 60,
            overflow: 'hidden',
            borderRadius: 'var(--radius)'
          }}
        >
          <div className="header-gradient" style={{ padding: 12, borderBottom: '1px solid var(--border)' }}>
            <strong>Assistant</strong>
            <div className="subtle">Ask about behaviors, reports, or open pages directly</div>
          </div>
          <div style={{ padding: 12, overflowY: 'auto', background: 'var(--surface)' }}>
            <div style={{ display: 'grid', gap: 10 }}>
              {messages.map(m => (
                <div key={m.id} style={{ display: 'flex', justifyContent: m.who === 'me' ? 'flex-end' : 'flex-start' }}>
                  <div
                    style={{
                      maxWidth: '75%',
                      padding: '10px 12px',
                      borderRadius: 14,
                      border: m.who === 'me' ? 'none' : '1px solid var(--border)',
                      background: m.who === 'me' ? 'var(--primary)' : 'var(--surface)',
                      color: m.who === 'me' ? '#fff' : 'var(--text)'
                    }}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: 12, borderTop: '1px solid var(--border)', display: 'grid', gap: 8, background: 'var(--surface)' }}>
            <div className="row">
              <button className="btn btn-primary" onClick={() => navigate('/timeline')} aria-label="Open Timeline">Timeline</button>
              <button className="btn btn-primary" onClick={() => navigate('/reports')} aria-label="Open Reports">Reports</button>
              <button className="btn btn-primary" onClick={() => navigate('/analytics')} aria-label="Open Analytics">Analytics</button>
            </div>
            <div className="row">
              <input
                className="input"
                placeholder="Ask something..."
                aria-label="VizAi chat input"
                value={text}
                onChange={e => setText(e.target.value)}
              />
              <button className="btn btn-primary" onClick={send} aria-label="Send">Send</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default FloatingChatBot;
