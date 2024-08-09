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
  createContext<FavouriteCategoriesContextType | null>(null);

// App()
export default function App({ Component, pageProps }: AppProps) {
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Set default favourite categories
  let defaultCategories: string[] = [
    "fruit",
    "fresh-vegetables",
    "milk",
    "butter",
  ];

  // Try read cookie of favourite categories if available
  useEffect(() => {
    const readCategoriesCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("User_Categories="))
      ?.split("=")[1];

    // If not null, override defaultCategories array
    if (readCategoriesCookie)
      defaultCategories = JSON.parse(decodeURIComponent(readCategoriesCookie));
  });

  // Set categories state
  const [favouriteCategories, setFavouriteCategories] =
    useState<string[]>(defaultCategories);

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
