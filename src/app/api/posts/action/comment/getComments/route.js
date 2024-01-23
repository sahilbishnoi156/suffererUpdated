import mongoose from "mongoose";
import Comment from "@/models/comment"; // Import your Comment model
import { connectToDB } from "@/utils/database";
import Post from "@/models/post";

// Handler for creating a new comment
export const POST = async (request) => {
  try {
    await connectToDB();
    const { postId } = await request.json();

    //* Validating if post is present
    const FoundPost = await Post.findOne({ _id: postId });
    if (!FoundPost) {
      return new Response(JSON.stringify({ error: "Post Not Found" }), {
        status: 404,
      });
    }
    const comments = FoundPost.comments

    const findComments = await Comment.find({ _id: { $in: comments } })
    const sortCreatedAt = findComments.sort((a,b)=>b.createdAt-a.createdAt)
    const sortFlagged = sortCreatedAt.sort((a,b)=>b.flagged - a.flagged)
    return new Response(JSON.stringify(sortFlagged), { status: 200});
  } catch (error) {
    console.error(error);
    return new Response({message: "Failed to create comment"}, { status: 500});
  }
};
