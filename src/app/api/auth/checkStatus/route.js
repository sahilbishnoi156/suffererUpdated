import { connectToDB } from "@/utils/database";
import { getTokenData } from "@/helpers/getTokenData";

export const GET = async (request) => {
  try {
    await connectToDB();
    console.log('object');
    const tokenData = await getTokenData(request);
    if (!tokenData) {
      return new Response(JSON.stringify({ error: "Token Not Found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response("Error Updating User", { status: 500 });
  }
};
