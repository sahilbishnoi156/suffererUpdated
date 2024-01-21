import mongoose, { Schema, model, models } from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const PostSchema = new Schema({
  creator: { type: ObjectId, ref: "User" },
  image: { type: String },
  caption: { type: String },
  likes: [{ type: ObjectId, ref: "User" }],
  comments: [{ type: ObjectId, ref: 'Comment' }], 
  shares: {
    type: Number,
    default: 0,
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'friendsOnly'],
    default: 'public',
  },
}, {timestamps: true});
PostSchema.set("toJSON", { getters: true, virtuals: false, minimize: false });
const Post = models.Post || model("Post", PostSchema);

export default Post;
