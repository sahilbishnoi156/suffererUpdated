"use client";
import MainProfile from "@/Components/Profile/MainProfile";
import { useUserStore } from "@/stateManagment/zustand";
import Head from "next/head";
import { useState, useEffect } from "react";
import LoadingBar from "react-top-loading-bar";

export default function page({ params }) {
  //* Store states
  const { setCurrentUserData, routeUserData, setRouteUserData, currentUserData } = useUserStore();

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Fetch Data
  const fetchUsers = async () => {
    setProgress(20);
    setLoading(true);
    try {
      //! Getting Route User
      const rUser = await fetch(`/api/user/getUser/byUsername/${params.username}`);
      if (!rUser.ok) {
        throw new Error(`Failed to fetch user: ${rUser.statusText}`);
      }
      const rData = await rUser.json();
      setRouteUserData(rData);
      setProgress(80);
      setLoading(false);

      //! Getting Current User
      const cUser = await fetch(`/api/user/getUser`);
      if (!cUser.ok) {
        throw new Error(`Failed to fetch user: ${cUser.statusText}`);
      }
      const cCata = await cUser.json();
      setCurrentUserData(cCata)
      setProgress(100);
    } catch (error) {
      console.error(error);
    }
  };
  
  // use Effect
  useEffect(() => {
    if(document && routeUserData){
      document.title = `${routeUserData?.user?.given_name} ${routeUserData?.user?.family_name} (@${routeUserData?.user?.username})`;
    }
    if(Object.keys(routeUserData).length === 0){
      fetchUsers();
    }
  }, [routeUserData]);

  return (
    <div className="w-full flex justify-center items-center mb-16">
      <LoadingBar
        color="#f11946"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <MainProfile
        routeUser={routeUserData?.user}
        routeUserData={routeUserData}
        routeUserPosts={routeUserData?.posts}
        setRouteUser={setRouteUserData}
        section={`${routeUserData?.user?.username}'s`}
        setProgress={setProgress}
        progress={progress}
        loading={loading}
        params={params}
      />
    </div>
  );
}
