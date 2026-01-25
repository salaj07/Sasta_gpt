import React from "react";
import "./ChatHeader.css";

const HamburgerIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const ChatHeader = ({ onOpenSidebar, isSidebarOpen }) => {
  return (
    <header className="chat-header">
      <div className="chat-header-left">
        {/* MOBILE: always show */}
        <button
          type="button"
          className="btn-icon btn-sidebar-toggle mobile-only"
          onClick={onOpenSidebar}
          aria-label="Open sidebar"
        >
          <HamburgerIcon />
        </button>

        {/* DESKTOP: show ONLY when sidebar is closed */}
        {!isSidebarOpen && (
          <button
            type="button"
            className="btn-icon btn-sidebar-toggle desktop-only"
            onClick={onOpenSidebar}
            aria-label="Open sidebar"
          >
            <HamburgerIcon />
          </button>
        )}
      </div>

      <div className="chat-header-center">
        Sasta Classmate
      </div>

      <div className="chat-header-right" />
    </header>
  );
};

export default ChatHeader;
