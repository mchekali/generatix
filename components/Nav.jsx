"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

const Nav = () => {
  const { data: session } = useSession();
  const [providers, setProviders] = useState(null);
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const setUpProviders = async () => {
      const response = await getProviders();
      setProviders(response);
    };
    setUpProviders();
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <nav className="navbar" data-headlessui-state="">
      <div className="mx-auto max-w-7xl lg:px-8">
        <div className="relative flex items-center">
          <div className="flex flex-1 items-center sm:justify-between">
            <div className="flex flex-shrink-0 items-center border-right">
              <Link href="/" className="flex-shrink-0">
                <Image
                  src="/assets/images/logo-white-transparent.png"
                  alt="Logo"
                  width={150}
                  height={20}
                />
              </Link>
            </div>
            <div className="hidden lg:flex items-center border-right">
              <div className="flex justify-end space-x-4">
                <Link
                  href="/pricing"
                  className="navlinks hover:text-white hover:bg-gray-500 px-3 py-4 rounded-md text-smlg font-normal"
                >
                  Pricing
                </Link>
                <Link
                  href="/signin"
                  className="navlinks hover:text-white hover:bg-gray-500 px-3 py-4 rounded-md text-sm font-normal"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="navlinks hover:text-white hover:bg-gray-500 px-3 py-4 rounded-md text-sm font-normal"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
          <div className="block lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
              className="block h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
