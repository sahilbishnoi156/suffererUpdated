import React from "react";
import {
  Tooltip,
} from "@nextui-org/react";
import { UserM } from "./UserM";

export default function ShowUserM({
  user,
  postTime,
  handleUserIdClick,
  image,
}) {
  return (
    <Tooltip
    showArrow
    delay={1000}
      content={
        <UserM user={user}/>
      }
    >
      <div
          className="w-fit flex items-center justify-start gap-2 overflow-hidden cursor-pointer"
          onClick={handleUserIdClick}
        >
          <img
            draggable="false"
            src={image}
            alt="not found"
            className="h-8 w-8 rounded-full object-cover select-none"
          />
          <span className="flex items-center justify-center">
            <div className="sm:text-lg text-sm flex items-center justify-center gap-0 sm:gap-1 sm:flex-row flex-col select-none">
              @{user?.username}
              <span className="text-slate-400 sm:inline hidden">·</span>
              <span className="text-xs text-slate-400 sm:text-sm self-start sm:self-center h-full">
                {postTime || ""}
              </span>
            </div>
          </span>
        </div>
    </Tooltip>
  );
}
