import User from "@/models/user";
import { connectToDB } from "@/utils/database";

export const GET = async (request, { params }) => {
  try {
    await connectToDB();
    const foundUser = await User.findOne({ username: params.username });
    if (foundUser) {
      return new Response(JSON.stringify({ userAvailable: true }), {
        status: 200,
      });
    } else {
      return new Response(JSON.stringify({ userAvailable: false }), {
        status: 200,
      });
    }
  } catch (error) {
    console.log(error);
    return new Response("Failed to fetch User", { status: 500 });
  }
};
