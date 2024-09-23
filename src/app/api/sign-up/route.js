import dbConnect from "@/lib/dbConnect";
import { sendVerificationEmail } from "@/helper/sendVerificationEmal";
import userModel from "@/models/user.models";
import bcrypt from "bcrypt";

export async function POST(request) {
  await dbConnect();

  try {
    const { email, password, username } = request.json();

    const existingVerifiedUserByUsername = await userModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUserByUsername) {
      return Response.json(
        { success: false, message: "username is already taken" },
        { status: 400 }
      );
    }

    const existingUserByEmail = await userModel.findOne(email);
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response(
          { success: true, message: "the email you entered is already taken" },
          { status: 500 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
   } 
    else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
    }

    const newUser = new userModel({
      username,
      email,
      password: hashedPassword,
      isVerified: false,
      verificationCode: verifyCode,
      verifyCodeExpiry: expiryDate,
      isAcceptingMessage: true,
      messages: [],
    });

    await newUser.save();

    // sending email
    const resendEmail = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!resendEmail.success) {
      return Response.json(
        { success: false, message: resendEmail.response },
        { status: 500 }
      );
    }

    return Response.json(
      { success: true, message: "verification email sent to user" },
      { status: 500 }
    );
    
  } catch (error) {
    console.log("error while registering user: ", error);
    return Response.json(
      {
        success: false,
        message: "error while registering user",
      },
      { status: 500 }
    );
  }
}
