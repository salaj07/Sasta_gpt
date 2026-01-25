import React, { useEffect, useRef } from "react";
import "./Composer.css";

const SendIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </svg>
);

const MAX_HEIGHT = 100; // px

const Composer = ({ input = "", setInput, onSend }) => {
  const textareaRef = useRef(null);
  const trimmed = input.trim();

  /* 🔹 Auto grow textarea */
  // useEffect(() => {
  //   const textarea = textareaRef.current;
  //   if (!textarea) return;

  //   textarea.style.height = "auto";

  //   const newHeight = Math.min(textarea.scrollHeight, MAX_HEIGHT);
  //   textarea.style.height = newHeight + "px";
  // }, [input]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (trimmed) onSend();
    }
  };

  return (
    <div className="composer" role="region" aria-label="Message composer">
      <textarea
        ref={textareaRef}
        className="compose-input"
        contenteditable="true"
        placeholder="Ask anything"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
        aria-label="Message input"
      />

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
  );
};

export default Composer;
