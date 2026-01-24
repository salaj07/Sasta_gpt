import React, { useEffect, useRef, useState } from "react";
import "../styles/theme.css";
import "../components/Chat/Layout.css";
import Sidebar from "../components/Chat/Sidebar";
import ChatHeader from "../components/Chat/ChatHeader";
import Messages from "../components/Chat/Messages";
import Composer from "../components/Chat/Composer";

import axios from "axios";  

/**
 * @typedef {Object} Message
 * @property {string} id
 * @property {'user' | 'ai'} role
 * @property {string} text
 */

/**
 * @typedef {Object} Chat
 * @property {string} id
 * @property {string} title
 * @property {Message[]} messages
 */

const STORAGE_KEY = "gpt_clone_chats_v1";

const makeId = () => String(Date.now());

const Home = () => {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const [isWaiting, setIsWaiting] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setShowSidebar(window.innerWidth >= 880);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setShowSidebar(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  /* fetch chats from API on load */
  useEffect(() => {
    async function fetchChats() {
      try {
        const res = await axios.get("http://localhost:3000/api/chat/", {
          withCredentials: true,
        });
  
        const list = (res.data.chats || []).map((c) => ({
          id: c._id,
          title: c.title || "New chat",
          messages: c.messages || [],
        }));
        setChats(list.reverse());
        if (list.length > 0) {
          setActiveChatId(list[0].id);
          setMessages(list[0].messages || []);
        }
      } catch (err) {
        console.error("Failed to fetch chats:", err);
      }
    }

    
    fetchChats();
  }, []);



  useEffect(() => {
    // scroll to bottom on new messages
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    // persist chats when chats change
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
    } catch (err) {
      console.error("Failed to save chats:", err);
    }
  }, [chats]);

  const saveActiveMessages = (updater) => {
    setMessages((prevMsgs) => {
      const nextMessages =
        typeof updater === "function" ? updater(prevMsgs) : updater;
      setChats((prev) =>
        prev.map((c) =>
          c.id === activeChatId
            ? { ...c, messages: nextMessages, title: deriveTitle(nextMessages) }
            : c,
        ),
      );
  
   
      return nextMessages;
    
    });

    
  };

  const deriveTitle = (msgs) => {
    const firstUser = msgs.find((m) => m.role === "user");
    if (!firstUser) return "New chat";
    return (
      firstUser.text.slice(0, 32) + (firstUser.text.length > 32 ? "…" : "")
    );
  };

  const createNewChat = async (optionalTitle) => {
    const title = (optionalTitle && String(optionalTitle).trim())
      ? String(optionalTitle).trim()
      : "New chat";
      

    const response = await axios.post(
      "http://localhost:3000/api/chat/",
      { title },
      { withCredentials: true }
    );

    const chat = response.data.chat;
    const newChat = { id: chat._id, title: chat.title, messages: [] };
    setChats((s) => [newChat, ...s]);
    setActiveChatId(chat._id);
    setMessages([]);

    if (window.innerWidth < 880) setShowSidebar(false);
  };

  const renameChat = (chatId, newTitle) => {
    const title = (newTitle && String(newTitle).trim()) ? String(newTitle).trim() : "New chat";
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, title } : c)),
    );
  };

  const selectChat = (chat) => {
    setActiveChatId(chat.id);
    setMessages(chat.messages || []);
    if (window.innerWidth < 880) setShowSidebar(false);
  };

  const mockAiReply = (text) => {
    const lower = text.toLowerCase();
    if (/hello|hi|hey/.test(lower)) return "Hey 👋\n\nHello! How's it going? 😊";
    if (/how are you|how're you/.test(lower)) return "I'm doing great, thanks for asking! How can I help you today?";
    return `I received your message — "${text}". This is a mock reply; connect a real API for full responses.`;
  };

  const sendMessage = (optionalText) => {
    const trimmed = (optionalText ?? input.trim()).trim();
    if (!trimmed) return;
    const userMsg = { id: makeId(), role: "user", text: trimmed };
    saveActiveMessages((prev) => [...prev, userMsg]);
    if (optionalText == null) setInput("");
    setIsWaiting(true);

    setTimeout(() => {
      const aiMsg = { id: makeId(), role: "ai", text: mockAiReply(trimmed) };
      saveActiveMessages((prev) => [...prev, aiMsg]);
      setIsWaiting(false);
    }, 700 + Math.random() * 800);
  };

  const handleRegenerate = (aiMessage) => {
    const idx = messages.findIndex((m) => m.id === aiMessage?.id);
    if (idx < 0) return;
    const userMsg = messages[idx - 1];
    if (!userMsg || userMsg.role !== "user") return;
    saveActiveMessages((prev) => prev.slice(0, idx - 1));
    sendMessage(userMsg.text);
  };

  const deleteChat = (id) => {
    setChats((prev) => {
      const next = prev.filter((c) => c.id !== id);
      if (id === activeChatId) {
        if (next.length > 0) {
          setActiveChatId(next[0].id);
          setMessages(next[0].messages || []);
        } 
        
       
      }
      return next;
    });
  };

  return (
    <div className={`chat-page ${showSidebar ? "" : "sidebar-hidden"}`}>
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        open={showSidebar}
        onCreateNew={createNewChat}
        onSelect={selectChat}
        onDelete={deleteChat}
        onRename={renameChat}
      />

      {showSidebar && (
        <div
          className="sidebar-backdrop"
          onClick={() => setShowSidebar(false)}
          aria-hidden="true"
        />
      )}

      <div className="chat-main">
        <ChatHeader
          onToggleSidebar={() => setShowSidebar((s) => !s)}
        />

        <div className="messages-wrapper">
          <Messages
            messages={messages}
            containerRef={messagesEndRef}
            isWaiting={isWaiting}
            onRegenerate={handleRegenerate}
          />
        </div>

        <div className="composer-wrapper">
          <Composer input={input} setInput={setInput} onSend={sendMessage} />
        </div>
      </div>
    </div>
  );
};

export default Home;
