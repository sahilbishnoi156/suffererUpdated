import React from "react";
import { Tooltip } from "@nextui-org/react";
import { UserM } from "./UserM";

export default function ShowUserM({
  user,
  postTime,
  handleUserIdClick,
  image,
}) {
  return (
    <Tooltip showArrow delay={800} content={<UserM user={user} />}>
      <div
        className="w-fit flex items-center justify-start gap-2 overflow-hidden cursor-pointer"
        onClick={handleUserIdClick}
      >
        <img
          draggable="false"
          src={image}
          alt="not found"
          className={`h-10 w-10 rounded-full object-cover select-none border-2 ${user?.isVerified ? "border-blue-800" : "border-pink-800"} `}
        />
        <div className="flex items-start justify-center flex-col">
          <div className="flex items-center justify-center text-lg">
            @{user?.username}
            {user?.isVerified && (
              <img src="/verified.svg" className="h-4 w-4 ml-4" />
            )}
          </div>
          <div className="text-xs text-gray-500">
            {postTime || ""} ago
          </div>
        </div>
      </div>
    </Tooltip>
  );
}
