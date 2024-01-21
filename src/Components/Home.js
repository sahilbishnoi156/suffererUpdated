"use client";
import React, { useEffect, useState } from "react";
import SideProfile from "@/Components/Profile/SideProfile";
import LoadingBar from "react-top-loading-bar";
import Posts from "@/Components/PostItems/Posts";
import InfiniteScroll from "react-infinite-scroll-component";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useUserStore } from "@/stateManagment/zustand";

export default function Home() {
  const { setCurrentUserData, currentUserData, setMainPagePosts, mainPagePosts } = useUserStore();
  // const [posts, setPosts] = useState([]);
  const [progress, setProgress] = useState(0);
  const [dataLoading, setDataLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);

  const router = useRouter();

  const fetchInitialPosts = async () => {
    setDataLoading(true);
    setProgress(30);
    try {
      const timestamp = new Date().getTime();
      const postsResponse = await fetch(
        `/api/posts?_limit=4&timestamp=${timestamp}`,
        {
          next: { revalidate: 60 },
        }
      );
      setProgress(50);
      const postsData = await postsResponse.json();
      setMainPagePosts(postsData?.posts)
      // setPosts(postsData?.posts);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchData = async () => {
    try {
      const userResponse = await fetch(`/api/user/getUser`);
      setProgress(80);
      const data = await userResponse.json();
      if (!data.tokenExpired) {
        setCurrentUserData(data);
        setDataLoading(false);
        setProgress(100);
        return;
      }
      toast.warn(`Session Expired Please SignIn Again!`, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      router.push("/signIn");
    } catch (error) {
      console.log("Failed to get data", error);
    } finally {
      setDataLoading(false);
      setProgress(100);
    }
  };

  const fetchMoreData = async () => {
    const timestamp = new Date().getTime();
    const response = await fetch(
      `/api/posts?_start=${mainPagePosts?.length}&_limit=4&timestamp=${timestamp}`
    );
    const data = await response.json();
    setMainPagePosts([...mainPagePosts, ...data.posts]);
    // setPosts((prevPosts) => [...prevPosts, ...data.posts]);
    setHasMoreData(data.totalPosts > mainPagePosts?.length);
  };

  const Loader = () => (
    <div
      className={`w-full flex items-center justify-center mb-12 ${
        mainPagePosts?.length < 4 && "opacity-0"
      }`}
    >
      <h2 className="text-white">Loading...</h2>
    </div>
  );

  useEffect(() => {
    if (mainPagePosts?.length <= 0) {
      fetchInitialPosts();
    }

    if (Object.keys(currentUserData)?.length === 0) {
      fetchData();
    }
  }, []);
  return (
    <>
      <div className="text-white box-border flex justify-end bg-black ">
        <LoadingBar
          color="#f11946"
          progress={progress}
          onLoaderFinished={() => setProgress(0)}
        />
        <div className="w-full sm:pl-20 p-2">
          <InfiniteScroll
            dataLength={mainPagePosts?.length}
            next={fetchMoreData}
            hasMore={hasMoreData}
            loader={<Loader />}
          >
            <Posts
              posts={mainPagePosts}
              section={"Trending"}
              dataLoading={dataLoading}
            />
          </InfiniteScroll>
        </div>
        <div
          className="xl:block hidden"
          id="side-profile"
          style={{ minWidth: "30%" }}
        >
          <SideProfile currentUser={currentUserData?.user} />
        </div>
      </div>
    </>
  );
}
