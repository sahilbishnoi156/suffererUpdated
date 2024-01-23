import User from "@/models/user";
import { connectToDB } from "@/utils/database";

export const GET = async (request, { params }) => {
  try {
    await connectToDB();
    const foundUser = await User.findById(params.id);

    if (!foundUser) {
      return new Response("User not found", { status: 404 });
    }

    const followers = foundUser.followers.map(follower => follower._id);
    const followings = foundUser.followings.map(following => following._id);

    // Fetch complete user data for followers
    const followerData = await User.find({ _id: { $in: followers } });

    // Fetch complete user data for followings
    const followingData = await User.find({ _id: { $in: followings } });
    const responseData = {
      followers: followerData,
      followings: followingData,
    };

    return new Response(JSON.stringify(responseData), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Failed to retrieve data", { status: 500 });
  }
};
