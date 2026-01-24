import React, { useEffect, useRef, useState } from "react";
import "./Sidebar.css";

const NewChatIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
);

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const ChatBubbleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const PencilIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const Sidebar = ({
  chats,
  activeChatId,
  open,
  onCreateNew,
  onSelect,
  onDelete,
  onRename,
  userInitials = "SA",
}) => {
  const [search, setSearch] = useState("");
  const [hoverId, setHoverId] = useState(null);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState("");
  const [editingChatId, setEditingChatId] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const editInputRef = useRef(null);

  const filtered = search.trim()
    ? chats.filter((c) => (c.title || "").toLowerCase().includes(search.trim().toLowerCase()))
    : chats;

  useEffect(() => {
    if (editingChatId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingChatId]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setShowNewChatModal(false);
        setNewChatTitle("");
        if (editingChatId) {
          setEditingChatId(null);
          setEditingValue("");
        }
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [editingChatId]);

  const handleCreateFromModal = () => {
    onCreateNew(newChatTitle.trim() || undefined);
    setShowNewChatModal(false);
    setNewChatTitle("");
  };

  const handleStartEdit = (e, c) => {
    e.stopPropagation();
    setEditingChatId(c.id);
    setEditingValue(c.title || "New chat");
  };

  const handleSaveEdit = (chatId) => {
    onRename?.(chatId, editingValue.trim() || "New chat");
    setEditingChatId(null);
    setEditingValue("");
  };

  return (
    <aside className={`chat-sidebar ${open ? "open" : ""}`}>
      <div className="sidebar-nav">
        <button
          type="button"
          className="sidebar-nav-btn"
          onClick={() => setShowNewChatModal(true)}
          aria-label="New chat"
          title="New chat"
        >
          <NewChatIcon />
        </button>
        <div
          className="sidebar-nav-btn active"
          aria-current="page"
          title="Chats"
        >
          <ChatBubbleIcon />
        </div>
      </div>

      <div className="sidebar-search-wrap">
        <SearchIcon />
        <input
          type="search"
          placeholder="Search chats..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sidebar-search"
          aria-label="Search chats"
        />
      </div>

      <div className="sidebar-list">
        {filtered.length === 0 && (
          <div className="sidebar-empty">
            {search.trim() ? "No matches" : "No chats yet"}
          </div>
        )}
        {filtered.map((c) => (
          <div
            key={c.id}
            className={`sidebar-item ${c.id === activeChatId ? "active" : ""}`}
            onClick={() => {
              if (editingChatId !== c.id) onSelect(c);
            }}
            onMouseEnter={() => setHoverId(c.id)}
            onMouseLeave={() => setHoverId(null)}
          >
            <ChatBubbleIcon />
            {editingChatId === c.id ? (
              <input
                ref={editInputRef}
                type="text"
                className="sidebar-title-input"
                value={editingValue}
                onChange={(e) => setEditingValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSaveEdit(c.id);
                  }
                  e.stopPropagation();
                }}
                onBlur={() => handleSaveEdit(c.id)}
                onClick={(e) => e.stopPropagation()}
                aria-label="Rename chat"
              />
            ) : (
              <span className="sidebar-title">{c.title || "New chat"}</span>
            )}
            {editingChatId !== c.id && (
              <button
                type="button"
                className={`sidebar-edit ${hoverId === c.id || c.id === activeChatId ? "visible" : ""}`}
                onClick={(e) => handleStartEdit(e, c)}
                aria-label={`Rename ${c.title || "chat"}`}
                title="Rename chat"
              >
                <PencilIcon />
              </button>
            )}
            <button
              type="button"
              className={`sidebar-delete ${hoverId === c.id || c.id === activeChatId ? "visible" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(c.id);
              }}
              aria-label={`Delete ${c.title || "chat"}`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* New chat modal */}
      {showNewChatModal && (
        <div
          className="sidebar-modal-overlay"
          onClick={() => {
            setShowNewChatModal(false);
            setNewChatTitle("");
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="new-chat-modal-title"
        >
          <div
            className="sidebar-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="new-chat-modal-title" className="sidebar-modal-title">New chat</h3>
            <p className="sidebar-modal-hint">Chat title (optional)</p>
            <input
              type="text"
              className="sidebar-modal-input"
              placeholder="e.g. Project ideas, Homework help"
              value={newChatTitle}
              onChange={(e) => setNewChatTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleCreateFromModal();
                }
              }}
              autoFocus
              aria-label="Chat title (optional)"
            />
            <div className="sidebar-modal-actions">
              <button
                type="button"
                className="sidebar-modal-btn secondary"
                onClick={() => {
                  setShowNewChatModal(false);
                  setNewChatTitle("");
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="sidebar-modal-btn primary"
                onClick={handleCreateFromModal}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
