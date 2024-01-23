import User from "@/models/user";
import { connectToDB } from "@/utils/database";

export const GET = async (request, { params }) => {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const tabType = searchParams.get("tabType");

  try {
    await connectToDB();
    const foundUser = await User.findById(params.id);

    if (!foundUser) {
      return new Response("User not found", { status: 404 });
    }

    let userResults;

    if (tabType === "Followers") {
      userResults = await fetchFollowersOrFollowings(foundUser.followers);
    } else if (tabType === "Followings") {
      userResults = await fetchFollowersOrFollowings(foundUser.followings);
    } else {
      return new Response("Invalid tabType", { status: 400 });
    }

    console.log(userResults)
    return new Response(JSON.stringify(userResults), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Failed to retrieve data", { status: 500 });
  }
};

async function fetchFollowersOrFollowings(users) {
  const userResults = await Promise.all(
    users.map(async (user) => {
      const foundUser = await User.findById(user._id.toString());
      if(foundUser){
        const data = { username:foundUser.username,image:foundUser.image, given_name:foundUser.given_name, family_name:foundUser.family_name }
        return data;
      }
      return;
    })
  );
  return userResults;
}
