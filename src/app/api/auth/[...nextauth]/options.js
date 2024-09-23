import {NextAuthOptions} from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt"
import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/user.models";


export const authOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "email@gmail.com" },
                username: { label: "username", type: "text", placeholder: "username.." },
                password: { label: "Password", type: "password", placeholder: "password..." },
            },
            async authorize (credentials){
                await dbConnect()
                try {
                  const user = await userModel.findOne({
                        $or: [
                            {username: credentials.identifier},
                            {email: credentials.identifier}
                        ]
                    })
                    if (!user){
                        throw new Error ("user with this email or username does not exists")
                    }
                    if (!user.isVerified){
                        throw new Error("please verify your account before login")
                    }

                   const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
                   if (isPasswordCorrect){
                    return user
                   }else{
                    throw new Error("incorrect password")
                   }

                } catch (error) {
                    throw new Error(error)
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user){
                token._id = user._id?.toString()
                token.username = user.username
                token.isVerified = user.isVerified
                token.isAcceptingMessages = user.isAcceptingMessages
            }
            return token
          },
        async session({ session, token }) {
            if (token){
                session._id = token._id?.toString()
                session.username = token.username
                session.isVerified = token.isVerified
                session.isAcceptingMessages = token.isAcceptingMessages
            }
            return session
          },
    },
    pages: {
        signIn: '/sign-in',
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
}