import Home from "@/Components/Home";
import Head from "next/head";
import { Suspense } from "react";
import Loading from "./loading";

export const metadata = {
  title: "Sufferer - Create and share your memories and moments with your friends",
  description:
    "Connect and engage with friends, family, and colleagues on the go with our innovative social media networking app. Share updates, photos, and experiences, discover new connections, and stay updated on the latest trends. Join our vibrant community today and experience a new way of staying connected.",
    others:{
      'twitter:image':'/ogimage.png',
      'twitter:card':'summary_large_image',
      'twitter:domain':'sufferer.vercel.app',
      'twitter:url':'https://sufferer.vercel.app',
      'twitter:title':'Sufferer - Create and share your memories and moments with your friends',
      'twitter:description':'Connect and engage with friends, family, and colleagues on the go with our innovative social media networking app. Share updates, photos, and experiences, discover new connections, and stay updated on the latest trends. Join our vibrant community today and experience a new way of staying connected.',
      'og:url':'https://sufferer.vercel.app',
      'og:image':'/public/ogimage.png', 
      'og:type':'website',
      'og:title':'Sufferer - Create and share your memories and moments with your friends',
      'og:description':'Join Sufferer, the leading social media web app designed to foster empathy, understanding, and support among individuals facing lifes challenges. Connect with a compassionate community, share your journey, and find strength in solidarity. Sufferer is your space for shared healing and empowerment. Start your journey towards resilience and support today'
    }
};
export default function MainPage() {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <Home />
      </Suspense>
    </>
  );
}
