import React from "react";
import "./Composer.css";

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
);

const MicIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </svg>
);

const Composer = ({ input = "", setInput, onSend }) => {
  const trimmed = input.trim();

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (trimmed) onSend();
    }
  };

  return (
    <div className="composer" role="region" aria-label="Message composer">
      {/* <button
        type="button"
        className="composer-plus btn-icon"
        title="Attach or add"
        aria-label="Attach"
      >
        <PlusIcon />
      </button> */}

      <textarea
        className="compose-input"
        placeholder="Ask anything"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
        aria-label="Message input"
      />

      <div className="composer-actions">
        {/* <button
          type="button"
          className="composer-mic btn-icon"
          title="Voice input"
          aria-label="Voice input"
        >
          <MicIcon />
        </button> */}
        <button
          type="button"
          className="composer-send btn-icon"
          onClick={() => trimmed && onSend()}
          disabled={!trimmed}
          aria-label="Send message"
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
};

export default Composer;
