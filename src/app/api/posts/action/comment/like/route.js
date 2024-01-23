import { getTokenData } from "@/helpers/getTokenData";
import Comment from "@/models/comment";
import { connectToDB } from "@/utils/database";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

export const PATCH = async (request) => {
  if (request.method !== "PATCH") {
    return new Response("Method not allowed", { status: 405 });
  }
  const tokenData = await getTokenData(request);
  const id = tokenData._id;
  if (tokenData === undefined) {
    return new Response("Invalid Access to post", { status: 404 });
  }
  const { commentId } = await request.json();

  try {
    await connectToDB();

    const foundComment = await Comment.findById(commentId);

    if (!foundComment) {
      return new Response("Comment Not Found", { status: 404 });
    }

    if (foundComment.likes.includes(id)) {
      foundComment.likes = foundComment.likes.filter(
        (id) => id.toString() !== id.toString()
      );
    } else {
      const newId = new ObjectId(id);
      foundComment.likes.push(newId);
    }

    // Save both
    await foundComment.save();

    // Return updated post
    return new Response(
      JSON.stringify({ status: 200, likes: foundComment.likes })
    );
  } catch (error) {
    console.error("Error Updating User:", error);
    return new Response(
      JSON.stringify({ status: 500, error: "Error Updating User" }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
