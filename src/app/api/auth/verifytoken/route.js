import User from "@/models/user";
import { connectToDB } from "@/utils/database";
import { NextRequest, NextResponse } from "next/server";

connectToDB();
export async function POST(request){
    try {
        const { token } = await request.json();
        const user = await User.findOne({verifyToken: token, verifyTokenExpiry: {$gt: Date.now()}});

        if(!user){
            return NextResponse.json({ error: "Invalid token" }, {status: 404})
        }
        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;
        await user.save();

        return NextResponse.json({message: "Email verified"}, {status: 200})
    } catch (error) {
        return NextResponse.json({ error: error.message}, { status: error.status})
    }
}