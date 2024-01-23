"use client";
import { useEffect, useState, useRef } from "react";
import "@/styles/globals.css";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Button, Checkbox, Input } from "@nextui-org/react";
import { EyeSlashFilledIcon } from "./EyeSlashFilledIcon";
import { EyeFilledIcon } from "./EyeFilledIcon";

export default function SignUp() {
  // States
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [usernameExists, setUsernameExists] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState(null)

  //* Logic to show password
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  //* router
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

  //* check password strength
  function checkPasswordStrength() {
    if(password === ""){
    setPasswordStrength(null)
    return;
    }
    let strength = 0;
  
    // Check for length
    if (password.length >= 8) {
      strength += 1;
    }
  
    // Check for uppercase letters
    if (/[A-Z]/.test(password)) {
      strength += 1;
    }
  
    // Check for lowercase letters
    if (/[a-z]/.test(password)) {
      strength += 1;
    }
  
    // Check for numbers
    if (/[0-9]/.test(password)) {
      strength += 1;
    }
  
    // Check for special characters
    if (/^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+$/g.test(password)) {
      strength += 1;
    }
  
    // Determine strength level
    if (strength < 3) {
      setPasswordStrength("Weak")
    } else if (strength < 5) {
      setPasswordStrength("Moderate")
    } else {
      setPasswordStrength("Strong")
    }
  }
  
  // Checking if username exists
  const checkUsernameExists = async (username) => {
    try {
      const response = await fetch(`/api/user/available/username/${username}`);
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
          <i
            className="fa-solid fa-hippo ml-4 dark:text-white text-gray-700 text-5xl"
            id="signUp-heading"
          ></i>
        </div>
        <form className="md:w-2/3 sm:w-3/4 w-11/12 " onSubmit={handleSignUp}>
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <Input
              type="text"
              isClearable
              className="dark:dark light"
              variant="flat"
              maxLength={15}
              isRequired
              label="First Name"
              value={firstName}
              onValueChange={setFirstName}
            />
            <Input
              type="text"
              isClearable
              className="dark:dark light"
              maxLength={15}
              variant="flat"
              label="Last Name (Optional)"
              value={lastName}
              onValueChange={setLastName}
            />
          </div>
          <Input
            type="text"
            variant="flat"
            color={`${
              (usernameExists === false &&
              username !== "" &&
              username.length >= 5) ?
              "success": "default"
            }`}
            isClearable
            isRequired
            minLength={5}
            maxLength={20}
            className="dark:dark light mb-6"
            isInvalid={usernameExists}
            label="Username"
            value={username}
            errorMessage={usernameExists && "Username already exists"}
            onChange={handleUserNameChange}
          />
          <Input
            type="email"
            variant="flat"
            isClearable
            isRequired
            className="dark:dark light mb-6"
            label="Email"
            value={email}
            onValueChange={setEmail}
          />
          <Input
            type={`${isVisible ? "text" : "password"}`}
            variant="flat"
            minLength={8}
            color={`${passwordStrength && (passwordStrength === "Weak" ? "danger" : passwordStrength === "Moderate" ? "warning" : "success")}`}
            isRequired
            description={`${passwordStrength ? `Password Is ${passwordStrength}` : ""}`}
            className="dark:dark light mb-6"
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
            value={password}
            onValueChange={setPassword}
            onChange={checkPasswordStrength}
          />
          <Input
            type="password"
            variant="flat"
            minLength={8}
            isRequired
            className="dark:dark light mb-6"
            label="Confirm Password"
            value={confirmPassword}
            onValueChange={setConfirmPassword}
          />
          <div className="flex items-start mb-6">
            <Checkbox radius="lg" color="primary">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-300">
                I agree with the
                <a
                  href="#"
                  className="text-blue-600 hover:underline dark:text-blue-500 ml-1"
                >
                  terms and conditions
                </a>
                .
              </div>
            </Checkbox>
          </div>
          <div className="flex items-center justify-between w-full sm:flex-row flex-col gap-2">
            <Button
              type="submit"
              color="primary"
              variant={`shadow`}
              isLoading={loading}
              disabled={password !== confirmPassword || usernameExists}
              className="sm:w-32 w-full disabled:bg-gray-700 disabled:shadow-none"
            >
              {loading ? "Loading" : "Sign In"}
            </Button>
            <Link href="/signIn" className="text-blue-400" replace>
              Already have an account ?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
