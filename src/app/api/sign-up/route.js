import dbConnect from "@/lib/dbConnect";
import { sendVerificationEmail } from "../../../helper/sendVerificationEmal";
import userModel from "@/models/user.models";
import bcrypt from "bcrypt";

export async function POST(request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    const existingVerifiedUserByUsername = await userModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUserByUsername) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Username is already taken',
        }),
        { status: 400 }
      );
    }

    const existingUserByEmail = await userModel.findOne({ email });
    let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'User already exists with this email',
          }),
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new userModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      });

      await newUser.save();
    }

    // Send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );
    if (!emailResponse.success) {
      return new Response(
        JSON.stringify({
          success: false,
          message: emailResponse.message,
        }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'User registered successfully. Please verify your account.',
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registering user:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error registering user',
      }),
      { status: 500 }
    );
  }
}