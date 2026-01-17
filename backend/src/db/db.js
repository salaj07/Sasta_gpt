const mongoose=require('mongoose')

async function connectDB(){

try{

    await mongoose.connect(process.env.MONGODB_URL);
    console.log("connected to db");
    
}
catch(err){
    console.error("error connecting to MONGODB",err);
    
}

}

module.exports=connectDB;