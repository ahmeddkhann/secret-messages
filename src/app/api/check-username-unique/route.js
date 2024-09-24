import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/user.models";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    }; // validate with zod

    const result = UsernameQuerySchema.safeParse(queryParam);
    if (!result.success) {
      const usernameError = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameError?.length > 0
              ? usernameError.join(", ")
              : "Invalid query parameters",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;
    const existigVerifiedUser = userModel.findOne({
      username,
      isVerified: true,
    });
    if (existigVerifiedUser) {
      return Response.json(
        { success: false, message: "username is already taken" },
        { status: 400 }
      );
    }
    return Response.json(
      { success: true, message: "username is unique" },
      { status: 200 }
    );
  } catch (error) {
    console.error("error checking username: ", error);
    return Response.json(
      {
        success: false,
        message: "Error checking username",
      },
      { status: 500 }
    );
  }
}
