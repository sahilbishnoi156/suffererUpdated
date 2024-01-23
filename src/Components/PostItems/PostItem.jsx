"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-toastify";
import "@/styles/profile.css";
import { useUserStore } from "@/stateManagment/zustand";
import _ from "lodash";
import PostInfoTab from "./PostInfoTab";
import moment from "moment";
import CommentM from "@/Components/Modals/CommentM";
import { Tooltip } from "@nextui-org/react";
import ShowUserM from "../Modals/ShowUserM";
import Image from "next/image";

export default function PostItem({ post, id }) {
  // User States
  const { currentUserData } = useUserStore();

  // local states
  const pathname = usePathname();
  const [postTime, setPostTime] = useState("");
  const [togglePostInfo, setTogglePostInfo] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [messagePoped, setMessagePoped] = useState(false);
  const [isGetCommentsClicked, setIsGetCommentsClicked] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsData, setCommentsData] = useState([]);
  const [commentPosting, setCommentPosting] = useState(false);
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

  const handleCommentPost = async (e) => {
    setCommentPosting(true);
    e.preventDefault();
    try {
      const response = await fetch("api/posts/action/comment/createNew", {
        method: "POST",
        body: JSON.stringify({
          content: commentInput,
          post: id,
          postCreator: post?.creator?._id,
        }),
      });
      if (response.status === 200) {
        getComments();
        setMessagePoped(true);
        setTimeout(() => {
          setMessagePoped(false);
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setCommentPosting(false);
      setCommentInput("");
    }
  };

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
        if (window) {
          window.location.reload();
        } else {
          router.push("/");
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

  //! Get Comments
  const getComments = async () => {
    setCommentsLoading(true);
    try {
      const response = await fetch("/api/posts/action/comment/getComments", {
        method: "POST",
        body: JSON.stringify({
          postId: id,
        }),
      });
      const data = await response.json();
      setCommentsData(data);
    } catch (error) {
      console.log(error);
    } finally {
      setCommentsLoading(false);
    }
  };

  //! Use Effect HOOK
  useEffect(() => {
    if (id && isGetCommentsClicked) {
      getComments();
    }

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

    const createdAtDate = moment(post?.createdAt);
    const now = moment();
    setPostTime(moment.duration(now.diff(createdAtDate)).humanize());
  }, [post, currentUserData, isGetCommentsClicked]);
  return (
    <div
      className={`text-white lg:w-3/4 w-full h-fit bg-black border border-slate-500 sm:rounded-xl rounded-lg flex flex-col items-center justify-between`}
      id={id}
    >
      {messagePoped && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  ">
          <div className="bg-[#292929] py-2 px-4 rounded-lg notficationPop text-sm">
            Commented
          </div>
        </div>
      )}

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
      <div className="w-full h-fit p-2 px-2">
        {/* User Profile  */}
        <div className="w-full flex items-center justify-between pb-2">
          <ShowUserM
            user={post?.creator}
            image={post?.creator?.image}
            handleUserIdClick={handleUserIdClick}
            postTime={postTime}
          />
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
        <p className="text-gray-200 text-start sm:text-lg whitespace-pre-line text-sm h-fit">
          {post?.caption}
        </p>
      </div>
      {post?.image && (
        <div className="w-full h-full mt-2 overflow-hidden">
          <div className=" h-full w-full p-2">
            <Image
              src={post?.image}
              alt="notFound"
              height={1980}
              width={1080}
              className="w-full max-h-96 h-full object-contain select-none rounded-base"
              draggable={false}
            />
          </div>
        </div>
      )}
      <div className="w-full px-4">
        <div className="flex items-center justify-start gap-4 w-full pt-2">
          {Object.keys(currentUserData).length !== 0 && (
            <div className="flex flex-col items-center justify-center">
              <i
                className={`fa-${
                  postInfo?.like?.isLiked ? "solid" : "regular"
                } fa-heart cursor-pointer transition duration-300 text-lg sm:text-xl`}
                onClick={handlePostLike}
              ></i>
            </div>
          )}
          <div className="flex flex-col items-center justify-center">
            <CommentM
              buttonData={
                <i className="fa-regular fa-comment text-lg sm:text-xl cursor-pointer"></i>
              }
              post={post}
              postTime={postTime}
              commentsData={commentsData}
              setCommentsData={setCommentsData}
              commentsLoading={commentsLoading}
              setIsGetCommentsClicked={setIsGetCommentsClicked}
              commentInput={commentInput}
              getComments={getComments}
              setCommentInput={setCommentInput}
              commentsLen={postInfo?.comment?.number}
              handleCommentPost={handleCommentPost}
              commentPosting={commentPosting}
            />
          </div>
          <div className="flex flex-col items-center justify-center">
            <i className="fa-solid fa-share text-lg sm:text-xl cursor-pointer"></i>
          </div>
        </div>
        <div className="text-sm pt-2 flex items-center justify-between">
          <div className="">{postInfo?.like?.number} likes</div>
          <Tooltip
            placement={"right"}
            content={"shares"}
            showArrow
            className="bg-[#151515] text-white"
          >
            <div className="flex items-center justify-center gap-1 text-xs">
              <i className="fa-solid fa-share"></i>
              {postInfo?.share?.number}
            </div>
          </Tooltip>
        </div>
        <div className="flex items-center justify-start text-gray-400 text-base w-full">
          <CommentM
            buttonData={null}
            post={post}
            postTime={postTime}
            commentsData={commentsData}
            setCommentsData={setCommentsData}
            commentsLoading={commentsLoading}
            getComments={getComments}
            setIsGetCommentsClicked={setIsGetCommentsClicked}
            commentInput={commentInput}
            setCommentInput={setCommentInput}
            commentsLen={postInfo?.comment?.number}
            handleCommentPost={handleCommentPost}
            commentPosting={commentPosting}
          />
        </div>
        <form
          className="pb-2 flex items-center justify-between relative"
          onSubmit={handleCommentPost}
        >
          <input
            type="text"
            name="comment"
            id="comment"
            value={commentInput}
            onChange={(e) => {
              setCommentInput(e.target.value);
            }}
            placeholder="Add a comment"
            className="bg-transparent outline-none text-white text-sm w-full pr-4"
            autoComplete="off"
          />
          {commentPosting ? (
            <svg
              aria-hidden="true"
              role="status"
              className="inline w-4 h-4 text-white animate-spin"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="#E5E7EB"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentColor"
              />
            </svg>
          ) : (
            <i className="fa-regular fa-face-smile-wink text-sm"></i>
          )}
        </form>
      </div>
    </div>
  );
}
