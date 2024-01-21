"use client";
import "@/styles/profile.css";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Posts from "@/Components/PostItems/Posts";
import { useUserStore, useLoadingStore } from "@/stateManagment/zustand";

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

  //* store States
  const { currentUserData } = useUserStore();
  const { loading, progress } = useLoadingStore();

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

  // Use Effect
  useEffect(() => {
    // Switching Navigation bar animation
    const handleClick = (e) => {
      const button = e.target.closest("div");
      if (!button) return;
      const calcLeft = button.offsetLeft;
      if (calcLeft < 164) {
        profileNavRef.current.style.setProperty("--left", calcLeft + "px");
      }
      const calcWidth = button.offsetWidth / profileNavRef.current.offsetWidth;
      if (calcWidth < 1) {
        profileNavRef.current.style.setProperty("--width", calcWidth);
      }
    };
    profileNavRef.current.addEventListener("click", handleClick);
    // Cleanup function to remove the event listener
  }, []);

  return (
    <>
      <div className="sm:w-5/6 lg:w-5/6 xl:5/6 w-full h-full text-white flex flex-col justify-center items-center gap-2 px-4 ">
        <div
          className={`sm:hidden fixed bottom-0 left-0 w-screen h-fit px-4 mb-12 ${
            toggleBtmNav ? "-z-50" : "z-30"
          }`}
        >
          <div
            className={`w-full h-full ${
              toggleBtmNav ? "opacity-0 translate-y-full" : "opacity-100"
            } bg-gray-600 rounded-t-3xl box-border overflow-hidden`}
            ref={bottomDivRef}
            style={{ transition: ".2s" }}
          >
            <div className="w-full h-8 flex items-center justify-center">
              <div className="bg-white w-1/4 h-1 rounded-full"></div>
            </div>
            <div className="h-full pb-4 w-full bg-gray-600 flex flex-col justify-center gap-4 pt-2 ">
              <div className="w-full flex items-center justify-start text-2xl px-4">
                <Link
                  href="/setting"
                  className="flex items-center justify-center gap-4"
                >
                  <i className="fa-solid fa-gear text-white select-none text-lg"></i>
                  Setting
                </Link>
              </div>
              <div className="w-full flex items-center justify-start px-4 gap-4 text-2xl">
                <Link
                  href="/projectrepo"
                  className="flex items-center justify-center gap-4"
                >
                  <i className="fa-solid fa-question"></i>About
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* mobile navigation */}
        <div className="w-full h-14 sm:hidden block">
          <div className="w-full h-14 fixed backdrop-blur-lg sm:hidden border-b-2 border-gray-800 top-0 left-0 z-50">
            <div className="flex items-center justify-between w-full px-8 h-full">
              <div>{currentUserData?.user?.username || "error"}</div>
              <div className="flex gap-4 items-center justify-between">
                <Link
                  href="/notification"
                  className="text-xl cursor-pointer text-white select-none"
                  scroll={false}
                  replace
                >
                  <i className="text-xl fa-solid fa-bell"></i>
                </Link>
                <Link
                  className="border-2 rounded-full bg-white h-5 w-5 flex items-center justify-center  "
                  href="/projectrepo"
                >
                  <i className="fa-solid fa-info text-sm text-slate-800 select-none"></i>
                </Link>
                <i
                  className="fa-solid fa-bars text-white text-lg select-none"
                  onClick={handleToggleBottomInfo}
                ></i>
              </div>
            </div>
          </div>
        </div>
        <div className="h-fit border-b-2 border-l-indigo-700 w-full flex flex-col sm:flex-row gap-4 justify-evenly pt-8 sm:pb-10 pb-2 border-gray-700">
          <div className="flex gap-4 items-center justify-center w-fit">
            {/* common image for mobile & desktop */}
            <div className={`sm:h-40 sm:w-40 h-16 w-16 ${!loading && "border-2"} rounded-full border-gray-500 p-1`}>
              {loading ? (
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
                    className="h-full w-full rounded-full object-cover border-4 p-1 hover:scale-105 transition duration-300 select-none"
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
              <div className="flex sm:gap-8 gap-2 text-center text-xs">
                <div>{routeUserPosts?.length} Posts</div>
                <Link
                  href={`/${routeUser?._id}/followers`}
                  className="cursor-pointer"
                >
                  {routeUser?.followers?.length} Followers
                </Link>
                <Link
                  href={`/${routeUser?._id}/followings`}
                  className="cursor-pointer"
                >
                  {routeUser?.followings?.length} Followings
                </Link>
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
              <div>{routeUserPosts?.length} Posts</div>
              <Link
                href={`/${routeUser?._id}/followers`}
                className="cursor-pointer"
              >
                {routeUser?.followers?.length} Followers
              </Link>
              <Link
                href={`/${routeUser?._id}/followings`}
                className="cursor-pointer"
              >
                {routeUser?.followings?.length} Followings
              </Link>
            </div>
            <div>
              <strong>
                {routeUser?.given_name} {routeUser?.family_name}
              </strong>
              <p className="w-full overflow-auto bg-transparent whitespace-pre-line text-sm mb-2">
                {routeUser?.about}
              </p>
              {pathname === "/profile" ? (
                <Link
                  href="/setting"
                  prefetch
                  replace
                  type="button"
                  className="my-4 text-sm p-4 py-1 rounded-lg select-none bg-slate-700 hover:scale-105 cursor-pointer"
                >
                  Edit profile
                </Link>
              ) : Object.keys(currentUserData).length !== 0 ? (
                <div className="my-4 flex gap-4">
                  {!followClicked && progress === 0 ? (
                    <button
                      type="button"
                      className={`${
                        routeUser?.followers?.some((user) => user._id === currentUserData?.user?._id)
                          ? "bg-slate-700"
                          : "bg-blue-600 hover:scale-105 cursor-pointer"
                      } w-24 text-sm p-4 py-1 rounded-lg select-none `}
                      onClick={async () => {
                        handleFollowUser();
                      }}
                    >
                      {routeUser?.followers?.some((user) => user._id === currentUserData?.user?._id)
                        ? "Following"
                        : "Follow"}
                    </button>
                  ) : (
                    <div className="bg-slate-600 cursor-wait select-none w-24 text-sm p-4 py-1 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </div>
                  )}
                  <div className="p-4 py-1 select-none cursor-pointer rounded-lg bg-slate-700 w-24 hover:scale-105 text-sm flex items-center justify-center">
                    Message
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
        {pathname === "/profile" ? (
          <div
            id="profile-navigation"
            className="flex gap-8 w-fit select-none items-center justify-center "
            ref={profileNavRef}
          >
            <div onClick={() => setPostType("userPosts")}>Posts</div>
            <div
              onClick={() => {
                setPostType("savedPosts");
              }}
            >
              Saved
            </div>
            <div
              onClick={() => {
                setPostType("likedPosts");
              }}
            >
              Liked Posts
            </div>
          </div>
        ) : (
          <div
            id="profile-navigation"
            className="flex gap-8 w-fit select-none items-center justify-center before:w-56"
            ref={profileNavRef}
          >
            <div>Posts</div>
          </div>
        )}
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
                  posts={routeUserData?.savedPosts}
                  section={section}
                  postType={postType}
                  dataLoading={loading}
                  pathname={pathname}
                />
              </>
            ) : (
              <Posts
                posts={routeUserData?.likedPosts}
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
