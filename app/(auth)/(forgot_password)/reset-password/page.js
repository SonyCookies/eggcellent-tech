"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { db } from "../../../config/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import Image from "next/image";

export default function ResetPasswordPage() {
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [globalMessage, setGlobalMessage] = useState("");
  const router = useRouter();

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    validateField(name, value);
  };

  // Validate password fields
  const validateField = (name, value) => {
    let errorMsg = "";

    switch (name) {
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

  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Check for empty fields
    if (!form.password || !form.confirmPassword) {
      setGlobalMessage("Please fill in all fields.");
      return;
    }

    // Check if there are any validation errors
    const hasErrors = Object.values(errors).some((error) => error !== "");
    if (hasErrors) {
      setGlobalMessage("Please fix the highlighted errors.");
      return;
    }

    try {
      const userRef = collection(db, "users");

      // Assuming the email was stored in session/localStorage for lookup
      const email = localStorage.getItem("resetEmail"); // Replace as needed

      if (!email) {
        setGlobalMessage("Reset email not found. Please try again.");
        return;
      }

      const userQuery = query(userRef, where("email", "==", email));
      const userSnap = await getDocs(userQuery);

      if (userSnap.empty) {
        setGlobalMessage("No account found with this email address.");
        return;
      }

      const userDocId = userSnap.docs[0].id;

      // Hash the new password before saving it
      const hashedPassword = await bcrypt.hash(form.password, 12);

      // Update the user's password
      await setDoc(
        doc(db, "users", userDocId),
        { password: hashedPassword },
        { merge: true }
      );

      setGlobalMessage("Password updated successfully");
      setTimeout(() => router.push("/"), 4000);
    } catch (err) {
      setGlobalMessage("An error occurred. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-new-white flex flex-col items-center justify-center sm:p-8">
      <div className="bg-white shadow-md w-full sm:max-w-lg md:max-w-xl xl:max-w-6xl min-h-screen sm:min-h-[700px] flex flex-col xl:flex-row sm:rounded-2xl overflow-hidden">
        <div className="w-full h-[200px] xl:h-auto relative">
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
        <div className="relative w-full p-8 flex flex-col flex-1 xl:flex-auto bg-white">
          <div className="flex flex-col gap-8 items-center justify-center mt-4 xl:mt-10">
            <div
              className={`text-2xl font-semibold flex flex-col text-center gap-1 ${
                globalMessage ? "mb-0" : "mb-4"
              }`}
            >
              Enter your new password
              <span className="text-gray-500 font-normal text-sm  ">
                Your new password must be different to previous password.
              </span>
            </div>

            {globalMessage && (
              <div
                className={`border-l-4 rounded-lg px-4 py-2 w-full sm:w-3/4 ${
                  globalMessage.includes("sent to your email")
                    ? "bg-green-100 border-green-500 text-green-500"
                    : "bg-red-100 border-red-500 text-red-500"
                }`}
              >
                {globalMessage}
              </div>
            )}

            <form
              onSubmit={handleResetPassword}
              className="flex flex-col gap-8 w-full sm:w-3/4"
            >
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 flex flex-col gap-1">
                  <label htmlFor="password">New password</label>
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

              <div className="flex gap-4 items-center mt-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-2xl w-full bg-blue-500 text-white transition-colors duration-150 hover:bg-blue-600"
                >
                  Reset Password
                </button>
              </div>
            </form>
          </div>
          <div className="text-gray-500 text-sm mt-0 sm:mt-10 absolute bottom-8 left-1/2 -translate-x-1/2 w-full flex items-center justify-center">
            <Link
              href="/login"
              className="text-gray-500 hover:text-blue-500 hover:underline hover:underline-offset-8"
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
