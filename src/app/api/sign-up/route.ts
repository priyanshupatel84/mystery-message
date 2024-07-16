import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/User.model";
import bcrypt from "bcrypt";



export async function POST(request: Request) {

  // nextjs run on edge case so we always have to do database connection
  await dbConnect();
  

  try {
    const { username, email, password } = await request.json();

    // now eriting logic if username already exits

    const existingUserVerifiedByUsername = await userModel.findOne({
      username,
      isVerified: true,
      // finding user who is verified
    });

    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "username is already taken",
        },
        { status: 400 }
      );
    }

    const existingUserByEmail = await userModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    // user already exist with this email
    if (existingUserByEmail) {
      if(existingUserByEmail.isVerified){
        return Response.json(
          {
            success: false,
            message: "user already exist with this email",
          },
          { status: 400}
        );
      }else{
        // saving user with new password and verifycode 
        const hasedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hasedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)

        await existingUserByEmail.save()
      }
    } 

    // if email se bhi user exit nahi kar raha toh user is new
    else {
      const hasedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new userModel({
        username: username,
        email: email,
        password: hasedPassword,
        verifyCode: verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        message: [],
      });

      await newUser.save();
      // saving new document in database
    }

    // send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "user register successfully",
      },
      { status: 201 }
    );

  } catch (error) {
    console.log("error registering user", error);

    return Response.json(
      {
        success: false,
        message: "error registering user",
      },
      {
        status: 500,
      }
    );
  }
}
