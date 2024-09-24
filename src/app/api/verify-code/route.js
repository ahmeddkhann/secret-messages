import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/user.models";

export async function POST(request) {
   await dbConnect()

   try {
     const {username, code} = await request.json()
    const decodedUsername = decodeURIComponent(username)
   const user = await userModel.findOne({
        username: decodedUsername
    })

    if (!user){
        return Response.json(
            {
                success: false,
                message: "User not found"
            },
            {status: 500}
        )
    }

    const isCodeValid = user.verifyCode === code
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

    if (isCodeValid && isCodeNotExpired){
        user.isVerified = true
        await user.save()
        return Response.json(
            {
                success: true,
                message: "account verified successfully"
            },
            {status: 201}
        )
    } else if (!isCodeNotExpired){
        return Response.json(
            {
                success: false,
                message: "verification code has expired please signup again"
            },
            {status: 404}
        )
    } else{
        return Response.json(
            {
                success: false,
                message: "verification code is incorrect"
            },
            {status: 404}
        )
    }


    } catch (error) {
    console.error("Error veryfing user: ", error)
    return Response.json(
        {
            success: false,
            message: "error veryfing user"
        },
        {status: 500}
    )
   }
}