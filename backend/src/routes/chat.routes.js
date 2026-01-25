const express = require("express");
const authMiddleware = require("../middlewares/auth.middlewares");
const chatController = require("../controllers/chat.controller");
const router = express.Router();

// /api/chat/
/* post API to create a new chat */
// router.post('/',authMiddleware.authUser,chatController.createChat)

// /* get API to get all chats */
// router.get('/',authMiddleware.authUser,chatController.getChats)

// router.get(
//   "/messages/:chatId",
//   authMiddleware.authUser,
//   chatController.getChatMessages
// );

router.post("/", authMiddleware.authUser, chatController.createChat);

/* Get all chats */
router.get("/", authMiddleware.authUser, chatController.getChats);

/* Rename chat */
router.put("/:chatId", authMiddleware.authUser, chatController.renameChat);

/* Delete chat */
router.delete("/:chatId", authMiddleware.authUser, chatController.deleteChat);

/* Get messages of a chat */
router.get(
  "/messages/:chatId",
  authMiddleware.authUser,
  chatController.getChatMessages,
);

module.exports = router;
