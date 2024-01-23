"use client";
import { useUserStore } from "@/stateManagment/zustand";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function BottomNav() {
  const pathname = usePathname();
  const { currentUserData } = useUserStore();

  return (
    <div
      className={`fixed bottom-0 left-0 z-50 w-full h-14 bg-white border-t border-gray-200 dark:bg-black dark:border-gray-600 ${
        pathname === "/signIn" || pathname === "/signUp" ? "hidden" : "block"
      } text-black dark:text-white`}
    >
      <div className="flex h-full max-w-lg justify-evenly mx-auto font-medium">
        <Link
          href="/"
          replace
          prefetch
          className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-950"
        >
          <i className="fa-solid fa-house "></i>
        </Link>
        <Link
          replace
          prefetch
          href="/message"
          className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-950"
        >
          <i className="fa-brands fa-facebook-messenger"></i>
        </Link>
        <Link
          replace
          prefetch
          href="/createpost"
          className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-950"
        >
          <i className="fa-solid fa-plus text-2xl  "></i>
        </Link>
        <Link
          replace
          prefetch
          href="/search"
          className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-950"
        >
          <i className="fa-solid fa-magnifying-glass "></i>
        </Link>
        {Object.keys(currentUserData).length !== 0 ? (
            <>
              <Link
                href={`/profile`}
                replace
                prefetch
                className="text-xl flex items-center justify-start w-full px-5"
                scroll={false}
              >
                <img
                  src={currentUserData?.user?.image}
                  alt="not found"
                  className="rounded-full h-6 w-6 object-cover border-2 border-violet-800"
                />
              </Link>
            </>
          ) : (
            <Link
              href={`/profile`}
              replace
              prefetch
              className="text-xl flex items-center justify-start px-5"
            >
              <i className="text-md fa-solid fa-user"></i>
            </Link>
          )}
      </div>
    </div>
  );
}
