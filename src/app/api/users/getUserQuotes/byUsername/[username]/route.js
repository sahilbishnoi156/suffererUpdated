import { getTokenData } from "@/helpers/getTokenData";
import User from "@/models/user";
import { connectToDB } from "@/utils/database";

export const GET = async (request, { params }) => {
  try {
    let username = params.username;
    if (username === "undefined" || username === "null" || !username) {
        return new Response(JSON.stringify({error:"user not found"}), { status: 404 });
    }
    await connectToDB();
    const FoundUser = await User.find({ username: username });
    return new Response(JSON.stringify(FoundUser), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch User", { status: 500 });
  }
};
