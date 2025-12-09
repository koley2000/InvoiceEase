// "use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { RxCross2 } from "react-icons/rx";
import { AiOutlineMenu } from "react-icons/ai";
import { useSession, signOut } from "next-auth/react";

const Navbar: React.FC = () => {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const loginStatus = status === "authenticated";

  return (
    <nav className="sticky bg-foreground shadow-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-3 sm:px-5">
        {/* Left: Logo + Brand */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/apple-touch-icon.png" alt="logo" width={32} height={32} priority />
            <span className="inline text-base sm:text-lg font-semibold italic text-accent">
              InvoiceEase
            </span>
          </Link>
        </div>

        {/* Center (Desktop Only) */}
        {loginStatus && (
          <div className="hidden md:flex items-center space-x-4 text-[#4A5568] tracking-widest text-base">
            <Link href="/create-invoice" className="hover:text-accent transition hover:underline hover:scale-105">
              Create New
            </Link>
            <Link href="/dashboard" className="hover:text-accent transition hover:underline hover:scale-105">
              Dashboard
            </Link>
          </div>
        )}

        {/* Right Side Buttons (Desktop) */}
        {!loginStatus && (
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-4xl bg-accent px-3 py-1.5 text-sm font-semibold tracking-wider text-white transition hover:bg-secondary-accent hover:scale-105"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="rounded-md px-3 py-1.5 text-sm font-semibold tracking-widest text-[#4A5568] transition hover:text-accent hover:underline hover:scale-105"
            >
              SignUp
            </Link>
          </div>
        )}

        {loginStatus && (
          <div className="hidden md:flex items-center gap-3">
            <span className="text-sm font-medium text-black">
              Hi, {session?.user?.name?.split(" ")[0] || "User"}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="rounded-md bg-gray-100 px-3 py-1.5 text-sm text-[#4A5568] font-semibold hover:bg-background hover:scale-105 hover:cursor-pointer"
            >
              Logout
            </button>
          </div>
        )}

        {/* Mobile Menu Button */}
        <button
          className="md:hidden inline-flex items-center justify-center p-1 text-[#4A5568] hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <RxCross2 /> : <AiOutlineMenu />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="absolute left-0 right-0 top-full z-50 bg-foreground border-t border-gray-200 shadow-md">
          <div className="flex flex-col items-start p-3 space-y-4 text-[#4A5568]">
            {loginStatus ? (
              <>
                <Link href="/dashboard" className="active:text-accent w-full text-sm">
                  Dashboard
                </Link>
                <Link href="#" className="active:text-accent w-full text-sm">
                  Create New
                </Link>
                <button onClick={() => signOut({ callbackUrl: '/' })} className="active:text-accent w/full text-left text-sm">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="active:text-accent w-full text-left text-sm">
                  Login
                </Link>
                <Link href="/signup" className="active:text-accent w-full text-sm">
                  SignUp
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
