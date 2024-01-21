import mongoose, { Schema, model, models } from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const CommentSchema = new Schema({
    text: { type: String, required: true, trim:true },
    creator: { type: ObjectId, ref: 'User', required: true },
  }, { timestamps: true });
  
  const Comment = model('Comment', CommentSchema);
  export default Comment;
  