import User from "@/models/user";
import Post from "@/models/post"; // Assuming you have a Post model
import { connectToDB } from "@/utils/database";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { getTokenData } from "@/helpers/getTokenData";

export const POST = async (request) => {
  try {
    await connectToDB();
    const tokenData = await getTokenData(request);
    if (!tokenData) {
      return new Response(JSON.stringify({ error: "Unauthorized access" }), {
        status: 401,
      });
    }
    const { username, postType } = await request.json();

    // Find the user
    const foundUser = await User.findOne({ username: username });

    if (!foundUser) {
      return new Response(JSON.stringify({ error: "user not found" }), {
        status: 404,
      });
    }
    if (postType === "savedPosts") {
      const savedPosts = await Post.find({_id: { $in: foundUser.savedPosts.map((post) => post._id) },}).populate("creator");
      // Sort savedPosts and likedPosts separately based on likedAt value
      savedPosts.sort((a, b) => {
        const aSavedAt = foundUser.savedPosts.find((lp) => lp._id.toString() === a._id.toString())?.savedAt;
        const bSavedAt = foundUser.savedPosts.find((lp) => lp._id.toString() === b._id.toString())?.savedAt;
        if (aSavedAt && bSavedAt) {
          return new Date(bSavedAt) - new Date(aSavedAt); // Sort descending by likedAt
        } else {
          return 0; // Keep original order if likedAt is missing
        }
      });
      return new Response(JSON.stringify({data:savedPosts}), { status: 200 });
    } else if (postType === "likedPosts") {
        const likedPosts = await Post.find({_id: { $in: foundUser.likedPosts.map((post) => post._id) },}).populate("creator");
        likedPosts.sort((a, b) => { const aLikedAt = foundUser.likedPosts.find((lp) => lp._id.toString() === a._id.toString())?.likedAt;
            const bLikedAt = foundUser.likedPosts.find((lp) => lp._id.toString() === b._id.toString())?.likedAt;
            if (aLikedAt && bLikedAt) {
                return new Date(bLikedAt) - new Date(aLikedAt); // Sort descending by likedAt
            } else {
                return 0; // Keep original order if likedAt is missing
            }
        });
        return new Response(JSON.stringify({data:likedPosts}), { status: 200 });
    }else{
        return new Response(JSON.stringify({error:"Invalid Post Type"}), { status: 404 });
    }
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
