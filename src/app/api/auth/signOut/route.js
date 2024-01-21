import { NextResponse } from "next/server";

export const DELETE = async (request) => {
    try {
        const token = (await request.cookies.get("authToken"))?.value;
        if (token) {
            const response = NextResponse.json({message: "User Sign Out Successful"}, { status: 200 })
            response.cookies.delete("authToken");
            return response;
        } else {
            // If there is no token, it means the user is already signed out
            return new Response("User Already Signed Out", { status: 204 });
        }
    } catch (error) {
        console.error("Error deleting user and posts", error);
        return new Response("Internal Server Error", { status: 500 });
    }
};
