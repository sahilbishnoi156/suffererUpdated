import { getTokenData } from "@/helpers/getTokenData";
import User from "@/models/user";
import { connectToDB } from "@/utils/database";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

export const PATCH = async (request) => {
  try {
    if (request.method !== "PATCH") {
      return new Response("Method not allowed", { status: 405 });
    }

    const { followedUserUsername } = await request.json();
    const token = await getTokenData(request);
    const followerId = token._id;
    const followerUserUsername = token.username;

    if (followedUserUsername === followerUserUsername) {
      return new Response("User not accepted", { status: 406 });
    }

    await connectToDB();

    const followedUser = await User.findOne({ username: followedUserUsername }); // whom current user is following
    const followerUser = await User.findById(followerId); // Current user using the app

    if (!followedUser || !followerUser) {
      return new Response("User Not Found", { status: 404 });
    }

    const followedAt = new Date();
    // Check if the follower is already following the followed user
    if (followedUser.followers.some((user)=> user._id.toString() === followerUser?._id.toString())) {
      // Unfollow: Remove followerUser from followedUser's followers list
      followedUser.followers = followedUser.followers.filter(user => user._id.toString() !== followerUser?._id.toString());
      // Remove followedUser from followerUser's following list
      followerUser.followings = followerUser.followings.filter(user => user._id.toString() !== followedUser._id.toString());
    } else {
      // Follow: Add followerId to followedUser's followers list

      const newId1 = new ObjectId(followerId)
      followedUser.followers.push({_id:newId1, followedAt});
      // Add followedUser to followerUser's following list
      const newId2 = new ObjectId(followedUser._id)
      followerUser.followings.push({_id:newId2, followedAt});
    }

    // Save both updated users
    await followerUser.save();
    await followedUser.save();

    // Return updated user objects
    return new Response(JSON.stringify({ status: 200, followedUser }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error Updating User:", error);
    return new Response(JSON.stringify({ status: 500, error: "Error Updating User" }), {
      headers: { "Content-Type": "application/json" },
    });
  }
};
