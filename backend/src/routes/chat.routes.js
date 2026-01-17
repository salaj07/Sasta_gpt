const express=require('express');
const authMiddleware=require('../middlewares/auth.middlewares')
const chatController=require('../controllers/chat.controller')
const router=express.Router()

// /api/chat/

router.post('/',authMiddleware.authUser,chatController.createChat)

module.exports=router;