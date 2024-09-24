import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/user.models";
import {User} from "next-auth"

export async function POST (request){
    await dbConnect()
   const session = await getServerSession(authOptions)
  const user = session?.user
  if (!session || !session.user){
    return Response.json(
        {
            success: false,
            message: "Not Authenticated"
        },
        {status: 401}
    )
  } 
  const userId = user._id;
  const {acceptMessages} = await request.json()
  try {
   const updatedUser = await userModel.findByIdAndUpdate(
        userId,
        {isAcceptingMessages: acceptMessages},
        {new: true}
    )
    if (!updatedUser){
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
            message: "messages acceptance status changed",
            updatedUser
        },
        {status: 201}
    )
    
  } catch (error) {
    return Response.json(
        {
            success: false,
            message: "failed to update user status to accept messages"
        },
        {status: 500}
    )
  }
}

export async function GET (request){
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user = session?.user

    if(!session || !session.user){
        return Response.json(
            {
                success: false,
                message: "Not Authenticated"
            },
            {status: 401}
        )
    }
    const userId = user._id

  try {
     const foundUser = await userModel.findById(userId)
     if (!foundUser){
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
          isAcceptingMessages: foundUser.isAcceptingMessages
      },
      {status: 201}
  )
  } catch (error) {
    console.log("failed to update user status to accept messages");
    return Response.json(
        {
            success: false,
            message: "error in getting message acceptance"
        },
        {status: 500}
    )
    
  }
}