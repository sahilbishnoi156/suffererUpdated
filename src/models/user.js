import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: [true, "Username already exists!"],
      required: [true, "Username is required!"],
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      unique: [true, "Email already exists!"],
      required: [true, "Email is required!"],
      lowercase: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    dateOfBirth: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    location: {
      type: {
        type: String,
        default: 'Point',
      },
      coordinates :{
        type: Array,
        default:[0,0]
      }
    },
    phoneNumber: {
      type: String,
    },
    interests: {
      type: [String],
    },
    settings: {
      theme: {
        type: String,
        default: "light",
      },
      privateAccount: {
        type: Boolean,
        default: false,
      },
      timezone: {
        type: String,
        default: "UTC",
      },
    },
    notifications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notification",
      },
    ],
    password: {
      type: String,
      default: undefined,
    },
    given_name: {
      type: String,
      required: [true, "FirstName is required!"],
    },
    family_name: {
      type: String,
      default: "",
    },
    about: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/cnq/image/upload/v1586197723/noimage_d4ipmd.png",
    },
    // likedPosts: [{ '_id': {type: ObjectId, ref: "Post"}, likedAt: Date }],
    likedPosts: [
      {
        likedAt: {
          type: Date,
        },
        _id: {
          type: ObjectId,
          ref: "Post",
        },
      },
    ],
    savedPosts: [
      {
        savedAt: {
          type: Date,
        },
        _id: { type: ObjectId, ref: "Post" },
      },
    ],
    followers: [
      {
        followedAt: {
          type: Date,
        },
        _id: { type: ObjectId, ref: "User" },
      },
    ],
    followings: [
      {
        followedAt: {
          type: Date,
        },
        _id: { type: ObjectId, ref: "User" },
      },
    ],
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
  },
  { timestamps: true }
);

UserSchema.set("toJSON", { getters: true, virtuals: false, minimize: false });
UserSchema.index({ location: "2dsphere", username: 1 });

const User = mongoose.models.User || mongoose.model("User", UserSchema);


export default User;
