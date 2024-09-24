import { NextResponse } from 'next/server';
import VerificationEmail from '../../emails/verificationEmail';
import resend from '@/lib/resend';

export async function sendVerificationEmail(email, username, otp) {
    try {
        await resend.emails.send({
            from: 'onboarding@gmail.com',
            to: email,
            subject: 'Mystery Message | Verification Code',
            react: VerificationEmail({ username, otp }),
        });
        
        // Corrected response format
        return NextResponse.json(
            { success: true, message: `Verification email sent to ${username}` },
            { status: 200 } // Set status code here in the headers
        );
    } catch (error) {
        console.error('Error while sending verification email: ', error);

        // Corrected response format for error case
        return NextResponse.json(
            { success: false, message: `Verification email failed to send to ${username}` },
            { status: 500 } // Set status code here in the headers
        );
    }
}
