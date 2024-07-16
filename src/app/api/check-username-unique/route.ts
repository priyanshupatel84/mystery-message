// next js db is connect every time
import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/User.model";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const usernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  // // to telluser that this url takes only get request 
  // if(request.method !== 'GET'){
  //   return Response.json(
  //     {
  //       success: false,
  //       message: "Only get request is allowed",
  //     },
  //     { status: 405}
  //   );
  // }

  // connect database
  await dbConnect();

  try {
    // url is localhost:3000/api/check-username-unique/?username=anshu?phone=android
    // we need to find that username
    const { searchParams } = new URL(request.url);
    // searchParams contain whole url

    const queryParam = {
      username: searchParams.get("username"),
      // finding username from url
    };
    // validation username
    const result = usernameQuerySchema.safeParse(queryParam);
    console.log(result);

    if (!result.success) {
      const usernameError = result.error.format().username?._errors || [];
      // this will give all kind of errors

      return Response.json(
        {
          success: false,
          message:
            usernameError?.length > 0
              ? usernameError.join(",")
              : "invalid query parameter",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;
    const existingVerifiedUser = await userModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "username is already taken",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "username is unique",
      },
      { status: 200 }
    );

  } catch (error) {
    console.log("error checking username", error);
    return Response.json(
      {
        success: false,
        message: "error checking username",
      },
      {
        status: 500,
      }
    );
  }
}
