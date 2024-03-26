import User from "@/models/user";
import Post from "@/models/post"; // Assuming you have a Post model
import { connectToDB } from "@/utils/database";
import { getTokenData } from "@/helpers/getTokenData";

export const GET = async (request, { params }) => {
  try {
    let username = params.username;
    if (username === "undefined" || username === "null" || !username) {
      return new Response(JSON.stringify({ error: "user not found" }), {
        status: 404,
      });
    }

    await connectToDB();
    const tokenData = await getTokenData(request);
    if (!tokenData) {
      return new Response(JSON.stringify({ error: "Unauthorized access" }), {
        status: 404,
      });
    }

    // Find the user
    const foundUser = await User.findOne({ username: username });

    if (!foundUser) {
      return new Response(JSON.stringify({ error: "user not found" }), {
        status: 404,
      });
    }

    // Find all posts of the user
    const userPosts = await Post.find({ creator: foundUser._id })
      .populate("creator")
      .sort({ createdAt: -1 });

    // Combine user and post data
    const data = {
      user: foundUser,
      posts: userPosts,
    };

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch User", { status: 500 });
  }
};
