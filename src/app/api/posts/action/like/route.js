import { getTokenData } from "@/helpers/getTokenData";
import Post from "@/models/post";
import User from "@/models/user";
import { connectToDB } from "@/utils/database";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

export const PATCH = async (request) => {
  const tokenData = await getTokenData(request);
  const userId = tokenData._id;
  if (request.method !== "PATCH") {
    return new Response("Method not allowed", { status: 405 });
  }
  const { postId } = await request.json();

  if(!postId){
    return new Response("Invalid User Id", { status: 404 });
  }
  try {
    await connectToDB();

    // Find the existing follower and following users by their IDs
    const foundUser = await User.findById(userId);
    const likedPost = await Post.findById(postId);


    if (!foundUser || !likedPost) {
      return new Response("User Not Found", { status: 404 });
    }

    const likedAt = new Date();

    // Check if the user is already liking the post
    if (likedPost.likes.includes(userId)) {
      // Unlike: Remove userId from post's likes list
      foundUser.likedPosts = foundUser.likedPosts.filter(item => item._id.toString() !== postId.toString());
      likedPost.likes = likedPost.likes.filter(id => id.toString() !== userId.toString());
    } else {
      const newId = new ObjectId(postId);
      const data = { _id: newId, likedAt: likedAt }
      foundUser.likedPosts.push(data);
      likedPost.likes.push(new ObjectId(userId));
    }

    // Save both
    await foundUser.save();
    await likedPost.save();

    // Return updated post
    return new Response(JSON.stringify({ status: 200, likedPost }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error Updating User:", error);
    return new Response(JSON.stringify({ status: 500, error: "Error Updating User" }), {
      headers: { "Content-Type": "application/json" },
    });
  }
};
