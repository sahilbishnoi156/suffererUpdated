"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";

export default function VerifyToken() {
  const [token, setToken] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const router = useRouter();

  React.useEffect(() => {
    if(window){
      const mytoken = window.location.search.split("=")[1];
      setToken(mytoken || "");
    }
  }, []);

  React.useEffect(() => {
    if(document){
      document.title = "Verify Token · Sufferer Authentication System"
    }
    const verifyToken = async () => {
      try {
        setLoading(true);
        const response = await axios.post(`/api/users/verifytoken`, { token });
        console.log(response);
        router.push("/profile");
      } catch (error) {
        console.log("Token Verification failed", error);
      } finally {
        setLoading(false);
      }
    };
    if (token.length > 0) {
      verifyToken();
    }
  }, [router, token]);

  return (
    <div className="h-screen w-screen text-4xl flex items-center justify-center">
      {loading ? "Verifying" : "Not Verified"}
    </div>
  );
}
