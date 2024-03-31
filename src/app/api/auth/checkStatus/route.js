import { connectToDB } from "@/utils/database";
import { getTokenData } from "@/helpers/getTokenData";

export const GET = async (request) => {
  try {
    await connectToDB();
    const token = (await request.cookies.get("authToken"))?.value;
    if (!token) {
      return new Response(JSON.stringify({ isLoggedIn: false }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify({ isLoggedIn: true }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response({ message: "Something Went Wrong" }, { status: 200 });
  }
};
