import SignIn from "@/Components/Auth/SignIn";

export const metadata = {
  title: "SignIn · Sufferer"
}

export default function page() {

  return (
    <div className="dark:bg-black bg-white h-full w-screen flex items-center justify-center select-none px-4 py-10 sm:py-0">
     <SignIn /> 
    </div>
  );
}
