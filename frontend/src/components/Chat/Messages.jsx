import React, { useState } from "react";
import "./Messages.css";

const ThumbsUp = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 11v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1z" />
    <path d="M11 10h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2l1-4h4" />
  </svg>
);

const ThumbsDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 15v4a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-4" />
    <path d="M18 9V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v4" />
    <path d="M2 10h3a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2" />
  </svg>
);

const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const RegenerateIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

const MoreIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
);

const MessageActions = ({ text, onCopy, onRegenerate }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy?.(text);
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="message-actions" role="toolbar" aria-label="Message actions">
      <button type="button" className="msg-action" title="Good response" aria-label="Good response"><ThumbsUp /></button>
      <button type="button" className="msg-action" title="Bad response" aria-label="Bad response"><ThumbsDown /></button>
      <button
        type="button"
        className="msg-action"
        title={copied ? "Copied!" : "Copy"}
        aria-label="Copy"
        onClick={handleCopy}
      >
        <CopyIcon />
      </button>
      <button type="button" className="msg-action" title="Edit" aria-label="Edit">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      </button>
      <button
        type="button"
        className="msg-action"
        title="Regenerate"
        aria-label="Regenerate"
        onClick={() => onRegenerate?.()}
      >
        <RegenerateIcon />
      </button>
      <button type="button" className="msg-action" title="More" aria-label="More options"><MoreIcon /></button>
    </div>
  );
};

const Messages = ({ messages, containerRef, isWaiting, onRegenerate }) => {
  return (
    <div className="messages" role="log" aria-live="polite">
      {messages.length === 0 && !isWaiting ? (
        <div className="welcome">
          <p className="welcome-title">How can I help you today?</p>
          <p className="welcome-sub">Send a message to get started.</p>
          <div ref={containerRef} />
        </div>
      ) : (
        <>
          {messages.map((m) => (
            <div key={m.id} className={`message message-${m.role}`}>
              {m.role === "user" ? (
                <div className="bubble bubble-user">{m.text}</div>
              ) : (
                <div className="message-ai-block">
                  <div className="bubble-ai">{m.text}</div>
                  <MessageActions
                    text={m.text}
                    onRegenerate={() => onRegenerate?.(m)}
                  />
                </div>
              )}
            </div>
          ))}
          {isWaiting && (
            <div className="message message-ai">
              <div className="message-ai-block">
                <div className="typing-indicator" aria-busy="true">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={containerRef} />
        </>
      )}
    </div>
  );
};

export default Messages;
