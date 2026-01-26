# 📚 BackBench Buddy – Your Desi Study Partner Chatbot

BackBench Buddy is an AI-powered study partner chatbot designed to make learning fun, friendly, and stress-free.  
It communicates like a supportive desi friend while helping users understand technical and academic concepts clearly.

> _“Chill maar! Padhai ho jaayegi.”_

---

## 🚀 Overview

BackBench Buddy is built as a hands-on learning project to explore modern chatbot architectures, real-time communication, and AI-powered knowledge retrieval systems.  
The bot focuses on being engaging, concise, and encouraging rather than overwhelming users with long explanations.

---

## ✨ Key Features

- 💬 Real-time chat using **WebSockets / Socket.IO**
- ⚡ Backend APIs built with **Express.js**
- 🧠 Context-aware responses using **Short-Term Memory (STM)** and **Long-Term Memory (LTM)**
- 🔍 **Retrieval-Augmented Generation (RAG)** for accurate and relevant answers
- 📦 Vector database for semantic search
- 🧬 **Gemini Embeddings** for text vectorization
- ⚛️ Interactive and responsive **React** frontend

---

## 🧠 Bot Personality (High-Level)

- Friendly and desi in tone  
- Acts as a study partner, not a lecturer  
- Keeps explanations short, clear, and engaging  
- Encouraging, supportive, and slightly mischievous  

*(Detailed prompting rules are intentionally kept internal.)*

---

## 🧠 System Architecture (High-Level Flow)

1. User sends a message from the **React frontend**
2. Message is transmitted via **Socket.IO**
3. Backend (**Node.js + Express**) handles API routes and socket events
4. Relevant context is retrieved from:
   - **STM** – recent conversation context
   - **LTM** – stored knowledge in vector database
5. **RAG pipeline** fetches the most relevant data
6. **Gemini Embeddings** perform semantic similarity search
7. BackBench Buddy generates a friendly, contextual response

---

## 🛠️ Tech Stack

### Frontend
- ⚛️ React
- Socket.IO Client
- Modern chat-based UI

### Backend
- 🟢 Node.js
- 🚀 Express.js
- 🔌 Socket.IO
- REST APIs + real-time communication

### AI & Data
- 🧠 Gemini Embeddings
- 📊 Vector Database
- STM & LTM memory handling
- Retrieval-Augmented Generation (RAG)

---

## 🎯 Learning Objectives

This project was created to gain practical understanding of:

- Express.js backend development
- WebSockets and Socket.IO
- Real-time chat applications
- Short-term vs long-term memory in chatbots
- Vector databases and embeddings
- RAG-based AI systems
- Full-stack integration with React

---

## 📌 Future Enhancements

- 📚 Topic-wise long-term memory segmentation
- 🧠 Smarter memory pruning strategies
- 🌗 Dark mode UI
- 📈 Learning progress insights

---

## 🤝 Contributing

Contributions, ideas, and improvements are welcome.  
Feel free to fork the repository and submit pull requests.

---

## 😎 Final Note

BackBench Buddy isn’t just a chatbot —  
it’s that dost who sits at the back and says:

**“Exam aa raha hai? Arre wah, chal padhte hain!” 💪📖**
