import {z} from "zod"

// this is for validate all the details filled by user 

export const usernameValidation = z
  .string()
  .min(2 , "username must be of 2 characters")
  .max(20, "username no more than 20 char")
  .regex(/^[a-zA-Z0-9_]+$/, "username must not contain any special char")

export const signUpSchema = z.object({
  username : usernameValidation,
  email : z.string().email({message : "Invalid email address"}),
  password : z.string().min(6, {message : "password must be atleast 6 characters"}).max(15) 
})