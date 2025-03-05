import { getCookie, hasCookie } from "cookies-next";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Manrope } from "next/font/google";
import Head from "next/head";
import { createContext, useEffect, useState } from "react";

const manropeFont = Manrope({ subsets: ["latin"] });

// Dark mode context
type DarkModeContextType = {
  darkMode: boolean;
  toggleDarkMode: () => void;
};
export const DarkModeContext = createContext<DarkModeContextType>({
  darkMode: false,
  toggleDarkMode: () => {},
});

// Favourite product categories context
type FavouriteCategoriesContextType = {
  favouriteCategories: string[];
  setFavouriteCategories: (categories: string[]) => void;
};
export const FavouriteCategoriesContext =
  createContext<FavouriteCategoriesContextType>({
    favouriteCategories: [],
    setFavouriteCategories: () => {},
  });

// App()
export default function App({ Component, pageProps }: AppProps) {
  // Set default dark mode
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Set default favourite categories
  const [favouriteCategories, setFavouriteCategories] = useState<string[]>([
    "fruit",
    "fresh-vegetables",
    "milk",
    "butter",
  ]);

  // Try override with a cookie of favourite categories
  useEffect(() => {
    if (hasCookie("User_Categories")) {
      const categoriesCookie = getCookie("User_Categories") as string;
      const readCategories: string[] = categoriesCookie
        ? (JSON.parse(categoriesCookie) as string[])
        : [];
      setFavouriteCategories(readCategories);
    }
  }, []);

  return (
    <>
      <Head>
        <title>KiwiPrice.xyz</title>
      </Head>
      <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
        <FavouriteCategoriesContext.Provider
          value={{ favouriteCategories, setFavouriteCategories }}
        >
          <main className={manropeFont.className}>
            <Component {...pageProps} />
          </main>
        </FavouriteCategoriesContext.Provider>
      </DarkModeContext.Provider>
    </>
  );
}
