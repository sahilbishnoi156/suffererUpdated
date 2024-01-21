"use client";
import Setting from "@/Components/Setting";
import { useRouter } from "next/navigation";
import LoadingBar from "react-top-loading-bar";
import { useEffect, useState } from "react";
import { useUserStore } from "@/stateManagment/zustand";
import { toast } from "react-toastify";


export default function page() {
  // States
  const { currentUserData, setCurrentUserData } = useUserStore();
  const [progress, setProgress] = useState(0);

  // Hooks
  const router = useRouter();

  // Handling Logout
  const handleLogOut = async () => {
    setProgress(50);
    try {
      const response = await fetch('/api/auth/signOut',
      {method: "DELETE"},);
      if(response.status === 200){
        toast.success(`See ya later `, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        router.push('/welcome')
      }else{
        console.log(data)
        toast.error(`Something Wrong Happened`, {
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
      
    } catch (error) {
      console.log(error)
    }
    // router.push('/login');
    setProgress(100);
  };

  //! Fetching user details
  const fetchUser = async () => {
    try {
      setProgress(40);
      const response = await fetch(`/api/users/getUser`);
      setProgress(80);
      const data = await response.json();
      setCurrentUserData(data);
      setProgress(100);
    } catch (error) {
      console.log("Error Getting User",error);
    }
  };
  // useEffect
  useEffect(() => {
    if(document){
      document.title = "Settings · Sufferer";
    }
    if (Object.keys(currentUserData).length === 0) {
      fetchUser();
    }
  }, []);

  return (
    <div className="sm:p-10 p-4 w-full flex items-center justify-center mb-16">
      <LoadingBar
        color="#f11946"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <Setting
        user={currentUserData?.user}
        id={currentUserData?.user?._id}
        handleLogOut={handleLogOut}
        setProgress={setProgress}
      />
    </div>
  );
}
