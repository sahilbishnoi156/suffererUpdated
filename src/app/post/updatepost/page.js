"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import UploadPost from "@/Components/PostItems/UploadPost";
import Loading from "@/Components/Loading";
import Head from "next/head";


export default function page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const PostId = searchParams.get("id");
  const [imageUrl, setImageUrl] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [post, setPost] = useState({ caption: "", image: "" });
  const [postLoading, setPostLoading] = useState(false);

  useEffect(() => {
    const getPostDetails = async () => {
      setPostLoading(true)
      try {
        const response = await fetch(`/api/posts/${PostId}`);
        const data = await response.json();
        setPost({
          caption: data.caption,
          image: data.image,
        });
      } catch (error) {
        console.log(error, "Something wrong happened");
      }finally{
        setPostLoading(false)
      }
    };

    if (PostId) getPostDetails();
  }, [PostId]);

  const handleUpdatePost = async (e) => {
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

    if (!PostId) return setIsSubmitting(false);

    try {
      const response = await fetch(`/api/posts/${PostId}`, {
        method: "PATCH",
        body: JSON.stringify({
          caption: post.caption,
          image: usrCldImage || post.image,
        }),
      });
      if (response.ok) {
        toast.success("Updated Successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        router.push("/profile");
      }
    } catch (error) {
      toast.error("Something went wrong", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  if(postLoading){
    return <Loading/>
  }
  return (
    <div className="w-screen h-full flex items-center justify-center flex-col my-16">
      <Head></Head>
      <h1 className="text-4xl font-bold text-start w-3/4 h-full text-white mb-16 flex items-center justify-center">
        Edit Post
      </h1>
      <UploadPost
        handleSubmit={handleUpdatePost}
        submitting={isSubmitting}
        setPost={setPost}
        post={post}
        setImageUrl={setImageUrl}
        type="Update"
      />
    </div>
  );
}
