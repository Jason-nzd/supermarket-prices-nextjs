import Image from "next/image";
import Link from "next/link";
import startCase from "lodash/startCase";
import React, { useContext } from "react";
import kiwifruit from "../../public/logo.webp";
import DepartmentCategoryMenu from "./CategoryMenu";
import SearchBar from "../SearchBar";
import MobileBurgerMenu from "./MobileBurgerMenu";
import DarkModeToggle from "./DarkModeToggle";
import { useRouter } from "next/router";
import { FavouriteCategoriesContext } from "pages/_app";

// NavBar
// ------
// Responsive NavBar containing logo, page title, user favourite categories,
// many menu buttons, search bar, last updated date

interface Props {
  lastUpdatedDate: string;
}

const NavBar = ({ lastUpdatedDate }: Props) => {
  const router = useRouter();
  const currentPath = router.asPath;

  // Get favourite categories context
  const context = useContext(FavouriteCategoriesContext);
  if (!context) {
    throw new Error("Component must be wrapped with ContextProvider");
  }
  const { favouriteCategories } = context;

  return (
    <nav className="w-full h-fit overflow-hidden">
      {/* Desktop Navbar */}
      <div
        className="hidden lg:flex mx-auto w-[100%] 2xl:w-[90rem] 3xl:w-[110rem] 
        transition-all duration-500 flex-nowrap items-center"
      >
        {/* Website Logo */}
        <Link href="/" className="ml-2">
          <Image
            src={kiwifruit}
            alt=""
            className="hidden lg:block w-[5rem] min-w-[5rem] pt-1 pb-2 duration-200 
              hover:rotate-12 hover:scale-[102%]"
          />
        </Link>

        <div className="block w-full lg:w-[calc(100%-6rem)] h-[3.6rem] lg:h-[5rem]">
          {/* Row 1 - Title - Sub-title - Date */}
          <div
            className="flex flex-wrap h-full lg:h-1/2 mx-auto w-full items-center 
            lg:items-center ml-1"
          >
            {/* Title */}
            <Link href="/" className="mr-auto lg:mr-0">
              <h1 className="ml-2 text-2xl font-bold text-stone-100 hover-to-white">
                KiwiPrice.xyz
              </h1>
            </Link>

            {/* Sub Title */}
            <h3
              className="hidden lg:flex ml-6 pt-2 mr-auto text-sm select-none font-bold
             text-zinc-100"
            >
              Tracking the cost of food across New Zealand
            </h3>

            {/* Last Updated Date */}
            <div
              className="hidden lg:block pb-2 text-primary-colour text-sm select-none 
              pr-4 mt-2 w-fit ml-auto h-8"
            >
              Updated {lastUpdatedDate}
            </div>
          </div>

          {/* Row 2 - Categories - Search Bar*/}
          <div className="h-1/2 hidden lg:flex items-center pb-2">
            {/* Categories */}
            <div className="flex items-center overflow-hidden whitespace-nowrap w-fit">
              {favouriteCategories.map((name) => {
                const href = "/products/" + name;
                const isActive = currentPath.includes(href);
                return (
                  <Link
                    className={`nav-main-link ${
                      isActive ? "nav-main-link-active" : ""
                    }`}
                    href={href}
                    key={href}
                  >
                    {startCase(name)}
                  </Link>
                );
              })}
            </div>

            {/* More Categories Button */}
            <DepartmentCategoryMenu />

            {/* Search Bar */}
            <div className="w-fit ml-auto">
              <SearchBar />
            </div>

            {/* Right Button Menu */}
            <div
              className="hidden lg:flex lg:flex-col items-center ml-auto w-fit mt-3 
              h-full pr-2"
            >
              <div className="h-1/2 flex items-center ml-auto pl-3">
                {/* Dark Mode Toggle */}
                <div className="mt-1 ml-auto">
                  <DarkModeToggle />
                </div>

                {/* User Profile */}
                <Link
                  className="ml-2 xl:ml-3 text-primary-colour hover-to-white"
                  href="#"
                  id="user-profile-link"
                >
                  {userIcon}
                </Link>

                {/* Admin */}
                <Link
                  className="mx-2 xl:ml-3 text-primary-colour hover-to-white"
                  href="/admin"
                  id="admin-link"
                >
                  {tableIcon}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="flex h-14 lg:hidden mx-auto w-[100%] transition-all duration-500 items-center">
        {/* Burger Menu */}
        <div className="absolute z-50 justify-start left-1 top-1 ml-2 my-auto">
          <MobileBurgerMenu />
        </div>

        {/* Logo and Title */}
        <Link href="/" className="flex items-center mx-auto">
          <Image
            src={kiwifruit}
            alt=""
            className="w-[2.5rem] duration-200 hover:rotate-12 hover:scale-[102%]"
          />
          <h1 className="ml-2 text-2xl font-bold text-stone-100 hover-to-white">
            KiwiPrice.xyz
          </h1>
        </Link>

        {/* Search Menu */}
        <div className="mr-1">
          <SearchBar
            iconSize={8}
            iconHexColour="#86efac"
            mobileVersion={true}
          />
        </div>
      </div>
    </nav>
  );
};

export const burgerIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    className="w-12 h-12"
    viewBox="0 0 16 16"
  >
    <path
      fillRule="evenodd"
      d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
    />
  </svg>
);

export const userIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="w-10 h-10 lg:w-8 lg:h-8"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

export const cartIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="w-8 h-8"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
    />
  </svg>
);

export const tableIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="w-8 h-8"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5"
    />
  </svg>
);

export const plusIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    strokeWidth="1"
    stroke="currentColor"
    className="w-8 h-8 pt-1 nav-main-link"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export default NavBar;
