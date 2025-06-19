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
        <nav className="w-full h-16 flex flex-col sm:flex-row items-center justify-between px-2 sm:px-6 py-2 border-b bg-background relative">
          <div className="flex items-center w-full sm:w-auto justify-between">
            {/* Left: Theme Toggle */}
            <div className="sm:static sm:left-0 text-xl sm:text-2xl text-gray-400">
              <ThemeToggle/>
            </div>
            {/* Mobile: Centered Logo */}
            <div className="sm:hidden absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold pacifico text-green-600 text-2xl cursor-pointer">
              <Link href="/boards">Task Manager</Link>
            </div>
            {/* Mobile: Profile Button at right */}
            <div className="sm:hidden absolute right-2 top-1/2 transform -translate-y-1/2">
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </div>
          {/* Centered Logo for desktop */}
          <div className="hidden sm:block absolute left-1/2 transform -translate-x-1/2 font-bold pacifico text-green-600 text-3xl cursor-pointer">
            <Link href="/boards">Task Manager</Link>
          </div>
          {/* Right Side Auth Buttons (desktop only) */}
          <div className="hidden sm:flex items-center gap-2 mt-2 sm:mt-0 sm:static sm:right-4">
            <SignedIn>
              <div className="flex items-center gap-2">
                <SearchBar/>
                <UserButton />
              </div>
            </SignedIn>
            <SignedOut>
              <SignInButton />
              <SignUpButton />
            </SignedOut>
          </div>
        </nav>
    )
}

export default Navbar;