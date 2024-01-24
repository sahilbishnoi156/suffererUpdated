"use client";
import { useEffect, useState } from "react";
import UserIds from "../UserIds";
import Link from "next/link";
import Skeleton from "../Skeleton";
import Image from "next/image";
import { useUserStore } from "@/stateManagment/zustand";
import { Tooltip } from "@nextui-org/react";

export default function SideProfile({ currentUser }) {
  const { suggestedUsers, setSuggestedUsers } = useUserStore();
  const [dataLoading, setDataLoading] = useState(false);

  const fetchSuggestedUsers = async () => {
    try {
      setDataLoading(true);
      const response = await fetch("/api/user/suggestedUsers");
      const data = await response.json();
      Array.isArray(data) ? setSuggestedUsers(data) : setSuggestedUsers([data]);
      setDataLoading(false);
    } catch (error) {
      console.log("failed to get posts", error);
    }
  };

  useEffect(() => {
    if (suggestedUsers.length === 0) {
      if (window.innerWidth > 700) {
        fetchSuggestedUsers();
      }
    }
  }, []);

  return (
    <div className="h-screen flex flex-col justify-start gap-10 px-8 py-12 fixed border-l-2 border-gray-700 select-none">
      {!dataLoading ? (
        <Tooltip placement={"left"}
        content={"open profile"}
        showArrow
        delay={200}
        size="sm"
        color="foreground">
          <Link
            replace
            href="/profile"
            className="flex gap-4 items-center cursor-pointer group justify-start
          w-full"
          >
            <Image
              src={
                currentUser?.image ||
                "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="
              }
              alt="Loading..."
              height={1000}
              width={1000}
              quality={100}
              className="h-16 w-16 rounded-full object-cover"
            />
            <span>
              <p className="text-2xl flex items-center gap-4">
                @{currentUser?.username || ""}{" "}
                {currentUser?.isVerified && (
                  <img src="/verified.svg" className="h-4 w-4" />
                )}
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                {currentUser?.given_name || currentUser?.username}{" "}
                {currentUser?.family_name || ""}
              </p>
            </span>
          </Link>
        </Tooltip>
      ) : (
        <Skeleton type={"userId"} />
      )}
      <div className="flex flex-col gap-4 h-full">
        <div className="text-xl">People You May Know</div>
        {dataLoading ? (
          <Skeleton type="sideProfile" />
        ) : (
          <>
            {suggestedUsers?.slice(0, 5).map((user) => {
              return <UserIds key={user?._id} user={user} />;
            })}
          </>
        )}
      </div>
      <div className="flex items-start justify-center flex-col gap-1">
        <div className="w-full flex items-center justify-start gap-2">
          <p className="text-sm">Learn About This Project</p>
          <Link
            className="cursor-pointer"
            href="/projectrepo"
            prefetch={true}
          >
            <i className="fa-solid fa-circle-info"></i>
          </Link>
        </div>
        <div className="text-xs text-slate-600">
          © 2023 SUFFERER FROM CODENAUTICA
        </div>
      </div>
    </div>
  );
}
