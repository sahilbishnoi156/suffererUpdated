import React from "react";
import { Tabs, Tab, Chip } from "@nextui-org/react";

export default function ProfileNavM({ setPostType, routeUserData, postType }) {
  return (
    <div className="flex w-full flex-col">
      <Tabs
        aria-label="Options"
        color="primary"
        variant="underlined"
        selectedKey={postType}
        onSelectionChange={setPostType}
        classNames={{
          tabList:
            "gap-6 w-full relative rounded-none p-0 border-b border-divider ",
          cursor: "w-full bg-[#22d3ee]",
          tab: "max-w-fit px-0 h-12",
          tabContent: "group-data-[selected=true]:text-[#06b6d4] text-gray-400",
        }}
      >
        <Tab
          key="savedPosts"
          title={
            <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
              <i className="fa-solid fa-bookmark"></i>
              <span>Saved Posts</span>
              <Chip variant="solid" size="sm" className={`group-data-[selected=true]:bg-[#06b6d4] dark:bg-gray-400  h-5 w-5 sm:flex hidden items-center justify-center`}>{routeUserData?.savedPosts?.length || 0}</Chip>
            </div>
          }
        />
        <Tab
          key="userPosts"
          title={
            <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
              <svg
                aria-hidden="true"
                focusable="false"
                height="20"
                role="presentation"
                viewBox="0 0 24 24"
                width="20"
                fill="none"
              >
                <path
                  d="M2.58078 19.0112L2.56078 19.0312C2.29078 18.4413 2.12078 17.7713 2.05078 17.0312C2.12078 17.7613 2.31078 18.4212 2.58078 19.0112Z"
                  fill="currentColor"
                />
                <path
                  d="M9.00109 10.3811C10.3155 10.3811 11.3811 9.31553 11.3811 8.00109C11.3811 6.68666 10.3155 5.62109 9.00109 5.62109C7.68666 5.62109 6.62109 6.68666 6.62109 8.00109C6.62109 9.31553 7.68666 10.3811 9.00109 10.3811Z"
                  fill="currentColor"
                />
                <path
                  d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.19C2 17.28 2.19 18.23 2.56 19.03C3.42 20.93 5.26 22 7.81 22H16.19C19.83 22 22 19.83 22 16.19V13.9V7.81C22 4.17 19.83 2 16.19 2ZM20.37 12.5C19.59 11.83 18.33 11.83 17.55 12.5L13.39 16.07C12.61 16.74 11.35 16.74 10.57 16.07L10.23 15.79C9.52 15.17 8.39 15.11 7.59 15.65L3.85 18.16C3.63 17.6 3.5 16.95 3.5 16.19V7.81C3.5 4.99 4.99 3.5 7.81 3.5H16.19C19.01 3.5 20.5 4.99 20.5 7.81V12.61L20.37 12.5Z"
                  fill="currentColor"
                />
              </svg>
              <span>My Posts</span>
              <Chip variant="solid" size="sm" className={`group-data-[selected=true]:bg-[#06b6d4] dark:bg-gray-400 h-5 w-5 sm:flex hidden items-center justify-center`}>
                {routeUserData?.posts?.length}
              </Chip>
            </div>
          }
        />
        <Tab
          key="likedPosts"
          title={
            <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
              <i className="fa-solid fa-heart text-red-500"></i>
              <span>Liked Posts</span>
              <Chip variant="solid" size="sm" className={`group-data-[selected=true]:bg-[#06b6d4] dark:bg-gray-400 h-5 w-5 items-center justify-center sm:flex hidden`}>
                {routeUserData?.likedPosts?.length}
              </Chip>
            </div>
          }
        />
      </Tabs>
    </div>
  );
}
