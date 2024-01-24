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
      const postsResponse = await fetch(
        `/api/posts?_limit=4`,
        {
          next: { revalidate: 60 },
          method: 'POST',
          body: JSON.stringify({
            userId: currentUserData?.user?._id
          })
        }
      );
      setProgress(50);
      const postsData = await postsResponse.json();
      setMainPagePosts(postsData?.posts)
    } catch (error) {
      console.log(error);
    }finally{
      setDataLoading(false)
      setProgress(100);
    }
  };
  const fetchData = async () => {
    try {
      const userResponse = await fetch(`/api/user/getUser`);
      setProgress(80);
      const data = await userResponse.json();
      if (!data.tokenExpired) {
        setCurrentUserData(data);
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
      setProgress(100);
    }
  };

  const fetchMoreData = async () => {
    const response = await fetch(
      `/api/posts?_start=${mainPagePosts?.length}&_limit=4`,
      {
        next: { revalidate: 60 },
        method: 'POST',
        body: JSON.stringify({
          userId: currentUserData?.user?._id
        })
      }
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
    if (mainPagePosts?.length <= 0 && Object.keys(currentUserData)?.length !== 0) {
      fetchInitialPosts();
    }

    if (Object.keys(currentUserData)?.length === 0) {
      fetchData();
    }
  }, [currentUserData]);
  return (
    <>
      <div className="dark:text-white text-black box-border flex justify-end dark:bg-black bg-white ">
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
