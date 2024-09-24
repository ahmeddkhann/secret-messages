import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/user.models";

export async function DELETE (request, {params: {messageid}})
{
    const messageId = params.messageid
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

    try {
       const updateResult = await userModel.updateOne(
            {_id: user},
            {$pull: {messages: { _id: messageId}}}
        )
        if (updateResult.modifiedCount === 0){
            return Response.json(
                {
                    success: false,
                    message: "message maybe deleted earlier"
                },
                {status: 400}
            )
        }
        return Response.json(
            {
                success: true,
                message: "message deleted successfully"
            },
            {status: 200}
        )
    } catch (error) {
        console.log("error in deleting message: ", error);
        return Response.json(
            {
                success: false,
                message: "internal error while deleting message"
            },
            {status: 500}
        )
    }
     
}