"use client";
import "@/styles/profile.css";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Posts from "@/Components/PostItems/Posts";
import { useUserStore, useLoadingStore } from "@/stateManagment/zustand";
import FollowersM from "../Modals/FollowersM";
import ProfileNavM from "../Modals/ProfileNavM";
import { Badge, Button, Chip } from "@nextui-org/react";
import { motion } from "framer-motion";
import BottomSheetBar from "../BottomSheetBar";


export default function MainProfile({
  routeUser,
  routeUserData,
  routeUserPosts,
  setRouteUser,
  section,
  params,
}) {
  const [toggleBtmNav, setToggleBtmNav] = useState(true);
  const [imageClick, setImageClick] = useState(false);
  const [followClicked, setFollowClicked] = useState(false);
  const [postType, setPostType] = useState("userPosts");
  const [isGetUserClicked, setIsGetUserClicked] = useState(false);

  //* store States
  const { currentUserData, setFollowersAndFollowings, followersAndFollowings } =
    useUserStore();
  const { loading, setProgress, setLoading } = useLoadingStore();
  const [followersLoading, setFollowersLoading] = useState(false);

  //* followers and followings
  const getUsers = async () => {
    setFollowersLoading(true);
    setProgress(50);
    try {
      const response = await fetch(
        `/api/user/get/followersAndFollowings/${routeUser?._id}`
      );
      const data = await response.json();
      setFollowersAndFollowings(data);
    } catch (error) {
      console.log(error);
    } finally {
      setProgress(100);
      setFollowersLoading(false);
    }
  };

  // Ref
  const profileNavRef = useRef();
  const bottomDivRef = useRef();

  // Hooks
  const router = useRouter();
  const pathname = usePathname();

  //
  const handleToggleBottomInfo = () => {
    setToggleBtmNav(!toggleBtmNav);
  };

  // Handling Clicking on followers
  const handleFollowUser = async () => {
    setFollowClicked(true);
    try {
      const response = await fetch(`/api/user/follow`, {
        method: "PATCH",
        body: JSON.stringify({
          followedUserUsername: params?.username,
        }),
      });
      const data = await response.json();
      setRouteUser({
        user: data.followedUser,
        posts: routeUserPosts,
      });
      getUsers();
      if (data.status !== 200) {
        throw new Error(data.message || "Something went wrong");
      }
      // Handle successful response, update state, etc.
    } catch (error) {
      console.log(error);
    } finally {
      setFollowClicked(false);
    }
  };

  const { savedPosts, setSavedPosts, likedPosts, setLikedPosts } =
    useUserStore();
  const getAdditionalPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/posts/getUserPosts", {
        method: "POST",
        body: JSON.stringify({
          username: routeUser?.username,
          postType: postType,
        }),
      });
      const data = await response.json();
      if (response.status === 200) {
        if (postType === "savedPosts") {
          setSavedPosts(data.data);
        } else if (postType === "likedPosts") {
          setLikedPosts(data.data);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Use Effect
  useEffect(() => {
    if (
      followersAndFollowings.length === 0 &&
      Object.keys(routeUserData).length !== 0 &&
      isGetUserClicked
    ) {
      getUsers();
    }
    if (
      (postType === "savedPosts" &&
        savedPosts.length === 0 &&
        routeUserData?.savedPosts !== 0) ||
      (postType === "likedPosts" &&
        likedPosts.length === 0 &&
        routeUserData?.likedPosts !== 0)
    ) {
      getAdditionalPosts();
    }
    // Cleanup function to remove the event listener
  }, [routeUserData, isGetUserClicked, postType]);

  return (
    <>
      <div className="sm:w-5/6 lg:w-5/6 xl:5/6 w-full h-full dark:text-white text-black flex flex-col justify-center items-center px-4 ">
        <>
         
        </>
        {/* mobile navigation */}
        <div className="w-full h-14 sm:hidden block ">
          <div className="w-full h-14 fixed dark:bg-black bg-white sm:hidden border-b border-gray-800 top-0 left-0 z-50">
            <div className="flex items-center justify-between w-full px-4 h-full  text-black dark:text-white ">
              <div>{currentUserData?.user?.username || "error"}</div>
              <div className="flex gap-4 items-center justify-between">
                <Link
                  href="/notifications"
                  className="text-xl cursor-pointer  select-none"
                  scroll={false}
                  replace
                >
                  <Badge
                    content={1}
                    color="danger"
                    variant="shadow"
                    className="border-none"
                    size="sm"
                  >
                    <i className="fa-regular fa-heart"></i>
                  </Badge>
                </Link>
                <Link href="/projectrepo">
                  <i className="fa-solid fa-circle-info text-lg select-none"></i>
                </Link>
                <BottomSheetBar/>
              </div>
            </div>
          </div>
        </div>
        <div
          className="sticky top-14 sm:top-0 z-50 dark:bg-black bg-white w-full h-fit flex flex-col pb-4"
          id="shadow-div"
        >
          <div className=" border-l-indigo-700 w-full flex flex-col sm:flex-row gap-4 justify-evenly pt-2 md:pt-8 sm:pb-10 pb-2 border-gray-700  ">
            <div className="flex gap-4 items-center justify-center w-fit">
              {/* common image for mobile & desktop */}
              <div
                className={`sm:h-40 sm:w-40 h-16 w-16 ${
                  !loading && routeUser?.image && "border-2"
                } rounded-full border-violet-500 p-[2px]`}
              >
                {loading && !routeUser?.image ? (
                  <div className="h-full w-full flex items-center justify-center ">
                    <svg
                      aria-hidden="true"
                      role="status"
                      className="inline w-8 h-8 text-white animate-spin "
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="#E5E7EB"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                ) : (
                  <img
                    draggable="false"
                    src={routeUser?.image}
                    alt="notfound"
                    className="h-full w-full rounded-full object-cover cursor-pointer select-none"
                    onClick={() => setImageClick(true)}
                  />
                )}
              </div>
              {/* view image  */}
              {imageClick ? (
                <div
                  className="h-screen w-screen backdrop-blur-lg flex items-center justify-center fixed top-0 left-0 z-50"
                  onClick={() => setImageClick(false)}
                >
                  <div className="h-52 w-52 lg:h-96 lg:w-96 rounded-full p-3 ">
                    <img
                      draggable="false"
                      src={routeUser?.image}
                      alt="not found"
                      className="h-full w-full rounded-full object-cover border-4 border-violet-600 p-[2px] hover:scale-105 transition duration-300 select-none"
                    />
                  </div>
                </div>
              ) : (
                <></>
              )}
              {/* For Mobile Profile */}
              <div className="flex flex-col gap-2 sm:hidden justify-center items-start text-sm">
                <div className="flex gap-6 items-center">
                  <div>@{routeUser?.username}</div>
                  {pathname === "/profile" ? (
                    <i
                      className="fa-solid fa-pen-to-square cursor-pointer select-none"
                      onClick={() => {
                        router.push("/setting");
                      }}
                    ></i>
                  ) : (
                    <></>
                  )}
                </div>
                <div className="flex gap-2 text-center text-xs">
                  <div>{routeUserPosts?.length} Posts</div>
                  <FollowersM
                    text={`${routeUser?.followers?.length || 0} Followers`}
                    users={followersAndFollowings?.followers}
                    type={"Followers"}
                    setIsGetUserClicked={setIsGetUserClicked}
                    followersLoading={followersLoading}
                  />
                  <FollowersM
                    text={`${routeUser?.followings?.length || 0} Followings`}
                    users={followersAndFollowings?.followings}
                    type={"Followings"}
                    setIsGetUserClicked={setIsGetUserClicked}
                    followersLoading={followersLoading}
                  />
                </div>
              </div>
            </div>
            {/* For Desktop Profile */}
            <div className="flex flex-col gap-2 sm:w-1/2 w-full">
              <div className="hidden sm:flex items-center justify-between h-6">
                <div className="flex items-center justify-center">
                  <div>@{routeUser?.username}</div>
                  {pathname === "/profile" ? (
                    <i
                      className="fa-solid fa-pen-to-square cursor-pointer hover:scale-110 ml-8 transition-all select-none"
                      onClick={() => {
                        router.push("/setting");
                      }}
                    ></i>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
              <div className="hidden gap-8 sm:flex">
                <div>{routeUserPosts?.length || 0} Posts</div>
                <FollowersM
                  text={`${routeUser?.followers?.length || 0} Followers`}
                  users={followersAndFollowings?.followers}
                  type={"Followers"}
                  setIsGetUserClicked={setIsGetUserClicked}
                  followersLoading={followersLoading}
                />
                <FollowersM
                  text={`${routeUser?.followings?.length || 0} Followings`}
                  users={followersAndFollowings?.followings}
                  type={"Followings"}
                  setIsGetUserClicked={setIsGetUserClicked}
                  followersLoading={followersLoading}
                />
              </div>
              <div>
                <strong>
                  {routeUser?.given_name} {routeUser?.family_name}
                </strong>
                <p className="w-full overflow-auto bg-transparent whitespace-pre-line text-sm mb-2">
                  {routeUser?.about}
                </p>
                {pathname === "/profile" ? (
                  <Link href="/setting" prefetch>
                    <Button
                      color="primary"
                      variant="solid"
                      className="py-0"
                      size="sm"
                    >
                      Edit Profile
                    </Button>
                  </Link>
                ) : (
                  Object.keys(currentUserData).length !== 0 && (
                    <div className="my-4 flex gap-4">
                      <Button
                        color={`${
                          routeUser?.followers?.some(
                            (user) => user._id === currentUserData?.user?._id
                          )
                            ? "default"
                            : "primary"
                        }`}
                        variant="solid"
                        className="py-0"
                        isLoading={followClicked}
                        size="sm"
                        onClick={async () => {
                          handleFollowUser();
                        }}
                      >
                        {routeUser?.followers?.some(
                          (user) => user._id === currentUserData?.user?._id
                        )
                          ? "Following"
                          : "Follow"}
                      </Button>
                      <Button
                        color="primary"
                        variant="solid"
                        className="py-0"
                        size="sm"
                      >
                        Message
                      </Button>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {pathname === "/profile" ? (
            <div className="self-center select-none">
              <ProfileNavM
                setPostType={setPostType}
                routeUserData={routeUserData}
                postType={postType}
              />
            </div>
          ) : (
            <div className=" self-center border-b-2 border-[#06b6d4] w-28 pb-1 flex items-center justify-center gap-2 text-[#06b6d4] ">
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
              <span className="text-lg">Posts</span>
              <Chip
                size="sm"
                variant="solid"
                className=" bg-[#06b6d4] text-white h-5 w-5 items-center justify-center flex"
              >
                {routeUserPosts?.length || 0}
              </Chip>
            </div>
          )}
        </div>
        <div className="w-full mb-10 ">
          <div className="w-full">
            {postType === "userPosts" ? (
              <Posts
                posts={routeUserPosts}
                section={section}
                dataLoading={loading}
                postType={postType}
                pathname={pathname}
              />
            ) : postType === "savedPosts" ? (
              <>
                <Posts
                  posts={savedPosts}
                  section={section}
                  postType={postType}
                  dataLoading={loading}
                  pathname={pathname}
                />
              </>
            ) : (
              <Posts
                posts={likedPosts}
                section={section}
                postType={postType}
                dataLoading={loading}
                pathname={pathname}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
