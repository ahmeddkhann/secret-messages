import dbConnect from "@/lib/dbConnect";
import { sendVerificationEmail } from "../../../helper/sendVerificationEmal";
import userModel from "@/models/user.models";
import bcrypt from "bcrypt";

export async function POST(request) {
  await dbConnect();

  try {
    const { email, password, username } = await request.json();

    // Input validation (you can use zod or any other library for this)
    if (!email || !password || !username) {
      return new Response(
        JSON.stringify({ success: false, message: "All fields are required" }),
        { status: 400 }
      );
    }

    const existingVerifiedUserByUsername = await userModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUserByUsername) {
      return new Response(
        JSON.stringify({ success: false, message: "Username is already taken" }),
        { status: 400 }
      );
    }

    const existingUserByEmail = await userModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return new Response(
          JSON.stringify({ success: false, message: "The email is already taken" }),
          { status: 400 }
        );
      } else {
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000); // 1 hour expiry
        await existingUserByEmail.save();
      }
    } else {
      const newUser = new userModel({
        username,
        email,
        password: hashedPassword,
        isVerified: false,
        verifyCode,
        verifyCodeExpiry: new Date(Date.now() + 3600000), // 1 hour expiry
        isAcceptingMessage: true,
        messages: [],
      });
      
      await newUser.save();
    }

    const resendEmail = await sendVerificationEmail(email, username, verifyCode);
    if (!resendEmail.success) {
      return new Response(
        JSON.stringify({ success: false, message: "Failed to send verification email" }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Verification email sent" }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Error while registering user: ", error);
    return new Response(
      JSON.stringify({ success: false, message: "Internal server error" }),
      { status: 500 }
    );
  }
}
