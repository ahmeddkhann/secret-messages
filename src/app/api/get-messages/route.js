import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/user.models";
import mongoose from "mongoose";

export async function POST (request){
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user = session?.user

    if (!session || !session.user){
        return Response.json(
            {
                status: false,
                message: "You must be logged in to perform this action",
            },
            {status: 404}
        )
    }

    const userId = new mongoose.Types.ObjectId(user._id)
    try {
        const user = await userModel.aggregate([
            {$match: {id: userId} },
            {$unwind: '$messages'},
            {$sort: {'messages.createdAt': -1}},
            {$group: {_id: '$_id', messages: {
                $push: "messages" }
            }}
        ])

        if (!user || user.length === 0){
            return Response.json(
                {
                    success: false,
                    message: "user not found"
                },
                {status: 401}
            )
        }
        return Response.json(
            {
                success: true,
                message: user[0].messages
            },
            {status: 200}
        )
    } catch (error) {
        
    }
     
}