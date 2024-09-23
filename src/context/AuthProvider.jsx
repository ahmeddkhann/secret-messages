"use client"; // Make sure this is at the top of the file

import { SessionProvider } from "next-auth/react";

export default function AuthProvider({ children }) {
  return (
    <SessionProvider>
      {children} {/* Use curly braces instead of angle brackets */}
    </SessionProvider>
  );
}