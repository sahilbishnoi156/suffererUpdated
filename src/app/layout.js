import "../styles/globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/Components/Navbar";
import BottomNav from "@/Components/BottomNav";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Script from "next/script";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title:
    "Sufferer - Create and share your memories and moments with your friends",
  description:
    "Connect and engage with friends, family, and colleagues on the go with our innovative social media networking app. Share updates, photos, and experiences, discover new connections, and stay updated on the latest trends. Join our vibrant community today and experience a new way of staying connected.",
  others: {
    "twitter:image": "/ogimage.png",
    "twitter:card": "summary_large_image",
    "twitter:domain": "sufferer.vercel.app",
    "twitter:url": "https://sufferer.vercel.app",
    "twitter:title":
      "Sufferer - Create and share your memories and moments with your friends",
    "twitter:description":
      "Connect and engage with friends, family, and colleagues on the go with our innovative social media networking app. Share updates, photos, and experiences, discover new connections, and stay updated on the latest trends. Join our vibrant community today and experience a new way of staying connected.",
    "og:url": "https://sufferer.vercel.app",
    "og:image": "/public/ogimage.png",
    "og:type": "website",
    "og:title":
      "Sufferer - Create and share your memories and moments with your friends",
    "og:description":
      "Connect and engage with friends, family, and colleagues on the go with our innovative social media networking app. Share updates, photos, and experiences, discover new connections, and stay updated on the latest trends. Join our vibrant community today and experience a new way of staying connected.",
  },
};  

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark:bg-black bg-white ">
      <head>
        <meta name="referrer" content="no-referrer" />
      </head>
      <body className={`${inter.className}`}>
        <Providers>
          <div className="flex w-full dark:bg-black bg-white ">
            <div className="h-screen w-36 sm:block hidden">
              <Navbar />
            </div>
            <div className="sm:hidden block">
              <BottomNav />
            </div>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss={false}
              draggable
              pauseOnHover={false}
              theme="colored"
            />
            <div className="w-full h-full">{children}</div>
          </div>
          <Script
            src="https://kit.fontawesome.com/f8f9825bbd.js"
            rel="preload"
            as="script"
          />
        </Providers>
      </body>
    </html>
  );
}
