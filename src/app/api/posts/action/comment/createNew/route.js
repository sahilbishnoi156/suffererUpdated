import mongoose from "mongoose";
import Comment from "@/models/comment"; // Import your Comment model
import { getTokenData } from "@/helpers/getTokenData";
import { connectToDB } from "@/utils/database";
import Post from "@/models/post";
import User from "@/models/user";
const ObjectId = mongoose.Types.ObjectId;

// Handler for creating a new comment
export const POST = async (request) => {
  try {
    await connectToDB();
    const { content, post, postCreator } = await request.json();

    //* Getting Creator
    const token = await getTokenData(request);
    if (!token) {
      throw new Error(`Invalid token`);
    }
    const id = token._id;
    const creator = await User.findById(id);
    if (!creator) {
      return new Response(
        JSON.stringify({ error: "Please login before Comment" }),
        { status: 404 }
      );
    }
    

    //* Validating if post is present
    const FoundPost = await Post.findOne({ _id: post });
    if (!FoundPost) {
      return new Response(JSON.stringify({ error: "Post Not Found" }), {
        status: 404,
      });
    }

    //* Checking if post's creator and current user is same
    let flagged = false;
    if (postCreator.toString() === id.toString()) {
      flagged = true;
    }

    const newId = new ObjectId(id.toString());
    //* Create a new comment
    const newComment = new Comment({
      content: content,
      creator: {
        _id: newId,
        name: creator?.given_name,
        image: creator?.image,
        username: creator?.username
      },
      post: post,
      flagged: flagged,
    });

    // Save the comment to the database
    await newComment.save();

    //* adding comment in post
    if(!FoundPost.comments.includes(newComment._id)){
        FoundPost.comments.push(newComment._id)
        await FoundPost.save();
    }else{
        return new Response(JSON.stringify({errro: "Comment already exists"}), { status: 401});
    }

    return new Response(JSON.stringify(newComment), { status: 200});
  } catch (error) {
    console.error(error);
    return new Response({message: "Failed to create comment"}, { status: 500});
  }
};
