"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { db } from "../../config/firebaseConfig.js";
import { collection, query, where, getDocs } from "firebase/firestore";
import bcrypt from "bcryptjs";
import Image from "next/image";

export default function LoginPage() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [globalMessage, setGlobalMessage] = useState("");
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const resetFields = () => {
    setForm({
      username: "",
      password: "",
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.username || !form.password) {
      setGlobalMessage("Please fill in all fields.");
      return;
    }

    try {
      const userRef = collection(db, "users");
      const userQuery = query(userRef, where("username", "==", form.username));
      const userSnap = await getDocs(userQuery);

      if (userSnap.empty) {
        setGlobalMessage("Username does not exist.");
        resetFields();
        return;
      }

      const userData = userSnap.docs[0].data();

      const passwordMatch = await bcrypt.compare(
        form.password,
        userData.password
      );
      if (!passwordMatch) {
        setGlobalMessage("Invalid username or password.");
        resetFields();
        return;
      }

      setGlobalMessage("Login successfully!");
      localStorage.setItem("user", JSON.stringify(userData));
      setTimeout(() => router.push("/overview"), 2000);
    } catch (err) {
      setGlobalMessage("Login failed. Please check your credentials.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-new-white flex flex-col items-center justify-center sm:p-8">
      <div className=" bg-re-500 shadow-md w-full sm:max-w-lg md:max-w-xl xl:max-w-6xl min-h-screen sm:min-h-[700px] flex flex-col xl:flex-row sm:rounded-2xl overflow-hidden">
        <div className="w-full h-[200px] xl:h-auto relative">
          {/* left */}
          {/* then ang kulay ay #0e5f97, #0e4772, #fcfcfd, #fb510f, #ecb662 */}
          <Image
            src="/login_bg_mobile.svg"
            alt="Login Background"
            fill
            className="object-cover flex xl:hidden"
          />

          <Image
            src="/login_bg_screen.svg"
            alt="Login Background"
            fill
            className="object-cover hidden xl:flex place-content-center place-items-center"
          />
        </div>
        {/* right side */}
        <div className="relative w-full p-8   bg-geen-500 flex flex-col flex-1 xl:flex-auto bg-white">
          <div className="flex flex-col gap-8 items-center justify-center mt-2 xl:mt-10">
            <div
              className={`text-2xl font-semibold ${
                globalMessage ? "mb-0" : "mb-4"
              }`}
            >
              Sign in to your account
            </div>

            {/* Global validation message */}
            {globalMessage && (
              <div
                className={`border-l-4 rounded-lg px-4 py-2 w-full sm:w-3/4 ${
                  globalMessage.includes("successful")
                    ? "bg-green-100 border-green-500 text-green-500"
                    : "bg-red-100 border-red-500 text-red-500"
                }`}
              >
                {globalMessage}
              </div>
            )}

            <form
              onSubmit={handleLogin}
              className="flex flex-col gap-8 w-full sm:w-3/4"
            >
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 flex flex-col gap-1 justify-center">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    className="border-b-2 py-2 outline-none focus:border-blue-500 transition-colors duration-150"
                    placeholder="Enter your username"
                    onChange={handleInputChange}
                  />
                </div>

                <div className="col-span-2 flex flex-col gap-1 justify-center">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    className="border-b-2 py-2 outline-none focus:border-blue-500 transition-colors duration-150"
                    placeholder="Enter your password"
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="flex gap-4 items-center mt-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-2xl w-full bg-blue-500 text-white transition-colors duration-150 hover:bg-blue-600"
                >
                  Sign in
                </button>
              </div>

              <div className="w-full flex items-center gap-4 ">
                <div className="flex-1 h-[1px] bg-gray-300"></div>
                <span className="text-gray-500 text-sm">sign in with</span>
                <div className="flex-1 h-[1px] bg-gray-300"></div>
              </div>

              <div className="flex gap-4 items-center mt-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded-2xl w-full border transition-colors duration-150 hover:bg-gray-300/20 text-gray-700 flex items-center justify-center gap-4"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    width="24px"
                    height="24px"
                  >
                    <path
                      fill="#FFC107"
                      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                    />
                    <path
                      fill="#FF3D00"
                      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                    />
                    <path
                      fill="#4CAF50"
                      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                    />
                    <path
                      fill="#1976D2"
                      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                    />
                  </svg>
                  Sign in with Google
                </button>
              </div>
            </form>
          </div>
          <div className="text-gray-500 text-sm mt-0 sm:mt-10 absolute bottom-8 left-1/2 -translate-x-1/2 sm:static sm:bottom-auto sm:left-auto sm:translate-x-0  xl:absolute xl:bottom-8 xl:left-1/2 xl:-translate-x-1/2 w-full flex items-center justify-center">
            <Link
              href="/register"
              className="text-gray-500 hover:text-blue-500 hover:underline hover:underline-offset-8"
            >
              Create account
            </Link>

            <span className="mx-8 text-gray-500 font-thin text-2xl">|</span>

            <Link
              href="/forgot-password"
              className="text-gray-500 hover:text-blue-500 hover:underline hover:underline-offset-8"
            >
              Forgot password
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
