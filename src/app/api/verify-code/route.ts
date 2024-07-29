import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/User.model";


export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, verifyCode } = await request.json();

    // post generally send in encoded format
    const decodedUsername = decodeURIComponent(username);
    const user = await userModel.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        {
          status: 500,
        }
      );
    }

    // now to compare otp
    const isCodeValid = user.verifyCode === verifyCode;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeNotExpired && isCodeValid) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          success: true,
          message: "user is verified",
        },
        {status: 200}
      );
    } else if (!isCodeNotExpired) {
      // if code date is expired
      return Response.json(
        {
          success: false,
          message: "code is expired please sign up again to verify code",
        },
        {status: 400}
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "code is incorrect please fill it carefully",
        },
        {status: 400}
      )
    }



  } catch (error) {
    console.log("error verifing code", error);
    return Response.json(
      {
        success: false,
        message: "error verifying code ",
      },
      {status: 500}
    );
  }
}
