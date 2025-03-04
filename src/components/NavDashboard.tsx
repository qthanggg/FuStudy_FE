"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useAuthStore from "@/lib/hooks/useUserStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
interface NavDashboardProps {
  page: string;
}
const NavDashboard: React.FC<NavDashboardProps> = ({ page }) => {
  const [popoverOpen, setPopoverOpen] = useState(false); // Add state for popover
  const router = useRouter();
  
  const { isLoggedIn, userInfo, logout } = useAuthStore((state) => ({
    isLoggedIn: state.isLoggedIn,
    userInfo: state.userInfo,
    logout: state.logout,
  }));

  const handleLogout = () => {
    logout(); // Call the logout function from useAuthStore
    setPopoverOpen(false); // Close the popover after logout
    router.push("/");
  };

  return (
    <>
      <nav className="block w-full max-w-full bg-transparent text-white shadow-none rounded-xl transition-all px-0 py-1">
        <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
          <div className="capitalize">
            <nav aria-label="breadcrumb" className="w-max">
              <ol className="flex flex-wrap items-center w-full bg-opacity-60 rounded-md bg-transparent p-0 transition-all">
                <li className="flex items-center text-blue-gray-900 antialiased font-sans text-sm font-normal leading-normal cursor-pointer transition-colors duration-300 hover:text-light-blue-500">
                  <a href="#">
                    <p className="block antialiased font-sans text-sm leading-normal text-blue-900 font-normal opacity-50 transition-all hover:text-blue-500 hover:opacity-100">
                      dashboard
                    </p>
                  </a>
                  <span className="text-gray-500 text-sm antialiased font-sans font-normal leading-normal mx-2 pointer-events-none select-none">
                    /
                  </span>
                </li>
                <li className="flex items-center text-blue-900 antialiased font-sans text-sm font-normal leading-normal cursor-pointer transition-colors duration-300 hover:text-blue-500">
                  <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">
                    {page}
                  </p>
                </li>
              </ol>
            </nav>
            <h6 className="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-gray-900">
              {page}
            </h6>
          </div>
          <div className="flex items-center space-x-5 px-10">
            <div className="mr-auto md:mr-4 md:w-56">
              <div className="relative w-full min-w-[200px] h-10">
                <input
                  className="peer w-full h-full bg-transparent text-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-blue-500"
                  placeholder=" "
                />
                <label className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal peer-placeholder-shown:text-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-blue-gray-400 peer-focus:text-blue-500 before:border-blue-gray-200 peer-focus:before:border-blue-500 after:border-blue-gray-200 peer-focus:after:border-blue-500">
                  Type here
                </label>
              </div>
            </div>
            <div className="">
              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={"https://github.com/shadcn.png"} />
                      <AvatarFallback>
                        {userInfo.username
                          ? userInfo.username[0].toUpperCase()
                          : "CN"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="bg-white w-28 p-0 block text-center rounded-2xl space-y-2">
                  {userInfo.username == "admin1" && (
                    <Link href="/admin/dashboard" passHref>
                      <div className="border-b border-gray-200">
                        <button className="text-sm py-2 text-gray-700 hover:bg-gray-100 hover:rounded-full hover:px-2">
                          Dashboard
                        </button>
                      </div>
                    </Link>
                  )}

                  <Link href="/profile" passHref>
                    <div className="border-b border-gray-200">
                      <button className="text-sm py-2 text-gray-700 hover:bg-gray-100 hover:rounded-full hover:px-2">
                        Edit Profile
                      </button>
                    </div>
                  </Link>
                  <Link href="/question" passHref>
                    <div className="border-b border-gray-200">
                      <button className="text-sm py-2 text-gray-700 hover:bg-gray-100 hover:rounded-full hover:px-2">
                        Question
                      </button>
                    </div>
                  </Link>

                  <div className="">
                    <button
                      onClick={handleLogout}
                      className="text-sm py-1 text-gray-700 hover:bg-gray-100 hover:rounded-full hover:px-2"
                    >
                      Logout
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavDashboard;
