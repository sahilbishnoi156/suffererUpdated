import { getTokenData } from "@/helpers/getTokenData";
import Post from "@/models/post";
import { connectToDB } from "@/utils/database";

export const POST = async (request) => {
  try {
    const { caption, image } = await request.json();
    const token = await getTokenData(request);
    if (!token) {
      throw new Error(`Invalid token`)
    }
    await connectToDB();
    const newPost = new Post({ creator: token?._id, caption, image });
    await newPost.save();
    return new Response(JSON.stringify({ message: "done" }), { status: 201 });
  } catch (error) {
    return new Response("Failed to create a new quote", { status: 500, error: error});
  }
};
