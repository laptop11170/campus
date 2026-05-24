"use client";

import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
  <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
  <SignIn routing="path" path="/login" fallbackRedirectUrl="/" signUpFallbackRedirectUrl="/" />
  </div>
  );
}
