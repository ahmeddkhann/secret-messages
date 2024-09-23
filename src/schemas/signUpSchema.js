import {z} from "zod"

export const usernameValidation = z
    .string()
    .min(5, "username must not be less than 5 characters")
    .max(15, "username must not be more than 15 characters")
    .regex(/^[a-zA-Z0-9._-]{5,15}$/, "username should only include dot hypen and underscore as special character")


export const signUpSchema = z.object({
    username: usernameValidation,
    email: z
    .string()
    .email({message: "email is must required"}),
    password: z
    .string()
    .min(6, {message: "password should not be less than 6 characters"})
    .max(20, {message: "password should not be more than 20 characters"})
})