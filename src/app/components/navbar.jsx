"use client";
import { useState, useEffect } from "react";
import { Button, Link, SearchField } from "@heroui/react";
import { ArrowRightFromSquare } from "@gravity-ui/icons";
import { Dropdown, Label } from "@heroui/react";
import { signOut, useSession } from "@/lib/auth-client";
import { GetUserImage } from "@/lib/actions/api/images";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileImgUrl, setProfileImgUrl] = useState("");
  const { data } = useSession() || { data: null };
  const user = data?.user;


  useEffect(() => {
    let isMounted = true;

    const fetchNavbarAvatar = async () => {
      const targetId = user?.id || user?._id;
      if (!targetId) {
        setProfileImgUrl(""); t
        return;
      }
      
      try {
        const response = await GetUserImage(targetId);
        if (isMounted && response?.imageUrl) {
          setProfileImgUrl(response.imageUrl);
        }
      } catch (error) {
        console.error("Failed fetching navbar avatar data profile:", error);
      }
    };

    fetchNavbarAvatar();

    return () => {
      isMounted = false;
    };
  }, [user?.id, user?._id]);

  const getInitials = (name) => {
    if (!name) return "??";
    const parts = name.trim().split(/\s+/); 
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const initials = getInitials(user?.name);

  
  const handleDropdownAction = async (key) => {
    if (key === "logout") {
      await signOut();
    }
  };

  return (
    <div className="w-full bg-[#050811] border-b border-[#131B2E]">
      <nav className="w-11/12 mx-auto max-w-7xl">
        <header className="flex h-20 items-center justify-between px-2 md:px-4">
          
          
          <div className="flex items-center gap-2 md:gap-4">
            <button
              className="md:hidden text-gray-400 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            <Link href="/" className="flex items-center gap-2.5 group">
              <img src="/images/logo.png" alt="LexVizo Logo" className="w-9 h-9 brightness-110" />
              <h1 className="text-xl md:text-2xl font-serif font-medium tracking-wider text-[#FCBA80] group-hover:text-[#E2A76F] transition-colors">
                LexVizo
              </h1>
            </Link>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:block w-72">
            <SearchField name="search" className="w-full">
              <SearchField.Group className="bg-[#0A0F1D] border border-[#131B2E] focus-within:border-[#FCBA80]/40 transition-all rounded-none h-9 px-3">
                <SearchField.SearchIcon className="text-gray-500 size-4" />
                <SearchField.Input 
                  placeholder="Search..." 
                  className="text-xs text-gray-300 font-light placeholder-gray-600 focus:outline-none"
                />
                <SearchField.ClearButton className="text-gray-500" />
              </SearchField.Group>
            </SearchField>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center">
            <ul className="flex items-center gap-8 text-xs uppercase font-mono tracking-widest text-gray-300">
              <li>
                <Link href="/" className="text-gray-300 hover:text-[#FCBA80] transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/browseloyers" className="text-gray-300 hover:text-[#FCBA80] transition-colors">Browse Lawyers</Link>
              </li>
              <li>
                <Link 
                  href={user?.role ? `/dashboard/${user.role}` : "/dashboard"} 
                  className="text-gray-300 hover:text-[#FCBA80] transition-colors"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Dynamic User Profile Options Panel */}
          <div className="flex items-center gap-4">
            {user ? (
              <Dropdown onAction={handleDropdownAction}>
                <Dropdown.Trigger className="cursor-pointer">
                  <div className="w-9 h-9 border border-[#FCBA80]/40 bg-[#131B2E] overflow-hidden select-none flex items-center justify-center">
                    {profileImgUrl ? (
                      <img src={profileImgUrl} alt={user.name || "User Profile"} className="w-full h-full object-cover object-top" />
                    ) : (
                      <span className="text-xs font-mono font-bold text-[#FCBA80]">{initials}</span>
                    )}
                  </div>
                </Dropdown.Trigger>
                <Dropdown.Popover className="bg-[#0E1526] border border-[#131B2E] text-white rounded-none shadow-2xl p-0">
                  <div className="px-4 py-3.5 border-b border-[#131B2E] bg-[#0A0F1D]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 border border-[#131B2E] bg-[#131B2E] flex items-center justify-center shrink-0">
                        {profileImgUrl ? (
                          <img src={profileImgUrl} alt={user.name || "User Profile"} className="w-full h-full object-cover object-top" />
                        ) : (
                          <span className="text-[10px] font-mono font-bold text-[#FCBA80]">{initials}</span>
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <p className="text-xs font-mono tracking-wide text-white truncate">{user.name}</p>
                        <p className="text-[10px] font-mono text-[#637599] truncate mt-0.5">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  <Dropdown.Menu className="p-1">
                    <Dropdown.Item key="profile" textValue="Profile" className="hover:bg-[#131B2E] rounded-none px-3 py-2 text-xs font-mono text-gray-300 transition-colors">
                      <Label className="cursor-pointer">Profile</Label>
                    </Dropdown.Item>
                    <Dropdown.Item
                      key="logout"
                      textValue="Logout"
                      variant="danger"
                      className="hover:bg-red-950/40 rounded-none px-3 py-2 text-xs font-mono text-red-400 transition-colors"
                    >
                      <div onClick={() => signOut()} className="flex w-full items-center justify-between gap-2">
                        <Label className="cursor-pointer text-red-400">Log Out</Label>
                        <ArrowRightFromSquare className="size-3.5 text-red-400" />
                      </div>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown>
            ) : (
              <div className="flex gap-3">
                <Link href="/auth/login" className="no-underline">
                  <Button className="bg-transparent border border-[#FCBA80]/40 text-[#FCBA80] hover:bg-[#FCBA80] hover:text-black text-xs uppercase font-mono font-bold tracking-wider px-5 h-9 rounded-none transition-all duration-200">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/signup" className="no-underline">
                  <Button className="bg-[#FCBA80] text-black hover:bg-[#E2A76F] text-xs uppercase font-mono font-bold tracking-wider px-5 h-9 rounded-none transition-all duration-200 shadow-lg shadow-orange-950/20">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {isMenuOpen && (
          <div className="border-t border-[#131B2E] md:hidden bg-[#050811] animate-fade-in">
            <ul className="flex flex-col gap-4 p-4 text-xs font-mono uppercase tracking-wider">
              <li className="pb-2 border-b border-[#131B2E]">
                <SearchField name="search" className="w-full">
                  <SearchField.Group className="bg-[#0A0F1D] border border-[#131B2E] rounded-none h-9 px-3">
                    <SearchField.SearchIcon className="text-gray-500 size-4" />
                    <SearchField.Input placeholder="Search..." className="text-xs text-gray-300" />
                  </SearchField.Group>
                </SearchField>
              </li>
              <li>
                <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-gray-300 hover:text-[#FCBA80] transition-colors block py-1">Home</Link>
              </li>
              <li>
                <Link href="/allappointment" onClick={() => setIsMenuOpen(false)} className="text-gray-300 hover:text-[#FCBA80] transition-colors block py-1">All Appointment</Link>
              </li>
              <li>
                <Link 
                  href={user?.role ? `/dashboard/${user.role}` : "/dashboard"} 
                  onClick={() => setIsMenuOpen(false)} 
                  className="text-gray-300 hover:text-[#FCBA80] transition-colors block py-1"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;