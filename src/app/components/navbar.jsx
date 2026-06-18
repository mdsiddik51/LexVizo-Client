"use client";
import { useState } from "react";
import { Button, Link, Avatar, SearchField } from "@heroui/react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="pt-3 w-11/12 mx-auto pb-4">
      <nav className="px-5  ">
        <header className="flex h-16 items-center justify-between px-1 md:px-6">
          <div className="flex items-center gap-1 md:gap-4">
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <span className="sr-only">Menu</span>
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
            <div className="flex items-center  gap-2">
              <img src="/images/logo.png" alt="LexVizo" className="w-10 h-10" />
              <h1 className="text-xl hidden md:block  md:text-2xl font-black bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent tracking-wider">
                LexVizo
              </h1>
            </div>
          </div>

          <div className="hidden md:block">
            <SearchField name="search">
              <SearchField.Group>
                <SearchField.SearchIcon />
                <SearchField.Input placeholder="Search..." />
                <SearchField.ClearButton />
              </SearchField.Group>
            </SearchField>
          </div>

          <div className="flex justify-between gap-4">
            <ul className="hidden text-white gap-4 md:flex">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/browseloyers">Browse Lawyers</Link>
              </li>
              <li>
                <Link href="/dashboard">Dashboard</Link>
              </li>
            </ul>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={() => signOut()}
              className=" bg-gradient-to-r from-amber-400 to-orange-500 text-white font-semibold px-6 py-3 rounded-sm  shadow-sm hover:shadow-sm transition-all duration-300 hover:scale-105 "
            >
              login
            </Button>
            <Button
              variant="tertiary"
              className="
                    bg-gradient-to-r from-amber-400 to-orange-500 text-white font-semibold px-6 py-3 rounded-sm shadow-sm hover:shadow-sm transition-all duration-300 hover:scale-105 "
            >
              Register
            </Button>
          </div>
        </header>

        {isMenuOpen && (
          <div className="border-t border-separator md:hidden">
            <ul className="flex flex-col gap-2 p-4">
              <li>
                <SearchField name="search">
                  <SearchField.Group>
                    <SearchField.SearchIcon />
                    <SearchField.Input placeholder="Search..." />
                    <SearchField.ClearButton />
                  </SearchField.Group>
                </SearchField>
              </li>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/allappointment"> All Appointment</Link>
              </li>
              <li>
                <Link href="/dashboard">Dashboard</Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
