const { Server } = require("socket.io");
const cookie=require('cookie')
const jwt=require('jsonwebtoken')
const userModel=require('../models/user.model');
const aiService=require('../services/ai.service');

const messageModel=require('../models/message.model')

async function initSocketServer(httpServer){

const io = new Server(httpServer,{});

//middleware for socket authentication
io.use(async (socket, next) => {


    const cookies=cookie.parse(socket.handshake.headers?.cookie || "");
    // postman-> socket-> cookie-> manullay token send krna 
    
    // console.log(cookies);
    
    if(!cookies.token){
        next(new Error("authentication error:No token Provided"))
    } 

    try{
       const decoded  = jwt.verify(cookies.token,process.env.JWT_SECRET);
        const user=await userModel.findById(decoded.id);
       socket.user=user;
       next();
    
    }catch(err){
        next(new Error("authentication error: Invalid token"))
        

    }


})

io.on("connection", async (socket) => {
  
// console.log(" new socket connection",socket.id);
   
   
socket.on("ai-message",async(messagePayload)=>{


    // console.log(messagePayload);
    
    await messageModel.create({
        chat:messagePayload.chat,
        user:socket.user.id,
        content:messagePayload.content,
        role:"user"
    })

    const chatHistory=(await messageModel.find({
        chat:messagePayload.chat
    }).sort({createdAt:-1}).limit(20).lean()).reverse()


    // short term memory for the chat 
  /*       console.log(chatHistory.map(items=>{
        return{
            role:items.role,
            parts:[{text:items.content}]
        }
    }));
 */

    // console.log(chatHistory);
    
    
    const response=await aiService.generateResponse(chatHistory.map(items=>{
        return{
            role:items.role,
            parts:[{text:items.content}]
        }
    }))
    

     await messageModel.create({
        chat:messagePayload.chat,
        user:socket.user.id,
        content:response,
        role:"model"
    })

      

    socket.emit('ai-response',{
        content:response,
        chat:messagePayload.chat

    })

})

});


}

module.exports=initSocketServer;