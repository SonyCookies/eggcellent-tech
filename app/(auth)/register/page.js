"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { db } from "../../config/firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [globalMessage, setGlobalMessage] = useState("");
  const router = useRouter();

  // Handle input changes and real-time validation
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let errorMsg = "";

    switch (name) {
      case "fullname":
        if (!value) errorMsg = "Full name is required.";
        break;
      case "username":
        if (!value) errorMsg = "Username is required.";
        break;
      case "email":
        if (!value) errorMsg = "Email is required.";
        else if (!/\S+@\S+\.\S+/.test(value))
          errorMsg = "Invalid email address.";
        break;
      case "password":
        if (value.length < 8)
          errorMsg = "Password must be at least 8 characters.";
        break;
      case "confirmPassword":
        if (value !== form.password) errorMsg = "Passwords do not match.";
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMsg }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Check for empty fields
    const emptyFields = Object.entries(form).filter(
      ([key, value]) => value === ""
    );
    if (emptyFields.length > 0) {
      setGlobalMessage("Please fill in all fields.");
      return;
    }

    // Check if there are any remaining validation errors
    const hasErrors = Object.values(errors).some((error) => error !== "");
    if (hasErrors) {
      setGlobalMessage("Please fix the highlighted errors.");
      return;
    }

    try {
      const userRef = collection(db, "users");

      const existingUserQuery = query(
        userRef,
        where("username", "==", form.username)
      );
      const existingEmailQuery = query(
        userRef,
        where("email", "==", form.email)
      );

      const [existingUserSnap, existingEmailSnap] = await Promise.all([
        getDocs(existingUserQuery),
        getDocs(existingEmailQuery),
      ]);

      if (!existingUserSnap.empty) {
        setGlobalMessage("Username already taken.");
        return;
      }

      if (!existingEmailSnap.empty) {
        setGlobalMessage("Email already taken");
        return;
      }

      const hashedPassword = await bcrypt.hash(form.password, 12);

      await setDoc(doc(db, "users", uuidv4()), {
        fullname: form.fullname,
        username: form.username,
        email: form.email,
        password: hashedPassword,
      });

      setGlobalMessage("Account created successfully");
      setTimeout(() => router.push("/"), 4000);
    } catch (err) {
      setGlobalMessage("Registration failed. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-new-white flex flex-col items-center justify-center sm:p-8">
      <div className="bg-white shadow-md w-full sm:max-w-lg md:max-w-xl xl:max-w-6xl min-h-screen sm:min-h-[700px] flex flex-col xl:flex-row sm:rounded-2xl overflow-hidden">
        <div className="w-full h-[200px] xl:h-auto relative">
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
        </div>{" "}
        <div className="relative w-full p-8 xl:place-content-center bg-geen-500 flex flex-col flex-1 xl:flex-auto bg-white">
          <div className="flex flex-col gap-8 items-center justify-center">
            <div
              className={`text-2xl font-semibold ${
                globalMessage ? "mb-0" : "mb-4"
              }`}
            >
              Create your account
            </div>

            {/* Global validation message */}
            {globalMessage && (
              <div
                className={`border-l-4 rounded-lg px-4 py-2 w-full sm:w-3/4 ${
                  globalMessage.includes("successfully")
                    ? "bg-green-100 border-green-500 text-green-500"
                    : "bg-red-100 border-red-500 text-red-500"
                }`}
              >
                {globalMessage}
              </div>
            )}

            <form
              onSubmit={handleRegister}
              className="flex flex-col gap-8 w-full sm:w-3/4"
            >
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 xl:col-span-1 flex flex-col gap-1">
                  <label htmlFor="fullname">Full name</label>
                  <input
                    type="text"
                    name="fullname"
                    id="fullname"
                    className="border-b-2 py-2 outline-none focus:border-blue-500 transition-colors duration-150 mt-1"
                    placeholder="Enter your fullname"
                    onChange={handleInputChange}
                  />
                  {errors.fullname && (
                    <span className="text-red-500 text-sm">
                      {errors.fullname}
                    </span>
                  )}
                </div>

                <div className="col-span-2 xl:col-span-1 flex flex-col gap-1">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    className="border-b-2 py-2 outline-none focus:border-blue-500 transition-colors duration-150 mt-1"
                    placeholder="Enter your username"
                    onChange={handleInputChange}
                  />
                  {errors.username && (
                    <span className="text-red-500 text-sm">
                      {errors.username}
                    </span>
                  )}
                </div>

                <div className="col-span-2 flex flex-col gap-1">
                  <label htmlFor="email">Email address</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="border-b-2 py-2 outline-none focus:border-blue-500 transition-colors duration-150 mt-1"
                    placeholder="Enter your email address"
                    onChange={handleInputChange}
                  />
                  {errors.email && (
                    <span className="text-red-500 text-sm">{errors.email}</span>
                  )}
                </div>

                <div className="col-span-2 flex flex-col gap-1">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    className="border-b-2 py-2 outline-none focus:border-blue-500 transition-colors duration-150 mt-1"
                    placeholder="Enter your password"
                    onChange={handleInputChange}
                  />
                  {errors.password && (
                    <span className="text-red-500 text-sm">
                      {errors.password}
                    </span>
                  )}
                </div>

                <div className="col-span-2 flex flex-col gap-1">
                  <label htmlFor="confirmPassword">Confirm password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    className="border-b-2 py-2 outline-none focus:border-blue-500 transition-colors duration-150 mt-1"
                    placeholder="Confirm your password"
                    onChange={handleInputChange}
                  />
                  {errors.confirmPassword && (
                    <span className="text-red-500 text-sm">
                      {errors.confirmPassword}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-4 items-center my-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-2xl w-full bg-blue-500 text-white transition-colors duration-150 hover:bg-blue-600"
                >
                  Create account
                </button>
                <span className="text-gray-500 text-sm">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-blue-500 hover:underline hover:underline-offset-8 transition-transform duration-150"
                  >
                    Sign in
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
