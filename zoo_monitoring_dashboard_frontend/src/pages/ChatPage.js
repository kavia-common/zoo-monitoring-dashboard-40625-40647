import React, { useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * ChatPage
 * Simple chat UI with mock messages and action buttons.
 */
function ChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, who: 'bot', text: 'Hello! How can I assist with the Giant Anteater monitoring today?' },
    { id: 2, who: 'me', text: 'Show me pacing events from this morning.' },
    { id: 3, who: 'bot', text: 'I found 4 pacing events between 08:00 and 12:00.' },
  ]);
  const [text, setText] = useState('');

  const send = () => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), who: 'me', text }]);
    setText('');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <div className="container">
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: 12, borderBottom: '1px solid var(--border)' }}>
            <strong>AI Assistant</strong>
          </div>
          <div style={{ padding: 16, height: 420, overflowY: 'auto', background: 'var(--surface)' }}>
            <div style={{ display: 'grid', gap: 12 }}>
              {messages.map(m => (
                <div key={m.id} style={{ display: 'flex', justifyContent: m.who === 'me' ? 'flex-end' : 'flex-start' }}>
                  <div
                    style={{
                      maxWidth: '70%',
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
          <div style={{ padding: 12, borderTop: '1px solid var(--border)', display: 'grid', gap: 8 }}>
            <div className="row">
              <button className="btn btn-primary" aria-label="Action View Timeline">View Timeline</button>
              <button className="btn btn-primary" aria-label="Action Show Video">Show Video</button>
              <button className="btn btn-primary" aria-label="Action Generate Report">Generate Report</button>
            </div>
            <div className="row" style={{ alignItems: 'center' }}>
              <input
                className="input"
                aria-label="Chat input"
                placeholder="Type your message..."
                value={text}
                onChange={e => setText(e.target.value)}
              />
              <button className="btn btn-primary" onClick={send} aria-label="Send message">Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
