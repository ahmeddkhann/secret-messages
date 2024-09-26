import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/user.models";


export async function POST (request){
    await dbConnect()
   const {username, content} = await request.json()
   try {
    const user = await userModel.findOne({username})
    if (!user){
        return Response.json(
            {
                success: false,
                message: "user not found"
            },
            {status: 402}
        )
    }

    // is user accepting messages or not 

    if (!user.isAcceptigMessages){
        return Response.json(
            {
                success: false,
                message: "user is not accepting messages"
            },
            {status: 402}
        )
    }

    const newMessages = {content, createdAt: new Date()}
    user.messages.push(newMessages)
    await user.save()

    return Response.json(
        {
            success: true,
            message: "message sent successfully"
        },
        {status: 202}
    ) 

   } catch (error) {
    console.error("Error while sending messages ", error)
    return Response.json(
        {
            success: false,
            message: "error while sending messages"
        },
        {status: 500}
    )
   }
}