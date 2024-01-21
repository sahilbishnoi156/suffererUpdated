import SignIn from "@/Components/Auth/SignIn";

export const metadata = {
  title: "SignIn · Sufferer"
}

export default function page() {

  return (
    <div className="bg-black h-full w-screen flex items-center justify-center py-10 select-none px-4">
     <SignIn /> 
    </div>
  );
}
