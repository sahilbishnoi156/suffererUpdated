import mongoose, { Schema, model, models }  from "mongoose"
const { ObjectId } = mongoose.Schema.Types;

const CommentSchema = new Schema({
  content: { type: String, required: true, trim: true },
  creator: {
    type: {
      _id: { type: ObjectId, ref: "User", required: true },
      name: String,
      image: String,
      username: String,
    },
    required: true,
  },
  likes:{
    type: [{ type: ObjectId, ref: "User" }],
    default: []
  },
  parentComment: { type: ObjectId, ref: "Comment" },
  post: { type: ObjectId, ref: "Post", required: true },
  flagged: { type: Boolean, default: false },
}, { timestamps: true });

const Comment = models.Comment || model("Comment", CommentSchema);

export default Comment;
