import React, { Suspense } from "react";
import Loading from "../loading";

export const metadata = {
  title: "Inbox · Sufferer",
};

export default function page() {
  return (
    <Suspense fallback={<Loading/>}>
      <div className="text-white h-screen w-screen  flex items-center justify-center">
        This is page is still developing
      </div>
    </Suspense>
  );
}
