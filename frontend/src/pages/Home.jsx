import React, { useEffect, useRef, useState } from "react";
import "../styles/theme.css";
import "../components/Layout/Layout.css";
import Sidebar from "../components/Chat/Sidebar";
import ChatHeader from "../components/Chat/ChatHeader";
import Messages from "../components/Chat/Messages";
import Composer from "../components/Chat/Composer";
import { io } from "socket.io-client";
import axios from "axios";

const makeId = () => Date.now().toString();

const Home = () => {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const [isWaiting, setIsWaiting] = useState(false);
  const [socket, setSocket] = useState(null);
  const waitingRef = useRef(false);

  const messagesEndRef = useRef(null);
  const activeChatIdRef = useRef(null);

  /* keep active chat ref updated for socket */
  useEffect(() => {
    activeChatIdRef.current = activeChatId;
  }, [activeChatId]);

  /* responsive sidebar */
  useEffect(() => {
    const handleResize = () => setShowSidebar(window.innerWidth >= 880);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* INITIAL LOAD (NO CHAT AUTO OPEN) */
  useEffect(() => {
    let tempSocket;

    async function init() {
      try {
        const res = await axios.get("http://localhost:3000/api/chat", {
          withCredentials: true,
        });

        setChats(
          (res.data.chats || [])
            .map((c) => ({
              id: c._id,
              title: c.title || "New chat",
            }))
            .reverse(),
        );

        setActiveChatId(null);
        setMessages([]);

        tempSocket = io("http://localhost:3000", {
          withCredentials: true,
        });

        tempSocket.on("ai-response", (data) => {
          if (!data?.content) return;

          setMessages((prev) => [
            ...prev,
            { id: makeId(), role: "ai", text: data.content },
          ]);

          requestAnimationFrame(() => {
            if (waitingRef.current) {
              setIsWaiting(false);
              waitingRef.current = false;
            }
          });
        });

        setSocket(tempSocket);
      } catch (err) {
        console.error("Init failed:", err);
      }
    }

    init();
    return () => tempSocket?.disconnect();
  }, []);

  /* auto scroll */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* CHAT ACTIONS */

  const createNewChat = async (optionalTitle) => {
    const title =
      optionalTitle && optionalTitle.trim() ? optionalTitle.trim() : "New chat";

    const response = await axios.post(
      "http://localhost:3000/api/chat",
      { title },
      { withCredentials: true },
    );

    const chat = response.data.chat;

    const newChat = {
      id: chat._id,
      title: chat.title, // ✅ USE BACKEND TITLE
      messages: [],
    };

    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(chat._id);
    setMessages([]);
  };

  const selectChat = async (chat) => {
    setActiveChatId(chat.id);
    setIsWaiting(false);

    const res = await axios.get(
      `http://localhost:3000/api/chat/messages/${chat.id}`,
      { withCredentials: true },
    );

    setMessages(res.data.messages || []);
    if (window.innerWidth < 880) setShowSidebar(false);
  };

  const renameChat = async (chatId, title) => {
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, title } : c)),
    );

    await axios.put(
      `http://localhost:3000/api/chat/${chatId}`,
      { title },
      { withCredentials: true },
    );
  };

  const deleteChat = async (chatId) => {
    setChats((prev) => prev.filter((c) => c.id !== chatId));
    if (chatId === activeChatId) {
      setActiveChatId(null);
      setMessages([]);
    }

    await axios.delete(`http://localhost:3000/api/chat/${chatId}`, {
      withCredentials: true,
    });
  };

  /* SEND MESSAGE */

  const sendMessage = () => {
    if (!input.trim() || !socket || !activeChatId) return;

    const userMsg = {
      id: makeId(),
      role: "user",
      text: input.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    waitingRef.current = true;
    setIsWaiting(true);

    socket.emit("ai-message", {
      content: userMsg.text,
      chat: activeChatId,
    });
  };

  /* RENDER */

  return (
    <div className={`chat-page ${showSidebar ? "" : "sidebar-hidden"}`}>
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        open={showSidebar}
        onCreateNew={createNewChat}
        onSelect={selectChat}
        onRename={renameChat}
        onDelete={deleteChat}
        onClose={() => setShowSidebar(false)}
      />

      <div className="chat-main">
        <ChatHeader
          onOpenSidebar={() => setShowSidebar(true)}
          isSidebarOpen={showSidebar}
        />

        {/* WELCOME / HOME SCREEN */}
        {!activeChatId ? (
          <div className="chat-welcome">
            <div className="chat-welcome-card">
              <h1 className="chat-welcome-title">
                Hey 👋 I’m <span>Backbench</span> <span style={{ color: "white" }}>Buddy</span>
              </h1>

              <p className="chat-welcome-text">
                Your friendly AI buddy for doubts, explanations, coding help,
                and last-minute study support — without judging 😄
              </p>

              <button
                className="start-chat-btn"
                onClick={() => createNewChat()}
              >
                Start Chat
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="messages-wrapper">
              <Messages
                messages={messages}
                containerRef={messagesEndRef}
                isWaiting={isWaiting}
              />
            </div>

            <div className="composer-wrapper">
              <Composer
                input={input}
                setInput={setInput}
                onSend={sendMessage}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
