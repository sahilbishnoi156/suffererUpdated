import { connectToDB } from "@/utils/database";
import Post from "@/models/post";
import User from "@/models/user";

const DEFAULT_START_LIMIT = 0;

const fetchPosts = async (userId, _start, _limit) => {
  await connectToDB();
  // Fetch followed accounts
  const followedAccounts = await User.findById(userId).select("followings").populate("followings");

  try {
    // Query posts from followed accounts
    const followedPosts = await Post.find({ creator: { $in: followedAccounts.followings } }).populate('creator')
      .sort({ createdAt: -1 })
      .skip(_start)
      .limit(_limit);

    // If followed posts are less than the limit, fetch additional content
    if (followedPosts.length < _limit) {
      // Fetch trending posts (adjust query based on your logic)
      const trendingPosts = await Post.find({ trending: true }).populate('creator')
        .sort({ createdAt: -1 })
        .limit(_limit - followedPosts.length);

      // Combine followed and trending posts
      const posts = [...followedPosts, ...trendingPosts];

      return {
        posts,
        totalPosts: await Post.countDocuments({ creator: { $in: followedAccounts.following } }), // Count only followed posts
      };
    } else {
      return {
        posts: followedPosts,
        totalPosts: await Post.countDocuments({ creator: { $in: followedAccounts.following } }),
      };
    }
  } catch (error) {
    if (error.code === 17010) { // No posts from followed accounts
      // Fallback to global posts
      const fallbackPosts = await Post.find().populate('creator').sort({ createdAt: -1 }).skip(_start).limit(_limit);
      return {
        posts: fallbackPosts,
        totalPosts: await Post.countDocuments(),
      };
    } else {
      // Handle other errors
      throw error;
    }
  }
};




export const POST = async (request) => {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const _start = parseInt(searchParams.get("_start")) || DEFAULT_START_LIMIT;
  const _limit = parseInt(searchParams.get("_limit")) || 4;
  const {userId} = await request.json();
  try {
    const { posts, totalPosts } = await fetchPosts(userId,_start, _limit);
    const responseBody = {
      posts: posts,
      totalPosts,
    };
    return new Response(JSON.stringify(responseBody), { status: 200 });
  } catch (error) {
    console.log(error)
    const errorResponse = {
      error: "Failed to get posts",
      errorMessage: error.message,
    };
    return new Response(JSON.stringify(errorResponse), { status: 500 });
  }
};
