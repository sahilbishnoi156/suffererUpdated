"use client";
import { useEffect, useState, useRef } from "react";
import "@/styles/globals.css";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
export default function SignUp() {
  // States
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [usernameExists, setUsernameExists] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const router = useRouter();
  // Refs
  const timerRef = useRef();
  

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch("api/auth/signUp", {
        method: "POST",
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          username: username,
          email: email,
          password: password,
          location: userLocation,
          image:
            "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=",
        }),
      });
      const json = await response.json();
      setLoading(false);
      if (json.userCreated) {
        toast.success(`Welcome ${firstName} `, {
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
      } else {
        toast.warn(`Email already exists`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    } catch (error) {
      setLoading(false);
      toast.error(`Something went wrong`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      console.log(error);
    }
  };

  // Checking if username exists
  const checkUsernameExists = async (username) => {
    try {
      const response = await fetch(
        `/api/user/available/username/${username}`
      );
      const data = await response.json();
      if (data.userAvailable) {
        setUsernameExists(true); // Username exist
      } else {
        setUsernameExists(false); // Username does not exists
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Handling username change
  const handleUserNameChange = (e) => {
    const newUsername = e.target.value.toLowerCase();

    if (/[^a-z0-9._]|[.]{2,}|[_]{2,}/gm.test(newUsername)) {
      // Don't set the username
    } else {
      setUsername(newUsername);
    }

    // Clear the previous timer
    clearTimeout(timerRef.current);

    if (newUsername !== "" && newUsername.length > 6) {
      // Set a new timer to delay API call
      timerRef.current = setTimeout(() => {
        checkUsernameExists(newUsername);
      }, 500); // Adjust the delay time as needed
    } else {
      setUsernameExists(null);
    }
  };

  useEffect(() => {
    const getLocation = async () => {
      if (navigator.geolocation) {
        try {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              maximumAge: 0, // Don't use cached position
            });
          });

          const { latitude, longitude } = position.coords;
          setUserLocation({
            latitude: latitude,
            longitude: longitude,
          });
        } catch (error) {
          if (error.code === error.PERMISSION_DENIED) {
            window.alert(
              "Location Alert!!!\nYour location is essential for your convenience\nPlease allow location for this application from setting or upperleft corner"
            );
          } else {
            console.error("Error getting location:", error.message);
          }
        }
      } else {
        console.log("Geolocation API not supported.");
      }
    };
    getLocation();
  }, []);
  return (
    <div className="flex w-full h-full dark:bg-black bg-white text-white items-center justify-start sm:p-16 select-none">
      <div className="h-full w-full flex flex-col items-center justify-center gap-8">
        <div>
          <span className="text-5xl" id="signUp-heading">
            Sign Up
          </span>
          <i className="fa-solid fa-hippo ml-4 dark:text-white text-gray-700 text-5xl"></i>
        </div>
        <form className="sm:w-2/3 w-11/12 " onSubmit={handleSignUp}>
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="first_name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                First name
              </label>
              <input
                type="text"
                id="first_name"
                value={firstName}
                max={15}
                onChange={(e) => setFirstName(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Jhon"
                required
              />
            </div>
            <div>
              <label
                htmlFor="last_name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Last name (optional)
              </label>
              <input
                type="text"
                id="last_name"
                value={lastName}
                max={15}
                onChange={(e) => setLastName(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Doe"
              />
            </div>
          </div>
          <div className="">
            <label
              htmlFor="username"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              min={5}
              max={20}
              onChange={handleUserNameChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="jhon_doe12"
              required
            />
          </div>
          <div className="h-6">
            {usernameExists === null ? (
              <></>
            ) : usernameExists ? (
              <p className="text-sm mt-1 text-red-700 ">
                Username already taken
              </p>
            ) : (
              <p className="text-sm mt-1 text-green-700">Username available</p>
            )}
          </div>
          <div className="mb-6">
            <label
              htmlFor="user-email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Email address
            </label>
            <input
              type="email"
              id="user-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="john.doe@company.com"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="user-password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Password
            </label>
            <input
              type="password"
              id="user-password"
              min={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Choose password"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="confirm_password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Confirm password
            </label>
            <input
              type="password"
              id="confirm_password"
              min={8}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Confirm Password"
              required
            />
          </div>
          <div className="flex items-start mb-6">
            <div className="flex items-center h-5">
              <input
                id="remember"
                type="checkbox"
                defaultValue=""
                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                required=""
              />
            </div>
            <label
              htmlFor="remember"
              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              I agree with the
              <a
                href="#"
                className="text-blue-600 hover:underline dark:text-blue-500 ml-1"
              >
                terms and conditions
              </a>
              .
            </label>
          </div>
          <div className="flex items-center justify-between w-full sm:flex-row flex-col gap-2">
            {loading ? (
              <button
                disabled
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center w-32"
              >
                <svg
                  aria-hidden="true"
                  role="status"
                  className="inline w-4 h-4 mr-3 text-white animate-spin"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="#E5E7EB"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentColor"
                  />
                </svg>
                Loading...
              </button>
            ) : (
              <button
                type="submit"
                className={`text-white  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center  ${
                  password !== currentPassword || usernameExists
                    ? "bg-gray-700 dark:bg-gray-700"
                    : "dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 bg-blue-700 hover:bg-blue-800"
                }`}
                disabled={password !== currentPassword || usernameExists}
              >
                Sing Up
              </button>
            )}
            <Link href="/signIn" className="text-blue-400" replace>
              Already have an account ?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
