import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import userModel from "@/models/User.model";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";
// import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";


// this is the post request for when we toggle the switch 
export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "not authenticated",
      },
      { status: 401 }
    );
  }

  const userId = user._id;

  // it is bringing data of that switch on dashboard stored i acceptMessages
  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "failed to update user status to accept messages",
        },
        { status: 401 }
      );
    }

    // if toggle mode is updated
    return Response.json(
      {
        success: true,
        message: "message accept status updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    // this is for that toggle mode
    console.log("failed to update user status to accept messages", error);
    return Response.json(
      {
        success: false,
        message: "failed to update user status to accept messages",
      },
      { status: 500 }
    );
  }
}


// this get request is sent to fetch all messages 

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "not authenticated",
      },
      { status: 401 }
    );
  }

  const userId = user._id;
  const foundUser = await userModel.findById(userId);
  // console.log("founding user -> ", foundUser);

  try {

    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "user not founded",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        isAcceptingMessage: foundUser.isAcceptingMessage,
      },
      { status: 200 }
    );

  } catch (error) {

    console.log("error in setting accepting message status", error);
    return Response.json(
      {
        success: false,
        message: "error in setting accepting message status",
      },
      { status: 500 }
    );
  }
}
