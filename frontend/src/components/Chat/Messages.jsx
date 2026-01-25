import React from "react";
import "./Messages.css";
import ReactMarkdown from "react-markdown";

const Messages = ({ messages, containerRef, isWaiting }) => {
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
                <div className="bubble bubble-user">
                  {m.text}
                </div>
              ) : (
                <div className="message-ai-block">
                  <div className="bubble-ai">
                    <ReactMarkdown>
                      {m.text}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          ))}

          {isWaiting && (
            <div className="message message-ai">
              <div className="message-ai-block">
                <div className="typing-indicator" aria-busy="true">
                  <span></span>
                  <span></span>
                  <span></span>
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
