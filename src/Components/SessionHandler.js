"use client"
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SessionHandler({ children, route }) {
  const { status } = useSession();
  const router = useRouter();

  // if (status === "authenticated" || status === "loading" || status === undefined) {
  //   return <>{children}</>;
  // }else{
  //   router.push(route);
  //   return null;
  // }
  return <>{children}</>;
}
