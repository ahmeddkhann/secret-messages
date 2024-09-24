import dbConnect from "@/lib/dbConnect";
import { sendVerificationEmail } from "../../../helper/sendVerificationEmal";
import userModel from "@/models/user.models";
import bcrypt from "bcrypt";

export async function POST(request) {
  await dbConnect();

  try {
    const { email, password, username } = await request.json();

    const existingVerifiedUserByUsername = await userModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUserByUsername) {
      return Response.json(
        { success: false, message: "Username is already taken" },
        { status: 400 }
      );
    }

    const existingUserByEmail = await userModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    let hashedPassword;

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          { success: false, message: "The email you entered is already taken" },
          { status: 400 }
        );
      } else {
        // User exists but not verified
        hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode; // Update verify code
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      // New user logic
      hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date(Date.now() + 3600000); // 1 hour from now
      
      const newUser = new userModel({
        username,
        email,
        password: hashedPassword,
        isVerified: false,
        verifyCode, // Corrected field name
        verifyCodeExpiry: expiryDate,
        isAcceptingMessage: true,
        messages: [],
      });
      
      await newUser.save(); // Ensure verifyCode is set here
    }

    // Sending email
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
      { success: true, message: "Verification email sent to user" },
      { status: 200 }
    );

  } catch (error) {
    console.log("Error while registering user: ", error);
    return Response.json(
      {
        success: false,
        message: "Error while registering user",
      },
      { status: 500 }
    );
  }
}
