import React, { useEffect, useRef, useState } from "react";
import "./Sidebar.css";

/* ---------- Icons ---------- */

const NewChatIcon = () => (
  <svg
    className="message-icon"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
);

const SearchIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const ChatBubbleIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const PencilIcon = () => (
  <svg
    className="pencil-edit"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

/* ---------- Sidebar Component ---------- */

const Sidebar = ({
  chats,
  activeChatId,
  open,
  onCreateNew,
  onSelect,
  onDelete,
  onRename,
  onClose,
}) => {
  const [search, setSearch] = useState("");
  const [hoverId, setHoverId] = useState(null);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState("");
  const [editingChatId, setEditingChatId] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const editInputRef = useRef(null);

  const filtered = search.trim()
    ? chats.filter((c) =>
        (c.title || "").toLowerCase().includes(search.trim().toLowerCase()),
      )
    : chats;

  useEffect(() => {
    if (editingChatId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingChatId]);

  const handleSaveEdit = (chatId) => {
    onRename(chatId, editingValue.trim() || "New chat");
    setEditingChatId(null);
    setEditingValue("");
  };

  return (
    <>
      <aside className={`chat-sidebar ${open ? "open" : ""}`}>
        {/* === SIDEBAR HEADER === */}
        <div className="sidebar-top">
          <div className="sidebar-top-row">
            {/* 🔥 CHANGE 2: inline SVG logo */}
            <div className="sidebar-logo">
              <h4>BackBench</h4>
              <h5>Buddy</h5>
              {/* <img src={logo} alt="Logo" className="sidebar-logo-img" /> */}
            </div>

            <button
              className="sidebar-close-btn"
              onClick={onClose}
              aria-label="Close sidebar"
            >
              ✕
            </button>
          </div>

          <div className="sidebar-divider" />

          <button
            className="sidebar-newchat-main"
            onClick={() => onCreateNew()}
          >
            ✏️ <span>New chat</span>
          </button>

          <div className="sidebar-divider" />
        </div>

        {/* ---------- Search ---------- */}
        <div className="sidebar-search-wrap">
          <SearchIcon />
          <input
            type="search"
            placeholder="Search chats..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sidebar-search"
          />
        </div>

        {/* ---------- Chat List ---------- */}
        <div className="sidebar-list">
          {filtered.length === 0 && (
            <div className="sidebar-empty">No chats yet</div>
          )}

          {filtered.map((c) => (
            <div
              key={c.id}
              className={`sidebar-item ${
                c.id === activeChatId ? "active" : ""
              }`}
              onClick={() => editingChatId !== c.id && onSelect(c)}
              onMouseEnter={() => setHoverId(c.id)}
              onMouseLeave={() => setHoverId(null)}
            >
              <ChatBubbleIcon />

              {editingChatId === c.id ? (
                <input
                  ref={editInputRef}
                  className="sidebar-title-input"
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  onBlur={() => handleSaveEdit(c.id)}
                  onKeyDown={(e) => e.key === "Enter" && handleSaveEdit(c.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span className="sidebar-title">{c.title || "New chat"}</span>
              )}

              {editingChatId !== c.id && (
                <button
                  className={`sidebar-edit ${
                    hoverId === c.id || c.id === activeChatId ? "visible" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingChatId(c.id);
                    setEditingValue(c.title || "New chat");
                  }}
                >
                  <PencilIcon />
                </button>
              )}

              <button
                className={`sidebar-delete ${
                  hoverId === c.id || c.id === activeChatId ? "visible" : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmDeleteId(c.id);
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </aside>

      {open && <div className="sidebar-backdrop" onClick={onClose} />}

      {confirmDeleteId && (
        <div
          className="sidebar-modal-overlay"
          onClick={() => setConfirmDeleteId(null)}
        >
          <div className="sidebar-modal" onClick={(e) => e.stopPropagation()}>
            <div>Are you sure you want to delete this chat?</div>
            <div className="sidebar-modal-actions">
              <button
                className="sidebar-modal-btn"
                onClick={() => setConfirmDeleteId(null)}
              >
                Cancel
              </button>
              <button
                className="sidebar-modal-btn danger"
                onClick={() => {
                  if (typeof onDelete === "function") onDelete(confirmDeleteId);
                  setConfirmDeleteId(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
