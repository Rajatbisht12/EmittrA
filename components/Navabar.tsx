'use client'
import React from "react";
import {SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton} from "@clerk/nextjs"
import { SearchBar } from "./SearchBar";
import { ThemeToggle } from "./Theme-toggle";
import Link from "next/link";

const Navbar = () =>{
    return(
        <div className="w-full h-16 flex items-center justify-center relative border-b">
  <div className="absolute left-[70px] text-2xl text-gray-400">
  <ThemeToggle/>
  </div>
  
  {/* Centered Logo */}
  <div className="absolute left-1/2 transform -translate-x-1/2 font-bold pacifico text-green-600 text-3xl cursor-pointer">
  <Link href="/boards">
      Task Manager
  </Link>
  </div>

  {/* Right Side Auth Buttons */}
  <div className="absolute right-4 flex items-center space-x-2">
    <SignedIn>
      <SearchBar/>
    </SignedIn>
    <SignedOut>
      <SignInButton />
      <SignUpButton />
    </SignedOut>
    <SignedIn>
      <UserButton />
    </SignedIn>
  </div>
</div>

    )
}

export default Navbar;