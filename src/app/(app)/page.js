"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome to Mystery Message
          </h1>
          <p className="mb-4">
            Send and receive anonymous messages with privacy and security.
          </p>
        </div>

        <div className="flex flex-col space-y-4">
          
            <a href="/sign-up" className="inline-block w-full px-6 py-3 text-center text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition duration-200">
              Sign Up
            </a>
      
            <a href="/sign-in" className="inline-block w-full px-6 py-3 text-center text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition duration-200">
              Sign In
            </a>
          
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Your privacy is our top priority.
          </p>
        </div>
      </div>
    </div>
  );
}
