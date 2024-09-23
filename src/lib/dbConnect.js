import mongoose, { connection } from "mongoose";

async function dbConnect (){
    if (connection.isConnected) {
        console.log("Database is already connected");
        return
    }
    try {
       const db = mongoose.connect(process.env.MONGODB_URI )
       connection.isConnected = await db.connections[0].readyState
       console.log("DB connected successfully");
       
       
    } catch (error) {
        console.log("Database connection failed: ", error);
        process.exit
    }
} 

export default dbConnect()