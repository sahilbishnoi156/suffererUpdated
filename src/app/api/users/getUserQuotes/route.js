import { getTokenData } from "@/helpers/getTokenData";
import Post from "@/models/post";
import { connectToDB } from "@/utils/database";

export const GET = async (request) => {
  try {
    const tokenData = await getTokenData(request);
    const id = tokenData._id;
    await connectToDB();
    const userPosts = await Post.find({ creator: id }).populate("creator");
    return new Response(JSON.stringify(userPosts), { status: 200 });
  } catch (error) {
    return new Response("Failed to get Posts", { status: 500 });
  }
};
