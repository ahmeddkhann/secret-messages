import mongoose from "mongoose";

async function dbConnect() {
    if (mongoose.connection.readyState) {
        console.log("Database is already connected");
        return;
    }

    try {
        const db = await mongoose.connect(`${process.env.MONGODB_URI}myDatabase`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("DB connected successfully");
    } catch (error) {
        console.error("Database connection failed: ", error);
        process.exit(1);
    }
}

export default dbConnect;
