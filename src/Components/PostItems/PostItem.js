"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-toastify";
import "@/styles/profile.css";
import { useUserStore } from "@/stateManagment/zustand";
import _ from "lodash";
import PostInfoTab from "./PostInfoTab";

export default function PostItem({ post, id }) {
  // User States
  const { currentUserData } = useUserStore();

  // local states
  const pathname = usePathname();
  const [postTime, setPostTime] = useState("");
  const [togglePostInfo, setTogglePostInfo] = useState(false);
  const router = useRouter();

  const [postInfo, setPostInfo] = useState({
    like: {
      isLiked: false,
      number: 0,
    },
    save: {
      isSaved: false,
    },
    share: {
      number: 0,
    },
    comment: {
      number: 0,
    },
    report: {
      isReported: false,
    },
    textCopied: {
      isCopied: false,
    },
  });

  const handleDelete = async () => {
    const hasConfirmed = confirm(`Do your really want to delete this post`);

    if (hasConfirmed) {
      try {
        await fetch(`/api/posts/${id.toString()}`, {
          method: "DELETE",
        });

        toast.info(`Post Deleted`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });

         // Reload the page after successful deletion
         if(window){
          window.location.reload()
         }else{
          router.push('/')
         }
        
      } catch (error) {
        console.log(error);
      }
    } else {
      toast.info(`Your Post Is Safe`, {
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
  };

  //! Post Saving Login Here
  const handlePostSave = () => {
    setPostInfo((prevPostInfo) => ({
      ...prevPostInfo,
      save: {
        isSaved: !prevPostInfo?.save?.isSaved,
      },
    }));
    debouncedSavePost();
  };

  const debouncedSavePost = _.debounce(async () => {
    try {
      const response = await fetch(`/api/posts/action/save`, {
        method: "PATCH",
        body: JSON.stringify({
          postId: id,
        }),
      });
      const data = await response.json();

      if (data.status !== 200) {
        throw new Error(data.message || "Something went wrong");
      }
    } catch (error) {
      setPostInfo((prevPostInfo) => ({
        ...prevPostInfo,
        save: {
          isSaved: !prevPostInfo?.save?.isSaved,
        },
      }));
      console.log(error);
    }
  }, 2000);

  //! Post Liking Login Here
  const handlePostLike = () => {
    setPostInfo((prevPostInfo) => ({
      ...prevPostInfo,
      like: {
        isLiked: !prevPostInfo?.like?.isLiked,
        number: prevPostInfo?.like?.isLiked
          ? prevPostInfo?.like?.number - 1
          : prevPostInfo?.like?.number + 1,
      },
    }));
    debouncedLikePost();
  };
  const debouncedLikePost = _.debounce(async () => {
    try {
      const response = await fetch(`/api/posts/action/like`, {
        method: "PATCH",
        body: JSON.stringify({
          postId: id,
        }),
      });
      const data = await response.json();
      if (data.status !== 200) {
        throw new Error(data.message || "Something went wrong");
      }
    } catch (error) {
      setPostInfo((prevPostInfo) => ({
        ...prevPostInfo,
        like: {
          isLiked: !prevPostInfo?.like?.isLiked,
          number: prevPostInfo?.like?.isLiked
            ? prevPostInfo?.like?.number - 1
            : prevPostInfo?.like?.number + 1,
        },
      }));
      console.log(error);
    }
  }, 2000);

  //! Handle User Id Click
  const handleUserIdClick = () => {
    if (pathname !== "/profile") {
      if (post?.creator._id === currentUserData?.user?._id)
        return router.push(`/profile`);
      router.push(`/profile/${post?.creator?.username}`);
    }
  };

  //! Use Effect HOOK
  useEffect(() => {
    if (post && currentUserData) {
      setPostInfo({
        like: {
          isLiked: post?.likes.includes(currentUserData?.user?._id),
          number: post?.likes?.length,
        },
        share: {
          number: post?.shares,
        },
        comment: {
          number: post?.comments?.length,
        },
        save: {
          isSaved: currentUserData?.savedPosts?.some(
            (savedPost) => savedPost?._id === post?._id
          ),
        },
      });
    }
    
    
    const postDate = post?.date || post?.createdAt
    const jsonDate = new Date(parseFloat(postDate));
    
    const today = new Date();
    let timeDifference = Math.floor((today - jsonDate) / (60 * 1000)); // Time difference in minutes
    if(timeDifference > 10000000) {
      timeDifference = Math.floor((today - new Date(postDate)) / (60 * 1000)); // Time difference in minutes
    }

    if (timeDifference < 1) {
      // Less than 1 minute
      setPostTime("few seconds ago");
    } else if (timeDifference < 60) {
      // Less than 1 hour
      setPostTime(`${timeDifference}m ago`);
    } else if (timeDifference < 1440) {
      // Less than 24 hours
      const hoursDifference = Math.floor(timeDifference / 60);
      setPostTime(`${hoursDifference}h ago`);
    } else {
      // More than 24 hours
      const daysDifference = Math.floor(timeDifference / 1440);
      setPostTime(`${daysDifference}d ago`);
    }
  }, [post, currentUserData]);
  return (
    <div
      className={`text-white lg:w-3/4 w-full h-fit bg-black border border-slate-500 sm:rounded-3xl rounded-xl flex flex-col items-center justify-between`}
      id={id}
    >
      {/* DropDown */}
      {togglePostInfo && (
        <PostInfoTab
          id={id}
          handlePostSave={handlePostSave}
          post={post}
          postInfo={postInfo}
          setPostInfo={setPostInfo}
          handleDelete={handleDelete}
          currentUserData={currentUserData}
          setTogglePostInfo={setTogglePostInfo}
        />
      )}
      <div className="w-full h-fit p-2 sm:p-4">
        {/* User Profile  */}
        <div className="w-full flex items-center justify-between pb-2 sm:pb-4">
          <div
            className="w-fit flex items-center justify-start gap-4 overflow-hidden cursor-pointer"
            onClick={handleUserIdClick}
          >
            <img
              draggable="false"
              src={post?.creator?.image}
              alt="not found"
              className="h-8 w-8 rounded-full object-cover select-none"
            />
            <span className="flex items-center justify-center">
              <div className="sm:text-lg text-sm flex items-center justify-center gap-0 sm:gap-1 sm:flex-row flex-col select-none">
                @{post?.creator?.username}
                <span className="text-slate-400 sm:inline hidden">·</span>
                <span className="text-xs text-slate-400 sm:text-sm self-start sm:self-center h-full">
                  {postTime || ""}
                </span>
              </div>
            </span>
          </div>
          <div className="flex gap-6 items-center justify-center">
            <div
              className="w-8 h-8 flex items-center justify-center cursor-pointer"
              onClick={() => setTogglePostInfo(!togglePostInfo)}
            >
              <i className="fa-solid fa-ellipsis-vertical fa-rotate-90 mr-2 cursor-pointer select-none"></i>
            </div>
          </div>
        </div>

        <div className="w-full h-[1px] bg-slate-500 self-center"></div>
      </div>
      {/* Post Body  */}
      <div className="w-full h-fit overflow-hidden px-2 sm:px-4" id="post-item">
        <p className="text-gray-400 text-start sm:text-lg whitespace-pre-line text-sm h-fit">
          {post?.caption}
        </p>
      </div>
      {post?.image && (
        <div className="w-full h-full mt-2 overflow-hidden">
          <div className=" h-full w-full p-2">
            <img
              src={post?.image}
              alt="Not found"
              draggable="false"
              className="w-full max-h-96 h-full object-contain select-none rounded-sm"
            />
          </div>
        </div>
      )}
      <div className="w-full px-4">
        <div className="mt-2 flex justify-between items-center w-full text-xs ">
          <p className="flex gap-1 items-center justify-center">
            <i className="fa-solid fa-heart"></i>
            {postInfo?.like?.number}
          </p>
          <div className="flex gap-2">
            <p className="flex gap-1 items-center justify-center">
              <i className="fa-regular fa-comment"></i>
              {postInfo?.comment?.number}
            </p>
            <p className="flex gap-1 items-center justify-center">
              <i className="fa-solid fa-share "></i>
              {postInfo?.share?.number}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-start gap-4 w-full py-2 sm:py-4">
          {Object.keys(currentUserData).length !== 0 && (
            <div className="flex flex-col items-center justify-center">
              <i
                className={`fa-${
                  postInfo?.like?.isLiked ? "solid" : "regular"
                } fa-heart cursor-pointer transition duration-300 text-lg sm:text-2xl`}
                onClick={handlePostLike}
              ></i>
            </div>
          )}
          <div className="flex flex-col items-center justify-center">
            <i className="fa-regular fa-comment text-lg sm:text-2xl cursor-pointer"></i>
          </div>
          <div className="flex flex-col items-center justify-center">
            <i className="fa-solid fa-share text-lg sm:text-2xl cursor-pointer"></i>
          </div>
        </div>
      </div>
    </div>
  );
}
