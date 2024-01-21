import { getTokenData } from "@/helpers/getTokenData";
import User from "@/models/user";
import { connectToDB } from "@/utils/database";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;


export const PATCH = async (request) => {
  if (request.method !== "PATCH") {
    return new Response("Method not allowed", { status: 405 });
  }
  const { postId } = await request.json();
  try {
    const tokenData = await getTokenData(request)
    const userId = tokenData._id;
    await connectToDB();

    // Find the existing follower and following users by their IDs
    const foundUser = await User.findById(userId);

    const savedAt = new Date();
    if (!foundUser) {
      return new Response("User Not Found", { status: 404 });
    }

    // Check if the user is already liking the post
    if (foundUser.savedPosts.some(item => item._id.toString() === postId.toString())) {
      // Unlike: Remove userId from post's likes list
      foundUser.savedPosts = foundUser.savedPosts.filter(item => item._id.toString() !== postId.toString());
    } else {
      // Like: Add userId to post's likes list
      const newId = new ObjectId(postId);
      const data = { _id: newId, savedAt: savedAt }
      foundUser.savedPosts.push(data);
    }

    // Save both
    await foundUser.save();
    // Return updated post
    return new Response(JSON.stringify({ status: 200 , foundUser}), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error Updating User:", error);
    return new Response(JSON.stringify({ status: 500, error: "Error Updating User" }), {
      headers: { "Content-Type": "application/json" },
    });
  }
};
