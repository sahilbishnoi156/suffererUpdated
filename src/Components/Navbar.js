"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/stateManagment/zustand";
import { Badge } from "@nextui-org/react";

export default function Navbar() {
  const { currentUserData } = useUserStore();
  const [navToggle, setNavToggle] = useState(false);
  const headingRef = useRef(null);
  const pathname = usePathname();
  const openStyle = {
    transition: "1s",
    width: "100%",
  };
  const closeStyle = {
    transition: ".4s",
    width: "0",
  };
  const toggleNavbar = () => {
    if (navToggle) {
      headingRef.current.style.transition = ".4s";
      headingRef.current.style.width = "0";
      setNavToggle(false);
    } else {
      headingRef.current.style.display = "block";
      setTimeout(() => {
        headingRef.current.style.width = "100%";
      }, 150);
      setNavToggle(true);
    }
  };

  const closeNav = () => {
    if (navToggle) {
      headingRef.current.style.transition = ".4s";
      headingRef.current.style.width = "0";
      setNavToggle(false);
    }
  };

  useEffect(() => {
    // Add event listener when the component mounts
    document.addEventListener("click", closeNav);
    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", closeNav);
    };
  }, [navToggle]);
  return (
    <nav
      className={`h-12 sm:h-screen flex items-center justify-between flex-col dark:bg-black bg-white ${
        navToggle ? "w-60" : "w-16"
      } dark:text-white text-black px-5 py-8 border-r-1 border-gray-700 fixed transition-all duration-500 ${
        pathname === "/signIn" || pathname === "/signUp" ? "hidden" : "block"
      }`}
    >
      <div className="flex justify-start items-center transition-all w-full">
        <Link
          href="/"
          replace
          aria-label="Website logo icon"
          className="text-3xl h-full"
          style={{ height: "72px !important" }}
        >
          <i className="fa-solid fa-hippo text-2xl transition-all duration-250 hover:scale-125"></i>
          <span
            className={`${
              navToggle ? "block" : "hidden"
            } overflow-hidden transition-all duration-300`}
            ref={headingRef}
          >
            Sufferer
          </span>
        </Link>
      </div>
      <div
        className={`flex justify-center items-start flex-col w-full gap- transition-all`}
      >
        <div
          className="flex justify-center items-start flex-col xl:gap-12 md:gap-10 sm:gap-8 gap-6 "
          style={{ height: "304px !important" }}
          id="navigation-icons"
        >
          <Link
            href="/"
            replace
            aria-label="Home icon - go to home icon"
            className="text-xl flex items-center justify-start gap-4 w-full"
            scroll={false}
          >
            <i className="text-xl fa-solid fa-house"></i>
            <span
              className={`navigation-items overflow-hidden text-lg`}
              style={navToggle ? openStyle : closeStyle}
            >
              Home
            </span>
          </Link>
          <Link
            href="/search"
            className="text-xl flex items-center justify-start gap-4  "
            replace
            aria-label="Search icon - search users"
            prefetch
            scroll={false}
          >
            <i className="text-xl fa-solid fa-magnifying-glass"></i>{" "}
            <span
              className={` navigation-items text-lg overflow-hidden `}
              style={navToggle ? openStyle : closeStyle}
            >
              Search
            </span>
          </Link>
          <Link
            href="/message"
            className="text-xl flex items-center justify-start gap-4 "
            scroll={false}
            aria-label="Go to messaging tab"
            replace
          >
            <Badge content={5} color="danger" className="border-none">
            <i className="fa-brands fa-facebook-messenger"></i>
            </Badge>
            <span
              className={` navigation-items overflow-hidden text-lg`}
              style={navToggle ? openStyle : closeStyle}
            >
              Message
            </span>
          </Link>
          <Link
            href="/notifications"
            className="text-xl flex items-center justify-start gap-4 "
            scroll={false}
            aria-label="notifications"
            replace
          >
             <Badge content={1} color="danger" className="border-none">
            <i className="fa-regular fa-heart"></i>
            </Badge>
            <span
              className={` navigation-items overflow-hidden text-lg`}
              style={navToggle ? openStyle : closeStyle}
            >
              Notifications
            </span>
          </Link>
          {Object.keys(currentUserData).length !== 0 ? (
            <>
              <Link
                href={`/profile`}
                replace
                prefetch
                aria-label="check user profile"
                className="text-xl flex items-center justify-start gap-4 w-full"
                scroll={false}
              >
                <img
                  src={currentUserData?.user?.image}
                  alt="not found"
                  className="rounded-full h-6 w-6 object-cover"
                  draggable={false}
                />

                <span
                  className={` navigation-items overflow-hidden text-lg`}
                  style={navToggle ? openStyle : closeStyle}
                >
                  Profile
                </span>
              </Link>
            </>
          ) : (
            <Link
              href={`/profile`}
              replace
              prefetch
              aria-label="Go to your profile and customize it"
              className="text-xl flex items-center justify-start gap-4 "
              scroll={false}
            >
              <i className="text-xl fa-solid fa-user"></i>{" "}
              <span
                className={` navigation-items overflow-hidden text-lg`}
                style={navToggle ? openStyle : closeStyle}
              >
                Profile
              </span>
            </Link>
          )}
        </div>
      </div>
      <div
        className={`flex items-start justify-start w-full transition-all flex-col gap-6`}
      >
        <Link
          href="/setting"
          aria-label="Go to settings"
          className="text-xl flex items-center justify-start gap-4  "
          scroll={false}
          prefetch
          replace
        >
          <i className="fa-solid fa-gear text-xl hover:rotate-45 transition duration-300"></i>
          <span
            className={` navigation-items overflow-hidden `}
            style={navToggle ? openStyle : closeStyle}
          >
            Settings
          </span>
        </Link>
        <Link
          href="/post/createpost"
          replace
          aria-label="create new post"
          prefetch
          className="text-xl flex items-center justify-start gap-4  "
        >
          <i className="fa-solid fa-plus text-xl hover:rotate-90 transition duration-300 "></i>
          <span
            className={` navigation-items overflow-hidden`}
            style={navToggle ? openStyle : closeStyle}
          >
            Post
          </span>
        </Link>
        <button
          className="text-xl flex items-center justify-start gap-4 "
          onClick={toggleNavbar}
        >
          <i
            className={`fa-solid fa-${
              !navToggle ? "bars" : "xmark"
            } text-xl cursor-pointer`}
            id="toggle-menu"
          ></i>
          <span
            className={` navigation-items overflow-hidden`}
            style={navToggle ? openStyle : closeStyle}
          >
            Close
          </span>
        </button>
      </div>
    </nav>
  );
}
