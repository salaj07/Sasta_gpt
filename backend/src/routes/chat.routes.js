const express=require('express');
const authMiddleware=require('../middlewares/auth.middlewares')
const chatController=require('../controllers/chat.controller')
const router=express.Router()

// /api/chat/
/* post API to create a new chat */
router.post('/',authMiddleware.authUser,chatController.createChat)

/* get API to get all chats */
router.get('/',authMiddleware.authUser,chatController.getChats)

module.exports=router;