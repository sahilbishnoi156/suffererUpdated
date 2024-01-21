"use client";
import React, { useEffect, useState } from "react";
import PostItem from "@/Components/PostItems/PostItem";
import LoadingBar from "react-top-loading-bar";
import Skeleton from "@/Components/Skeleton";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stateManagment/zustand";


export default function Page({ params }) {
  const [dataLoading, setDataLoading] = useState(false);
  const [currentPost, setCurrentPost] = useState({});
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  // Zustand States
  const { currentUserData, setCurrentUserData } = useUserStore();

  // Fetching Current post
  const fetchPost = async () => {
    setDataLoading(true);
    setProgress(30);
    try {
      const response = await fetch(`/api/posts/${params.id}`);
      if(response.status === 200) {
        const data = await response.json();
        setCurrentPost(data);
        return;
      }
      toast.warn(`Invalid Link`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      router.push("/")
    } catch (error) {
      console.log(error)
    } finally{
      setProgress(100);
      setDataLoading(false);
    }
    
  };

  // fetching current User if it is
  const fetchCurrentUser = async () => {
    setProgress(60);
    try {
      const response = await fetch(`/api/user/getUser`);
      const data = await response.json();
      setCurrentUserData(data);
    } catch (error) {
      console.log(error);
    } finally{
      setProgress(100);
    }
  };

  useEffect(() => {
    if(Object.keys(currentUserData).length === 0){
      fetchCurrentUser();
    }
    fetchPost();
  }, []);


  return (
    <div className="w-screen h-screen bg-black flex items-center justify-center">
      <LoadingBar
        color="#f11946"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <div className="w-3/4  flex items-center justify-center">
        {dataLoading ? (
          <Skeleton type="quotes" />
        ) : (
          <>
            {currentPost.creator && (
              <PostItem
                id={currentPost._id}
                post={currentPost}
                setCurrentData={setCurrentPost}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
