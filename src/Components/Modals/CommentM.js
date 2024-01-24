import React from "react";
import moment from "moment";
import {
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
  Input,
  ScrollShadow,
  Avatar,
} from "@nextui-org/react";
import { useUserStore } from "@/stateManagment/zustand";
import Skeleton from "../Skeleton";
import CommentInfoM from "./CommentInfoM";
import { toast } from "react-toastify";

export default function CommentM({
  post,
  postTime,
  commentsData,
  commentsLoading,
  commentPosting,
  setIsGetCommentsClicked,
  commentInput,
  getComments,
  setCommentInput,
  commentsLen,
  handleCommentPost,
  buttonData,
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [smallWindow, setSmallWindow] = React.useState(false);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    if (window.innerWidth < 700) {
      setSmallWindow(true);
    }
  }, [window.innerWidth, inputRef.current]);

  return (
    <div className="flex flex-col gap-2 ">
      <button
        onClick={() => {
          setIsGetCommentsClicked(true);
          onOpen();
        }}
      >
        {buttonData
          ? buttonData
          : `See all ${
              commentsData?.length === 0 ? commentsLen : commentsData?.length
            } comments`}
      </button>
      <Modal
        isOpen={isOpen}
        backdrop="blur"
        size={`${post?.image ? "xl" : "xl"}`}
        onOpenChange={onOpenChange}
        scrollBehavior={"inside"}
        placement={`center`}
      >
        <ModalContent className="bg-white dark:bg-[#151515] dark:text-white text-black ">
          {(onClose) => (
            <>
              <ModalBody className="p-0 rounded-2xl">
                <div className="flex items-start flex-col justify-between w-full">
                  <div className="h-full w-full overflow-hidden cursor-pointer flex items-center justify-between pr-8 border-b-2 dark:border-gray-500 border-black p-4 sticky top-0 left-0 z-[-1] bg-white dark:bg-[#151515] ">
                    <div className="flex gap-3">
                      <Avatar
                        isBordered
                        color="danger"
                        radius="full"
                        size="md"
                        src={post?.creator?.image}
                      />
                      <div className="flex flex-col items-start justify-center">
                        <h4 className="text-small font-semibold leading-none dark:text-white text-black">
                          {post?.creator?.username}
                        </h4>
                        <h5 className="text-small tracking-tight text-default-500">
                          {postTime || ""}
                        </h5>
                      </div>
                    </div>
                  </div>
                  <ScrollShadow size={100} className="w-full flex items-start flex-col gap-8 p-4">
                    {commentsLoading
                      ? Array.from(
                          {
                            length:
                              commentsData?.length === 0
                                ? commentsLen
                                : commentsData?.length,
                          },
                          (_, index) => index
                        ).map((id) => {
                          return <Skeleton type="userId" key={id} />;
                        })
                      : commentsData?.length === 0
                      ? "No Comments"
                      : commentsData?.map((item) => {
                          return (
                            <CommentComponent
                              key={item?._id}
                              item={item}
                              getComments={getComments}
                            />
                          );
                        })}
                  </ScrollShadow>
                  <form
                    className="py-2  border-black  px-4 text-lg h-full w-full sticky bottom-0 left-0 bg-white dark:bg-[#151515]"
                    onSubmit={handleCommentPost}
                  >
                    <Input
                      type="text"
                      ref={inputRef}
                      className="dark:text-white text-black bg-none"
                      minRows={1}
                      color="white"
                      variant="bordered"
                      startContent={
                        <i className="fa-regular fa-face-smile-wink mr-4"></i>
                      }
                      placeholder="Add a comment"
                      value={commentInput}
                      onValueChange={setCommentInput}
                      autoComplete="off"
                      endContent={
                        commentPosting ? (
                          <svg
                            aria-hidden="true"
                            role="status"
                            className="inline w-4 h-4  text-white animate-spin"
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
                          <button
                            className="text-xs text-blue-500"
                            onClick={handleCommentPost}
                          >
                            post
                          </button>
                        )
                      }
                    />
                  </form>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export const CommentComponent = ({ item, getComments }) => {
  const createdAtDate = moment(item.createdAt);
  const now = moment();
  const difference = moment.duration(now.diff(createdAtDate));
  const { currentUserData } = useUserStore();
  const [commentInfo, setCommentInfo] = React.useState({
    likes: {
      isLiked: item?.likes?.includes(currentUserData?.user?._id) || false,
      number: item?.likes?.length || 0,
    },
  });

  const handleLikeComment = () => {
    setCommentInfo((prevCommentInfo) => ({
      ...prevCommentInfo,
      likes: {
        isLiked: !prevCommentInfo?.likes?.isLiked,
        number: prevCommentInfo?.likes?.isLiked
          ? prevCommentInfo?.likes?.number - 1
          : prevCommentInfo?.likes?.number + 1,
      },
    }));
    debouncedLikeComment();
  };

  const debouncedLikeComment = _.debounce(async () => {
    try {
      const response = await fetch(`/api/posts/action/comment/like`, {
        method: "PATCH",
        body: JSON.stringify({
          commentId: item?._id,
        }),
      });
      const data = await response.json();
      if (data.status !== 200) {
        throw new Error(data.message || "Something went wrong");
      }
    } catch (error) {
      setCommentInfo((prevCommentInfo) => ({
        ...prevCommentInfo,
        likes: {
          isLiked: !prevCommentInfo?.likes?.isLiked,
          number: prevCommentInfo?.likes?.isLiked
            ? prevCommentInfo?.likes?.number - 1
            : prevCommentInfo?.likes?.number + 1,
        },
      }));
      console.log(error);
    }
  }, 2000);

  const handleDelete = async () => {
    toast.warn("Deleting...", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    try {
      const response = await fetch("/api/posts/action/comment/delete", {
        method: "DELETE",
        body: JSON.stringify({
          commentId: item?._id,
        }),
      });

      if (response.status === 200) {
        toast.success("Deleted", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        getComments();
      }
    } catch (error) {
      toast.error("Something Went Wrong", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      console.log(error);
    }
  };

  return (
    <div className="flex items-start justify-between bg-white dark:bg-[#151515]  w-full group">
      <div className="flex items-start justify-start gap-2">
        <img
          className="rounded-full object-cover h-8 w-8 "
          src={item?.creator?.image}
          alt="notFound"
        />
        <div className="flex items-start justify-start flex-col">
            <div className="text-sm dark:text-white text-black w-full ">
              <span className="text-base  font-medium">@{item?.creator?.username}</span>
              <span className="ml-4 dark:text-gray-300 text-neutral-600 pr-2">
                {item?.content}
              </span>
            </div>
          <div className="flex items-start justify-center gap-2 text-xs dark:text-gray-400 text-slate-500">
            <span>{difference.humanize()}</span>
            <span>{commentInfo?.likes?.number || 0} likes</span>
            <span className="ml-4 text-sm">
              <CommentInfoM
                comment={item}
                user={currentUserData?.user}
                handleDelete={handleDelete}
              />
            </span>
          </div>
        </div>
      </div>
      <button
        className="ml-2 cursor-pointer"
        disabled={Object.keys(currentUserData).length === 0}
        onClick={handleLikeComment}
      >
        <i
          className={` ${
            commentInfo?.likes?.isLiked ? "fa-solid" : "fa-regular"
          } fa-heart cursor-pointer transition duration-300 text-xs`}
        />
      </button>
    </div>
  );
};
