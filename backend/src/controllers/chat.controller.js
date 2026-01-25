const chatModel=require('../models/chat.model')
const messageModel = require("../models/message.model");
// const { deleteChatMemory } = require("../services/vector.service");
const { deleteChatMemoryByIds } = require("../services/vector.service");

async function createChat(req,res){

    const {title}=req.body;
    const user=req.user;

    const chat=await chatModel.create({
        user:user._id,
        title
    })

    res.status(201).json({
        message:"chat created successfully",
        chat:{
            _id:chat._id,
            title:chat.title,
            lastActivity:chat.lastActivity,
            user:chat.user
        }
    })

}

async function getChats(req,res){
    const user=req.user;
    const chats=await chatModel.find({user:user._id});
    res.status(200).json({
        message:"chats fetched successfully",
        chats:chats.map(chat =>({
            _id:chat._id,
            title:chat.title,
            lastActivity:chat.lastActivity,
            user:chat.user
        }))
    })
}


async function getChatMessages(req,res){

    try {
    const { chatId } = req.params;

    const messages = await messageModel
      .find({ chat: chatId })
      .sort({ createdAt: 1 }) // oldest → newest
      .lean();

    res.status(200).json({
      success: true,
      messages: messages.map((m) => ({
        id: m._id,
        role: m.role === "model" ? "ai" : m.role,
        text: m.content,
      })),
    });
  } catch (err) {
    console.error("Failed to fetch messages:", err);
    res.status(500).json({ success: false });
  }


}

async function renameChat(req, res) {
 try {
    const { chatId } = req.params;
    const { title } = req.body;

    const chat = await chatModel.findOneAndUpdate(
      { _id: chatId, user: req.user._id }, // 🔐 ownership check
      { title },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({ success: false });
    }

    res.status(200).json({ success: true, chat });
  } catch (err) {
    console.error("Rename chat error:", err);
    res.status(500).json({ success: false });
  }
}
/* 
async function deleteChat(req, res) {

     try {
    const { chatId } = req.params;

    // delete chat (only if owned by user)
    const chat = await chatModel.findOneAndDelete({
      _id: chatId,
      user: req.user._id,
    });

    if (!chat) {
      return res.status(404).json({ success: false });
    }

    // delete all messages belonging to this chat
    await messageModel.deleteMany({ chat: chatId });
     await deleteChatMemory({
      chatId,
      userId: req.user._id,
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Delete chat error:", err);
    res.status(500).json({ success: false });
  }


} */

async function deleteChat(req, res) {
try {
    const { chatId } = req.params;

    const chat = await chatModel.findOneAndDelete({
      _id: chatId,
      user: req.user._id,
    });

    if (!chat) {
      return res.status(404).json({ success: false });
    }

    // get message ids BEFORE deleting messages
    const messages = await messageModel.find({ chat: chatId }).select("_id");

    const messageIds = messages.map((m) => m._id.toString());

    // delete mongo messages
    await messageModel.deleteMany({ chat: chatId });

    // 🔥 delete pinecone vectors by ID
    await deleteChatMemoryByIds(messageIds);

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Delete chat error:", err);
    res.status(500).json({ success: false });
  }

}


module.exports={createChat,getChats,getChatMessages,renameChat,deleteChat};