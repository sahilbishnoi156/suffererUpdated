import User from "@/models/user";
import { connectToDB } from "@/utils/database";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
const JWT_SECRET = process.env.JWT_SECRET;

export const GET = async (request, { params }) => {
    try {
        await connectToDB();
        const FoundUser = await User.find({email:params.id});
        if (FoundUser[0].username) {
            const tokenData = {
                _id: FoundUser[0]._id,
                username: FoundUser[0].username,
                email: FoundUser[0].email
            } 
            const authToken = jwt.sign(tokenData, JWT_SECRET, {expiresIn: "1h"});
            const response = NextResponse.json({foundUsername:true}, { status: 200 })
            if(!response.cookies.get("authToken")){
                response.cookies.set("authToken", authToken, {httpOnly: true});
            }
            return response;
        }
        else{
            return new Response(JSON.stringify({foundUsername:false}), { status: 200 });
        }
    } catch (error) {
        return new Response("Failed to fetch User", { status: 500 });
    }
};
