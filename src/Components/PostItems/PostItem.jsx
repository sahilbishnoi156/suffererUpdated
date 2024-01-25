"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
      const response = await fetch("/api/posts/action/comment/createNew", {
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
    router.push(`/profile/${post?.creator?.username}`);
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
          isSaved: currentUserData?.user?.savedPosts?.some(
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
      className={`dark:text-white text-black sm:w-3/5 w-full h-fit dark:bg-black bg-white border sm:dark:rounded-xl sm:rounded rounded-lg flex flex-col items-center justify-between `}
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
      <div className="w-full h-fit pt-2 px-2">
        {/* User Profile  */}
        <div className="w-full flex items-center justify-between pb-2">
          <ShowUserM
            user={post?.creator}
            image={post?.creator?.image}
            handleUserIdClick={handleUserIdClick}
            postTime={postTime}
          />
          <Tooltip
            placement={"top"}
            content={"More options"}
            showArrow
            size="sm"
            color="foreground"
          >
            <div
              className="w-8 h-8 flex items-center justify-center cursor-pointer"
              onClick={() => setTogglePostInfo(!togglePostInfo)}
            >
              <i className="fa-solid fa-ellipsis-vertical fa-rotate-90 mr-2 cursor-pointer select-none"></i>
            </div>
          </Tooltip>
        </div>

        <div className="w-full h-[1px] bg-slate-500 self-center dark:block hidden"></div>
      </div>
      {/* Post Body  */}
      <div className="rounded-sm dark:p-2 p-1 w-full">
        {post?.image && (
          <div className=" h-full w-full aspect-square relative">
            <Image
              src={post?.image}
              alt="notFound"
              fill
              sizes="(max-width: 768px) 100vw, 700px"
              className="object-cover select-none rounded-sm"
              draggable={false}
            />
          </div>
        )}
        <div className="w-full h-fit overflow-hidden " id="post-item">
          <p className="dark:text-gray-200 text-slate-700 text-start sm:text-base whitespace-pre-line text-sm h-fit">
            {post?.caption}
          </p>
        </div>
      </div>
      <div className="w-full px-2">
        <div className="flex items-center justify-start gap-4 w-full">
          {Object.keys(currentUserData).length !== 0 && (
            <div className="flex flex-col items-center justify-center">
              <i
                className={`${
                  postInfo?.like?.isLiked
                    ? "fa-solid text-red-500 "
                    : "fa-regular"
                } fa-heart cursor-pointer transition duration-300 text-lg sm:text-xl `}
                onClick={handlePostLike}
              ></i>
            </div>
          )}
          <div className="flex flex-col items-center justify-center">
            {Object.keys(currentUserData).length !== 0 && 
            <CommentM
              buttonData={
                <svg
                  aria-label="Comment"
                  className="x1lliihq x1n2onr6 x5n08af cursor-pointer"
                  fill="currentColor"
                  height="20"
                  role="img"
                  viewBox="0 0 24 24"
                  width="20"
                >
                  <title>Comment</title>
                  <path
                    d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
                    fill="none"
                    stroke="currentColor"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  ></path>
                </svg>
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
            />}
          </div>
          <div className="flex flex-col items-center justify-center">
            <svg
              aria-label="Share Post"
              className="x1lliihq x1n2onr6 x5n08af cursor-pointer"
              fill="currentColor"
              height="20"
              role="img"
              viewBox="0 0 24 24"
              width="20"
            >
              <title>Share Post</title>
              <line
                fill="none"
                stroke="currentColor"
                strokeLinejoin="round"
                strokeWidth="2"
                x1="22"
                x2="9.218"
                y1="3"
                y2="10.083"
              ></line>
              <polygon
                fill="none"
                points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"
                stroke="currentColor"
                strokeLinejoin="round"
                strokeWidth="2"
              ></polygon>
            </svg>
          </div>
        </div>
        <div className="text-sm flex items-center justify-between">
          <div className="">{postInfo?.like?.number} likes</div>
          <Tooltip
            placement={"top"}
            content={"shares"}
            showArrow
            color="primary"
          >
            <div className="flex items-center justify-center gap-1 text-xs">
              <i className="fa-solid fa-share"></i>
              {postInfo?.share?.number}
            </div>
          </Tooltip>
        </div>
        <div className="flex items-center justify-start text-gray-300 text-base w-full">
          {Object.keys(currentUserData).length !== 0 &&
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
          />}
        </div>
        {Object.keys(currentUserData).length !== 0 && 
        <form
          className="pb-2 flex items-center justify-between relative"
          onSubmit={handleCommentPost}
        >
          <input
            type="text"
            name="comment"
            id={`comment-${id}`}
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
        </form>}
      </div>
    </div>
  );
}
