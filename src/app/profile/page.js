"use client";
import React from "react";
import LoadingBar from "react-top-loading-bar";
import MainProfile from "@/Components/Profile/MainProfile";
import { useLoadingStore, useUserStore } from "@/stateManagment/zustand";


export default function page() {
  //* Store states
  const { currentUserData, setCurrentUserData } = useUserStore();
  const { loading, setLoading, progress, setProgress } = useLoadingStore();
  
  //* fetch User
  const fetchUser = async () => {
    setProgress(20);
    setLoading(true);
    try {
      const response = await fetch(`/api/user/getUser`);
      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.statusText}`);
      }
      const data = await response.json();
      setCurrentUserData(data);
      setProgress(80);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setProgress(100);
    }
  };

  //* fetch user in background
  async function fetchUserWithoutLoading() {
    try {
      const response = await fetch(`/api/user/getUser`);
      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.statusText}`);
      }
      const data = await response.json();
      setCurrentUserData(data);
    } catch (error) {
      console.log(error)
    }
  }
  

  React.useEffect(() => {
    if(document){
      document.title = "Profile · Sufferer"
    }
      // Fetch Data
      if(Object.keys(currentUserData).length === 0){
        fetchUser();
      }else{
        fetchUserWithoutLoading();
      }
  }, []);

  return (
    <div className="w-full flex justify-center items-center mb-16 ">
      <LoadingBar
        color="#f11946"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <MainProfile
        routeUser={currentUserData?.user}
        routeUserData={currentUserData}
        routeUserPosts={currentUserData?.posts}
        setRouteUser={setCurrentUserData}
        section={"My"}
      />
    </div>
  );
}
