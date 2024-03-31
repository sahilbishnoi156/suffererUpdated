import { getTokenData } from "@/helpers/getTokenData";
import Post from "@/models/post";
import { connectToDB } from "@/utils/database";

export const GET = async (request) => {
  try {
    await connectToDB();

    //! Getting Pages
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.search);
    const page = parseInt(searchParams.get("_page"));
    const LIMIT = parseInt(searchParams.get("_limit")) || 4;

    //! Authenticating User
    const tokenData = await getTokenData(request);
    if (!tokenData) {
      return new Response(JSON.stringify({ error: "Unauthorized access" }), {
        status: 401,
      });
    }
    const skip = (page - 1) * LIMIT;
    //! Getting Posts from database
    const posts = await Post.find().populate("creator").skip(skip).limit(LIMIT);
    const totalPosts = await Post.count();
    return new Response(
      JSON.stringify({
        posts: posts,
        currentPage: page,
        nextPage: ((page+1) * 4) < totalPosts ? page + 1 : null,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Failed to get posts",
        errorMessage: error.message,
      }),
      { status: 500 }
    );
  }
};
