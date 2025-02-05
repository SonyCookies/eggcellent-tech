"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { db } from "../../config/firebaseConfig";
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
      setGlobalMessage("Please fill in the form.");
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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center sm:p-8">
      <div className="bg-white shadow-md w-full sm:max-w-lg md:max-w-xl xl:max-w-7xl min-h-screen sm:min-h-[700px] flex flex-col xl:flex-row sm:rounded-2xl overflow-hidden">
        <div className="w-full h-[250px] xl:h-auto relative">
          {/* image here */}
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
        <div className="w-full p-8 place-content-center">
          <div className="flex flex-col gap-8 items-center justify-center">
            <div className="text-2xl font-medium mb-4">
              Sign in to your account
            </div>

            {/* Global validation message */}
            {globalMessage && (
              <div
                className={`border-l-4 px-4 py-2 w-full sm:w-3/4 ${
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

              <div className="flex flex-col gap-4 items-center my-4">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-2xl w-full bg-blue-500 text-white transition-colors duration-150 hover:bg-blue-600 "
                >
                  Sign in
                </button>
                <span className="text-gray-500 text-sm">
                  Don't have an account?{" "}
                  <Link
                    href="/register"
                    className="text-blue-500 hover:underline hover:underline-offset-8"
                  >
                    Create account
                  </Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
