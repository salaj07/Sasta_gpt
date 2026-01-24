import React, { useState, useRef, useEffect } from "react";
import "./ChatHeader.css";

/* const ChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9l6 6 6-6" />
  </svg>
); */

const ShareIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" y1="2" x2="12" y2="15" />
  </svg>
);

const MenuIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
);

const MenuIconHamburger = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="18" x2="20" y2="18" />
  </svg>
);

const ChatHeader = ({ title, onToggleSidebar, appName = "ChatGPT 5.2" }) => {
  const [modelOpen, setModelOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const modelRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (modelRef.current && !modelRef.current.contains(e.target)) setModelOpen(false);
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  return (
    <header className="chat-header">
      <div className="chat-header-left">
        <button
          type="button"
          className="btn-icon btn-sidebar-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <MenuIconHamburger />
        </button>
        {/* <div className="chat-header-brand" ref={modelRef}>
          <button
            type="button"
            className="btn-model"
            onClick={() => setModelOpen((o) => !o)}
            aria-expanded={modelOpen}
            aria-haspopup="listbox"
          >
            <span className="brand-name">{appName}</span>
            <span className="chevron" aria-hidden="true"><ChevronDown /></span>
          </button>
          {modelOpen && (
            <div className="model-dropdown" role="listbox">
              <div className="model-option" role="option">GPT-4o</div>
              <div className="model-option" role="option">GPT-4o mini</div>
              <div className="model-option" role="option">GPT-4</div>
            </div>
          )}
        </div> */}
      </div>

      <div className="chat-header-right">
        <button type="button" className="btn-share" aria-label="Share">
          <ShareIcon />
          <span>Share</span>
        </button>
        <div className="chat-header-menu" ref={menuRef}>
          <button
            type="button"
            className="btn-icon btn-menu"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            aria-label="More options"
          >
            <MenuIcon />
          </button>
          {menuOpen && (
            <div className="header-dropdown" role="menu">
              <button type="button" className="dropdown-item" onClick={() => { setMenuOpen(false); onToggleSidebar(); }}>Toggle sidebar</button>
              <button type="button" className="dropdown-item">Settings</button>
              <button type="button" className="dropdown-item">Help</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
