import { getTokenData } from "@/helpers/getTokenData";
import User from "@/models/user";
import { connectToDB } from "@/utils/database";

export const GET = async (request, { params }) => {
    try {
        await connectToDB();
        const tokenData = await getTokenData(request);
        if (!tokenData) {
          return new Response(JSON.stringify({ error: "Unauthorized access" }), {
            status: 404,
          });
        }
        
        // Create a regular expression with 'params.input' to find partial matches
        const decodedInput = decodeURIComponent(params.input);
        const regex = new RegExp(decodedInput, 'i');

        // Include partial matches on 'username', 'family_name', and 'given_name'
        const searchQuery = {
            $or: [
                { username: { $regex: regex } },
                { family_name: { $regex: regex } },
                { given_name: { $regex: regex } },
            ]
        };
        
        // Perform the search using the 'User' model with the regular expression query
        const users = await User.find(searchQuery).limit(10);
        
        return new Response(JSON.stringify(users), { status: 200 });
    } catch (error) {
        return new Response("Failed to fetch users", { status: 500 });
    }
};
