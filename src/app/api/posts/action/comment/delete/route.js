import { getTokenData } from "@/helpers/getTokenData";
import Comment from "@/models/comment";
import Post from "@/models/post";
import { connectToDB } from "@/utils/database";


export const DELETE = async (request, { params }) => {
  try {
    const {commentId} = await request.json();
    await connectToDB();
    const tokenData = await getTokenData(request);
    if (!tokenData) {
      return new Response(JSON.stringify({ error: "Unauthorized access" }), {
        status: 401,
      });
    }

    // Find the post that contains the comment
    const foundComment = await Comment.findByIdAndRemove(commentId);

    const foundPost = await Post.findOne({_id: foundComment.post});
    // Remove the comment from the database

    // Remove the comment ID from the post's `comments` array
    foundPost.comments.pull(commentId);

    // Save the updated post to reflect the removed comment ID
    await foundPost.save();

    return new Response("Comment deleted successfully", { status: 200 });
  } catch (error) {
    console.log(error)
    return new Response("Error deleting comment", { status: 500 });
  }
};
