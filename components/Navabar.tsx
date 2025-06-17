'use cient'
import React from "react";
import {SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton} from "@clerk/nextjs"
import {Button} from "@/components/ui/button"
import { SearchBar } from "./SearchBar";
import { ThemeToggle } from "./Theme-toggle";
const Navbar = () =>{
    return(
        <div className="w-full h-16 flex items-center justify-center relative border-b">
        <Button className="absolute left-2 flex items-center space-x-2 bg-green-800 text-l text-white hover:bg-green-500">New Board</Button>
        <div className="absolute left-[120px] text-2xl text-gray-400">
    |
  </div>
  <div className="absolute left-[140px] text-2xl text-gray-400">
  <ThemeToggle/>
  </div>
  
  {/* Centered Logo */}
  <div className="absolute left-1/2 transform -translate-x-1/2 font-bold pacifico text-green-600 text-3xl ">
    Task Manager
  </div>

  {/* Right Side Auth Buttons */}
  <div className="absolute right-4 flex items-center space-x-2">
    <SearchBar/>
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