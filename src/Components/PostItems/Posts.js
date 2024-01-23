import React from "react";
import PostItem from "./PostItem";
import Skeleton from "../Skeleton";
import Link from "next/link";

export default function Posts({
  posts,
  section,
  postType,
  dataLoading,
  pathname,
}) {
  return (
    <div
      id="post-area"
      className={`${
        section === "Trending"
          ? "flex justify-center items-center flex-col gap-6 p-2 py-8 pb-16 sm:p-8"
          : "flex items-center justify-center flex-col gap-6 mt-10"
      }`}
    >
      {section === "Trending" && (
        <div className="w-3/4 self-center flex items-center justify-center flex-col gap-2">
          <h1
            id="post-heading"
            className="text-2xl sm:text-4xl w-full text-center"
          >
            Sufferer
          </h1>
          <div className="h-[1px] w-1/2 bg-slate-400"></div>
        </div>
      )}
      {dataLoading ? (
        <div className="flex flex-col gap-8 w-full items-center justify-center">
        <Skeleton type="quotes" />
        <Skeleton type="quotes" />
        </div>
      ) : (
        <>
          {posts?.length > 0 ? (
            posts?.map((post) => {
              return (
                <PostItem
                  key={`${post.title}${post.image}${post.date || post.createdAt}`}
                  id={post._id}
                  post={post}
                />
              );
            })
          ) : (
            <div className="text-white">
              {section === "Trending" ? (
                "Nothing Here..."
              ) : (
                <>
                  {pathname === "/profile" ? (
                    (postType==="likedPosts" || postType==="savedPosts" ) ? <>Nothing Here</> :
                    <>
                      <Link
                        href="/post/createpost"
                        className="flex items-center justify-center flex-col gap-2 cursor-pointer "
                      >
                        <i className="fa-solid fa-camera text-6xl hover:scale-110 hover:text-yellow-500 transition duration-300"></i>
                        Post Your First Post
                      </Link>
                    </>
                  ):
                  <div>User hasn't post yet</div>
                  }
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
