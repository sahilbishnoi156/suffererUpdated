import Home from "@/Components/Home";
import Head from "next/head";
import { Suspense } from "react";
import Loading from "./loading";

export default function MainPage() {
  return (
    <>
      <Head>
        <title>Sufferer: Your Premier Social Media Platform</title>
        <meta
          name="description"
          content="Join Sufferer, the leading social media web app designed to foster empathy, understanding, and support among individuals facing life's challenges. Connect with a compassionate community, share your journey, and find strength in solidarity. Sufferer is your space for shared healing and empowerment. Start your journey towards resilience and support today"
          key="desc"
        />
        <meta
          property="og:title"
          content="Sufferer: Empower Connection and Support with Sufferer: Your Premier Social Media Platform for Shared Healing"
        />
        <meta
          property="og:description"
          content="Join Sufferer, the leading social media web app designed to foster empathy, understanding, and support among individuals facing life's challenges. Connect with a compassionate community, share your journey, and find strength in solidarity. Sufferer is your space for shared healing and empowerment. Start your journey towards resilience and support today"
        />
        <meta property="og:image" content="./opengraph-image.png" />
      </Head>
      <Suspense fallback={<Loading />}>
        <Home />
      </Suspense>
    </>
  );
}
