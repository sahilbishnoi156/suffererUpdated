import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PostInfoTab({
  id,
  post,
  postInfo,
  setPostInfo,
  handleDelete,
  handlePostSave,
  currentUserData,
  setTogglePostInfo,
}) {
  const router = useRouter();

  //! Handle Edit Click
  const handleEditClick = () => {
    document.body.style.overflow = "auto";
    router.push(`/post/updatepost/?id=${id}`);
  };

  //! Handle Copy Link
  const handleCopyLink = async () => {
    setPostInfo((prevPostInfo) => ({
      ...prevPostInfo,
      textCopied: {
        isCopied: !prevPostInfo?.textCopied?.isCopied,
      },
    }));
    navigator.clipboard.writeText(`https://sufferer.vercel.app/post/${id}`);
  };

  React.useEffect(() => {
    if (window) {
      document.body.style.overflow = "hidden";
    }
  }, []);

  return (
    <div className="fixed top-0 right-0 h-screen w-screen backdrop-blur-lg rounded-3xl z-50">
      <div
        id="post-info"
        className="w-4/5 xl:w-1/4 scale-125 opacity-0 h-fit absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-[#151515] px-4 rounded-2xl"
      >
        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200 w-full h-full flex items-center justify-center gap-2 flex-col">
          {Object.keys(currentUserData)?.length !== 0 && (
            <>
              <li
                className="px-4 py-2 hover:rotate-2 cursor-pointer transition-all"
                onClick={handlePostSave}
              >
                <i
                  className={`fa-${
                    postInfo?.save?.isSaved ? "solid" : "regular"
                  } fa-bookmark mr-2`}
                ></i>
                {postInfo?.save?.isSaved ? "Saved" : "Save"}
              </li>
              <li className="w-full h-[1px] bg-slate-400"></li>
            </>
          )}
          {post?.creator?._id === currentUserData?.user?._id ? (
            <>
              <li
                className="block px-4 py-2 hover:rotate-2 cursor-pointer transition-all"
                onClick={handleEditClick}
              >
                <i className="fa-solid fa-pen-to-square cursor-pointer mr-2"></i>
                Edit Post
              </li>
              <li className="w-full h-[1px] bg-slate-400"></li>
              <li
                className="px-4 py-2 hover:rotate-2 text-red-400 cursor-pointer transition-all"
                onClick={handleDelete}
              >
                <i className="fa-solid fa-trash cursor-pointer mr-2"></i>
                Delete Post
              </li>
              <li className="w-full h-[1px] bg-slate-400"></li>
            </>
          ) : (
            <></>
          )}
          <li
            className="px-4 py-2 hover:rotate-2 cursor-pointer transition-all text-red-500 brightness-150"
            onClick={() => {
              setPostInfo((prevPostInfo) => ({
                ...prevPostInfo,
                report: {
                  isReported: !prevPostInfo?.report?.isReported,
                },
              }));
            }}
          >
            {postInfo?.report?.isReported ? (
              <>
                <i className="fa-regular fa-circle-check mr-2 "></i>
                Reported
              </>
            ) : (
              <>
                <i className="fa-regular fa-flag mr-2"></i>
                Report Post
              </>
            )}
          </li>
          <li className="w-full h-[1px] bg-slate-400"></li>
          <li
            className="px-4 py-2 hover:rotate-2 cursor-pointer transition-all"
            onClick={handleCopyLink}
          >
            {!postInfo?.textCopied?.isCopied ? (
              <>
                <i className="fa-regular fa-copy mr-2"></i>
                Copy Link
              </>
            ) : (
              <>
                <i className="fa-regular fa-circle-check mr-2 "></i>
                Copied
              </>
            )}
          </li>
          <li className="w-full h-[1px] bg-slate-400"></li>
          <li className="px-4 py-2 hover:rotate-2 cursor-pointer transition-all">
            <button
              onClick={() => {
                document.body.style.overflow = "auto";
                router.push(`/post/${id}`);
              }}
              className="h-full w-full"
            >
              <i className="fa-regular fa-eye-slash mr-2"></i>Go to post
            </button>
          </li>
          <li className="w-full h-[1px] bg-slate-400"></li>
          <li
            className="hover:rotate-2 cursor-pointer transition-all px-4 py-2"
            onClick={() => {
              document.body.style.overflow = "auto";
              setTogglePostInfo(false);
            }}
          >
            <i className="fa-solid fa-xmark mr-2"></i>
            Cancel
          </li>
        </ul>
      </div>
    </div>
  );
}
