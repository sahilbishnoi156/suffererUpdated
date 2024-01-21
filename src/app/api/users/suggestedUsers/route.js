import { getTokenData } from "@/helpers/getTokenData";
import User from "@/models/user";
import { connectToDB } from "@/utils/database";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

export const GET = async (request) => {
  try {
    await connectToDB();

    const token = await getTokenData(request);
    const currentUserId = token._id;
    const currentUserIdObj = new ObjectId(currentUserId);

    // Fetch the current user's details
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      return new Response("Current user not found", { status: 404 });
    }
    // Get the location of the current user
    // const currentUserLocation = currentUser.location;
    const currentUserLocation = { latitude: 30.5145926, longitude: 76.6528112 };

    // Define a search radius
    const searchRadius = 100; // In Kilometers
    const suggestedUsers = await User.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [
              currentUserLocation.latitude,
              currentUserLocation.longitude,
            ],
          },
          distanceField: "distance",
          spherical: true,
          maxDistance: searchRadius * 1000,
        },
      },
      {
        $match: {
          $and: [
            { _id: { $ne: currentUserIdObj } },
            {
              _id: {
                $nin: currentUser.followings.map((id) => new ObjectId(id)),
              },
            },
          ],
        },
      },
      { $sample: { size: 5 } },
    ]);

    if (suggestedUsers.length < 5) {
      const additionalRandomUsers = await User.aggregate([
        {
          $match: {
            _id: {
              $nin: suggestedUsers
                .map((user) => user._id)
                .concat(currentUserIdObj),
            },
          },
        },
        { $sample: { size: 5 - suggestedUsers.length } },
      ]);
      const finalUsers = suggestedUsers.concat(additionalRandomUsers);
      return new Response(JSON.stringify(finalUsers), { status: 200 });
    }
    return new Response(JSON.stringify(suggestedUsers), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Failed to fetch suggested users", { status: 500 });
  }
};
