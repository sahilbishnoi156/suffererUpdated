import { getTokenData } from "@/helpers/getTokenData";
import User from "@/models/user";
import { connectToDB } from "@/utils/database";
import bcrypt from "bcrypt";

export const PATCH = async (request, { params }) => {
  const { old_password, password } = await request.json();
  try {
    await connectToDB();
    // Find the existing prompt by ID
    const existingUser = await User.findById(params.id);
    const tokenData = await getTokenData(request);
    if (!tokenData) {
      return new Response(JSON.stringify({ error: "Unauthorized access" }), {
        status: 404,
      });
    }

    const isMatch = await bcrypt.compare(old_password, existingUser.password);
    if (!isMatch) {
      return new Response("Invalid old Password", { status: 401 });
    }

    const salt = await bcrypt.genSalt(10);
    const secretPassword = await bcrypt.hash(password, salt);

    // Update the prompt with new data
    existingUser.password = secretPassword;

    await existingUser.save();
    return new Response("Password Updated Successfully", { status: 200 });
  } catch (error) {
    return new Response("Error Updating User", { status: 500 });
  }
};
