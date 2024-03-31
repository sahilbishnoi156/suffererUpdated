import { getTokenData } from "@/helpers/getTokenData";
import User from "@/models/user";
import Post from "@/models/post";
import { connectToDB } from "@/utils/database";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  try {
    await connectToDB();
    const token = (await request.cookies.get("authToken"))?.value;
    if (!token) {
      return new Response(JSON.stringify({ isLoggedIn: false }), {
        status: 404,
      });
    }
    const tokenData = await getTokenData(request);
    if (!tokenData) {
      return new Response(JSON.stringify({ error: "Token Not Found" }), {
        status: 404,
      });
    }
    // Find the user
    const foundUser = await User.findById(tokenData._id);
    if (!foundUser) {
      return new Response(JSON.stringify({ error: "user not found" }), {
        status: 404,
      });
    }
    // Combine user, posts, savedPosts, and likedPosts data
    const data = {
      user: foundUser,
      isLoggedIn: true
    };

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      const response = NextResponse.json({
        error: "tokenExpired",
        tokenExpired: true,
      });
      await response.cookies.delete("authToken");
      return response;
    }
    return new Response("Failed to fetch User", { status: 500 });
  }
};
