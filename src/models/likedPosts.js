import mongoose, { Schema, model, models } from "mongoose";
const { ObjectId } = mongoose.Schema.Types;
const LikedPostSchema = new Schema({
    user: { type: ObjectId, ref: 'User', required: true },
    post: { type: ObjectId, ref: 'Post', required: true },
  }, { timestamps: true });
  
const LikedPost = model('LikedPost', LikedPostSchema);
export default LikedPost;