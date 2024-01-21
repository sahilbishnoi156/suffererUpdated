import jwt from "jsonwebtoken";

export const getTokenData = async (request) => {
  try {
    const token = (await request.cookies.get("authToken"))?.value;
    const secretKey = process.env.JWT_SECRET;
    const tokenData = jwt.verify(token, secretKey);
    return tokenData || null;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {      
      throw error;
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("Invalid token");
    } else {
      throw new Error("Error verifying token");
    }
  }
};
