const { Server } = require("socket.io");
const cookie=require('cookie')
const jwt=require('jsonwebtoken')
const userModel=require('../models/user.model');
const aiService=require('../services/ai.service');
const messageModel=require('../models/message.model')
const {createMemory,queryMemory}=require('../services/vector.service');
const { messagesValidation } = require("@pinecone-database/pinecone/dist/assistant/data/chat");

async function initSocketServer(httpServer){

const io = new Server(httpServer,{});

//middleware for socket authentication
io.use(async (socket, next) => {


    const cookies=cookie.parse(socket.handshake.headers?.cookie || "");
    // postman-> socket-> cookie-> send token manually
    
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
    
   const message= await messageModel.create({
        chat:messagePayload.chat,
        user:socket.user.id,
        content:messagePayload.content,
        role:"user"
    })

const vectors=await aiService.generateVector(messagePayload.content)

await createMemory({
    vectors,
    messageId:message._id,
    metadata:{
        chat:messagePayload.chat,
       user:socket.user._id,
       text:messagePayload.content
    }
})

const memory=await queryMemory({
    queryVector:vectors,
    limit:3,
    metadata:{}
})

console.log(memory);

    const chatHistory=(await messageModel.find({
        chat:messagePayload.chat
    }).sort({createdAt:-1}).limit(3).lean()).reverse()


// short term memory for the chat 
/*      console.log(chatHistory.map(items=>{
        return{
            role:items.role,
            parts:[{text:items.content}]
        }
    }));
 */  
    const response=await aiService.generateResponse(chatHistory.map(items=>{
        return{
            role:items.role,
            parts:[{text:items.content}]
        }
    }))

     const responseMessage=await messageModel.create({
        chat:messagePayload.chat,
        user:socket.user.id,
        content:response,
        role:"model"
    })

    const responseVector=await aiService.generateVector(response)
    await createMemory({
        vectors:responseVector,
        messageId:responseMessage._id,
        metadata:{
                chat:messagePayload.chat,
                user:socket.user._id,
                 text:response
        }
    })

    socket.emit('ai-response',{
        content:response,
        chat:messagePayload.chat

    })

})

});

}


module.exports=initSocketServer;