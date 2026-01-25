import React, { useState } from 'react';

const AIChatPanel: React.FC = () => {
  const [messages, setMessages] = useState<Array<{from: 'user' | 'ai'; text: string}>>([
    { from: 'ai', text: 'Hi — I\'m your health assistant. Tell me how you\'re feeling or ask about your recent readings.' }
  ]);
  const [value, setValue] = useState('');

  const send = () => {
    if (!value.trim()) return;
    const userMsg = { from: 'user' as const, text: value.trim() };
    setMessages(prev => [...prev, userMsg, { from: 'ai', text: 'Thanks — I recommend tracking consistently and speaking with your provider for concerning trends.' }]);
    setValue('');
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div className="card-header">AI Health Assistant</div>
      <div style={{ maxHeight: 260, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ alignSelf: m.from === 'ai' ? 'flex-start' : 'flex-end', background: m.from === 'ai' ? '#f3fff3' : '#eef3ff', padding: '0.6rem 0.9rem', borderRadius: 10, maxWidth: '80%' }}>
            <div style={{ fontSize: '0.95rem', color: 'var(--muted)' }}>{m.text}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
        <input className="form-input" value={value} onChange={e => setValue(e.target.value)} placeholder="Ask about symptoms, readings, or tips..." />
        <button className="btn btn-primary" onClick={send}>Send</button>
      </div>
    </div>
  );
};

export default AIChatPanel;
