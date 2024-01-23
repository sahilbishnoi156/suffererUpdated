"use client";
import UploadPost from "@/Components/PostItems/UploadPost";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function create() {
  const [post, setPost] = useState({ caption: "", image: "" });
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState(null)
  const [submitting, setIsSubmitting] = useState(false);

  const createQuote = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (imageUrl) {
      const formData = new FormData();
      formData.append("file", imageUrl);
      formData.append("upload_preset", "gmgscbus");
      const ImageResponse = await fetch(
        "https://api.cloudinary.com/v1_1/dlhxapeva/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const imageJsonData = await ImageResponse.json();
      var usrCldImage = imageJsonData.url;
      setPost({...post, image:imageJsonData.url});
    }

    try {
      const response = await fetch("/api/posts/action/createNew", {
        method: "POST",
        body: JSON.stringify({
          caption: post.caption,
          image: usrCldImage || post.image,
        }),
      });
      if (response.ok) {
        router.push("/profile");
        toast.success(`Post is now live`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center flex-col py-8 mb-8 p-4">
      <h1 className="text-4xl sm:text-2xl font-bold text-center w-full sm:w-3/4 dark:text-white text-black mb-6">
        Create Post
      </h1>
      <UploadPost
        handleSubmit={createQuote}
        submitting={submitting}
        setPost={setPost}
        post={post}
        setImageUrl={setImageUrl}
        router={router}
      />
    </div>
  );
}
