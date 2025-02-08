"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function VerifyCodePage({ email = "edwardgatbonton13@gmail.com" }) {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [globalMessage, setGlobalMessage] = useState("");
  const router = useRouter();

  const handleInputChange = (value, index) => {
    if (value.match(/^[0-9]*$/)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move focus to the next input box
      if (value && index < otp.length - 1) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const userEnteredCode = otp.join("");

    // Mock: Pretend the correct code is '123456' for demonstration
    const mockVerificationCode = "123456";

    if (userEnteredCode !== mockVerificationCode) {
      setGlobalMessage("Invalid verification code. Please try again.");
      return;
    }

    // Redirect to the reset password page
    router.push("/reset-password");
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
              Verify Your Code
              <span className="text-gray-500 font-normal text-sm">
                Enter the 6-digit code sent to{" "}
                <span className="font-medium text-black">{email}</span> to continue.
              </span>
            </div>

            {globalMessage && (
              <div
                className={`border-l-4 rounded-lg px-4 py-2 w-full sm:w-3/4 ${
                  globalMessage.includes("Invalid")
                    ? "bg-red-100 border-red-500 text-red-500"
                    : "bg-green-100 border-green-500 text-green-500"
                }`}
              >
                {globalMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full sm:w-3/4">
              <div className="grid grid-cols-6 gap-2 mb-4">
                {/* OTP input fields */}
                {otp.map((value, index) => (
                  <input
                    key={index}
                    id={`otp-input-${index}`}
                    type="text"
                    maxLength="1"
                    value={value}
                    pattern="[0-9]"
                    inputMode="numeric"
                    required
                    className="w-12 h-12 text-center border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500"
                    placeholder="0"
                    onChange={(e) => handleInputChange(e.target.value, index)}
                  />
                ))}
              </div>

              <div className="flex gap-4 items-center mt-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-2xl w-full bg-blue-500 text-white transition-colors duration-150 hover:bg-blue-600"
                >
                  Verify
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
