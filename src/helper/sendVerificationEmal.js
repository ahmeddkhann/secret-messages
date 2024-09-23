import {resend} from "../lib/resend"
import VerificationEmail from "../../emails/verificationEmail"
import ApiResponse from "@/types/ApiResponse"

export async function sendVerificationEmail (email, username, otp){
    try {
        await resend.emails.send({
            from: 'onboarding@gmail.com',
            to: email,
            subject: 'Mystery Message | Verification Code',
            react: VerificationEmail({username, otp}),
          });
          return new ApiResponse ({status: true, message: `verification email sent to ${username}`})
    } catch (error) {
        console.error('error while sending verification email: ', error)
        return new ApiResponse({status: false, message: `verification email to ${username} failed!!!`})
    }
}