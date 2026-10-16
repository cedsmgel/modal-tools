import Image from "next/image";
import { Suspense } from "react";
import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";

function AuthControls() {
  return (
    <div className="flex items-center gap-4">
      <Show when="signed-out">
        <SignInButton mode="modal">
          <button className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:text-black dark:hover:text-white transition-colors cursor-pointer">
            Sign In
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button className="px-4 py-2 text-sm font-medium bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity cursor-pointer">
            Sign Up
          </button>
        </SignUpButton>
      </Show>
      <Show when="signed-in">
        <UserButton />
      </Show>
    </div>
  );
}

function GetStartedButton() {
  return (
    <Show when="signed-out">
      <SignInButton mode="modal">
        <button className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px] cursor-pointer">
          Get Started
        </button>
      </SignInButton>
    </Show>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col flex-1 min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <header className="w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-black/80 backdrop-blur px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-lg text-black dark:text-white">
          <span>Modal Tools</span>
        </div>
        <Suspense fallback={<div className="h-8 w-24 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />}>
          <AuthControls />
        </Suspense>
      </header>

      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-24 px-16 mx-auto bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert h-5 w-[100px]"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left my-8">
          <h1 className="max-w-md text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Welcome to Modal Tools
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Authentication is powered by Clerk and Edge Security on Cloudflare.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <Suspense fallback={null}>
            <GetStartedButton />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
