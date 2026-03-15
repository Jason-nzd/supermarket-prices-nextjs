import React, { useContext } from "react";
import { DarkModeContext } from "@/pages/_app";
import NavBar from "@/components/layout/Navbar/Navbar";
import Footer from "@/components/layout/Footer";

interface Props {
  children: React.ReactNode;
  lastUpdatedDate: string;
}

const PageLayout = ({ children, lastUpdatedDate }: Props) => {
  const theme = useContext(DarkModeContext).darkMode ? "dark" : "light";

  return (
    <main className={theme}>
      <NavBar lastUpdatedDate={lastUpdatedDate} />
      {/* Background Div */}
      <div className="content-body">
        {/* Central Aligned Div */}
        <div className="central-responsive-div">
          {children}
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default PageLayout;
