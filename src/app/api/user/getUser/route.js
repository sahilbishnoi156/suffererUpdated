  import { getTokenData } from "@/helpers/getTokenData";
  import User from "@/models/user";
  import Post from "@/models/post"; // Assuming you have a Post model
  import { connectToDB } from "@/utils/database";
  import jwt from "jsonwebtoken";
  import { NextResponse } from "next/server";

  export const GET = async (request) => {
    try {
      await connectToDB();
      const tokenData = await getTokenData(request);
      if(!tokenData){
        return new Response(JSON.stringify({ error: "Token Not Found" }), {
          status: 404,
        });
      }
      const username = tokenData.username;

      // Find the user
      const foundUser = await User.findOne({ username: username });

      if (!foundUser) {
        return new Response(JSON.stringify({ error: "user not found" }), {
          status: 404,
        });
      }

      // Find all posts of the user
      const userPosts = await Post.find({ creator: foundUser._id }).populate("creator").sort({createdAt: -1});
      // Find saved and liked posts, sorting directly in the MongoDB query

      // Combine user, posts, savedPosts, and likedPosts data
      const data = {
        user: foundUser,
        posts: userPosts,
        savedPosts: foundUser?.savedPosts?.length,
        likedPosts: foundUser?.likedPosts?.length,
      };

      return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        const response = NextResponse.json({
          error: "tokenExpired",
          tokenExpired: true,
        });
        await response.cookies.delete("authToken");
        return response;
      }
      return new Response("Failed to fetch User", { status: 500 });
    }
  };
