const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const aiService = require("../services/ai.service");
const messageModel = require("../models/message.model");
const { createMemory, queryMemory } = require("../services/vector.service");
const {
  messagesValidation,
} = require("@pinecone-database/pinecone/dist/assistant/data/chat");

async function initSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  //middleware for socket authentication
  io.use(async (socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
    // postman-> socket-> cookie-> send token manually

    // console.log(cookies);

    // If token cookie is missing, allow connection for local debugging but mark as guest.
    if (!cookies.token) {
      // don't block connection in dev — allow guest sockets for testing
      socket.user = null;
      return next();
    }

    try {
      const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);
      const user = await userModel.findById(decoded.id);
      socket.user = user;
      next();
    } catch (err) {
      // invalid token -> treat as guest for debugging to avoid blocking websocket upgrade
      console.warn("socket auth failed, proceeding as guest:", err.message);
      socket.user = null;
      next();
    }
  });

  io.on("connection", async (socket) => {
    // console.log(" new socket connection",socket.id);

    socket.on("ai-message", async (messagePayload) => {
      // If the socket is unauthenticated (guest), log and return a quick mock response
      if (!socket.user) {
        console.log(
          "Guest message received — logging only, not invoking AI or DB.",
        );

        socket.emit("ai-response", {
          content: `Logged (guest): ${messagePayload.content}`,
          chat: messagePayload.chat,
        });
        return;
      }

      const [message, vectors] = await Promise.all([
        messageModel.create({
          chat: messagePayload.chat,
          user: socket.user.id,
          content: messagePayload.content,
          role: "user",
        }),

        aiService.generateVector(messagePayload.content),
      ]);

      await createMemory({
        vectors,
        messageId: message._id,
        metadata: {
          chat: messagePayload.chat,
          user: socket.user._id,
          text: messagePayload.content,
        },
      });

      const [memory, chatHistory] = await Promise.all([
        queryMemory({
          queryVector: vectors,
          limit: 3,
          metadata: {
            chat: messagePayload.chat,
            user: socket.user._id,
          },
        }),
        messageModel
          .find({
            chat: messagePayload.chat,
          })
          .sort({ createdAt: -1 })
          .limit(3)
          .lean()
          .then((messages) => messages.reverse()),
      ]);

      // short term memory for the chat

      const stm = chatHistory.map((items) => {
        return {
          role: items.role,
          parts: [{ text: items.content }],
        };
      });

      // long term memory from the vector DB
      const ltm = [
        {
          role: "user",
          parts: [
            {
              text: `
        there is some relevant context from the past conversation and memories:

        ${memory.map((items) => items.metadata.text).join("\n")}
        `,
            },
          ],
        },
      ];

  

      let response;

      try {
        response = await aiService.generateResponse([...ltm, ...stm]);
        console.log("AI RESPONSE GENERATED:", response);
      } catch (err) {
        console.error("AI ERROR:", err.message);

        socket.emit("ai-response", {
          content:
            "⚠️ AI servers are busy right now. Please try again in a few seconds.",
          chat: messagePayload.chat,
        });
        return;
      }

      socket.emit("ai-response", {
        content: response,
        chat: messagePayload.chat,
      });


      const responseMessage = await messageModel.create({
        chat: messagePayload.chat,
        user: socket.user.id,
        content: response,
        role: "model",
      });

      const responseVector = await aiService.generateVector(response);

      await createMemory({
        vectors: responseVector,
        messageId: responseMessage._id,
        metadata: {
          chat: messagePayload.chat,
          user: socket.user._id,
          text: response,
        },
      });
    });
  });
}

module.exports = initSocketServer;
