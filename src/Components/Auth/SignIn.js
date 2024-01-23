"use client";
import "@/styles/globals.css";
import React, { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { EyeFilledIcon } from "./EyeFilledIcon";
import { EyeSlashFilledIcon } from "./EyeSlashFilledIcon.js";
import { Button, Input } from "@nextui-org/react";

export default function SignIn() {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const [loading, setLoading] = useState(false);
  const [user_email, setUser_email] = useState("");
  const [user_password, setUser_password] = useState("");
  const [isInvalid, setIsInvalid] = useState({
    password: false,
    email: false,
  });
  const router = useRouter();

  //* verification
  const validateEmail = (user_email) =>
    user_email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

  const isInvalidEmail = React.useMemo(() => {
    if (user_email === "") return false;

    return validateEmail(user_email) ? false : true;
  }, [user_email]);

  // Handling Login
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    if (user_email === "") {
      setIsInvalid((prev) => ({
        ...prev,
        email: true,
      }));
      return;
    } else if (user_password === "") {
      setIsInvalid((prev) => ({
        ...prev,
        password: true,
      }));
      return;
    }
    try {
      setLoading(true);
      const response = await fetch("/api/auth/signIn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user_email,
          password: user_password,
        }),
      });
      const data = await response.json();
      setLoading(false);
      if (!data.userFound) {
        setIsInvalid((prev) => ({
          ...prev,
          email: true,
        }));
      } else {
        if (!data.isMatch) {
          setIsInvalid((prev) => ({
            ...prev,
            password: true,
          }));
        } else {
          toast.success(`Welcome ${data.user_name}`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          router.push("/");
        }
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div className="flex sm:flex-row flex-col-reverse gap-10 sm:gap-2 w-full h-screen text-white items-center justify-start dark:bg-black bg-white">
      <div className="sm:w-1/2 hidden w-full md:flex flex-col items-center sm:justify-center justify-between h-full gap-8 sm:pl-16 pl-0">
        <div className="flex-col items-center justify-evenly gap-16 sm:gap-0 sm:flex hidden ">
          <div className="w-full text-center">
            <span className="text-6xl text-center w-3/4 text-black" id="site-heading">
              Welcome Back!
            </span>
            <p className="text-gray-400 text-center">
              At Sufferer, we believe in the extraordinary power of sharing to
              inspire, motivate, and uplift.
            </p>
            <div className="h-12"></div>
          </div>
        </div>
        <Link className="text-blue-400 sm:block hidden" href="/signUp" replace>
          Don't have an account ?
        </Link>
      </div>
      <div className="text-slate-400 [writing-mode:vertical-lr] relative left-14 md:block hidden">
        ----------------------------------------------
      </div>
      <div className="h-full md:w-3/5  w-full flex flex-col items-center justify-center sm:gap-16 gap-4 sm:mt-0">
        <div className="w-full items-center justify-center flex">
          <span className="text-6xl pb-4 " id="site-heading" >
            Sign In
          </span>
          <Link href="/" className="pb-4">
            <i className="fa-solid fa-hippo ml-4 text-black dark:text-white text-5xl" id="site-heading"></i>
          </Link>
        </div>
        <form
          className="w-full sm:w-2/3 flex flex-col gap-6"
          onSubmit={handleSignInSubmit}
        >
          <Input
            type="email"
            isClearable
            className="dark:dark light"
            variant="flat"
            isInvalid={isInvalid.email || isInvalidEmail}
            label="Email"
            value={user_email}
            errorMessage={isInvalid.email && "Please enter a valid email"}
            onValueChange={setUser_email}
            onChange={() => {
              setIsInvalid((prev) => ({
                ...prev,
                email: false,
              }));
            }}
          />
          <div className="mb-6">
            <Input
              type={isVisible ? "text" : "password"}
              className="dark:dark light"
              variant="flat"
              isInvalid={isInvalid.password}
              minLength={8}
              errorMessage={isInvalid.password && "Invalid Password"}
              label="Password"
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                >
                  {isVisible ? (
                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              value={user_password}
              onValueChange={setUser_password}
              onChange={() => {
                setIsInvalid((prev) => ({
                  ...prev,
                  password: false,
                }));
              }}
            />
          </div>
          <Button
            type="submit"
            color="primary"
            variant="shadow"
            isLoading={loading}
            disabled={isInvalid.email || isInvalid.password}
            className="sm:w-32"
          >
            {loading ? "Loading" : "Sign In"}
          </Button>
          <Link className="text-blue-400 sm:hidden block mt-4" href="/signUp">
            Don't have an account ?
          </Link>
        </form>
      </div>
    </div>
  );
}
