import { useContext } from "react";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar/NavBar";
import { utcDateToMediumDate } from "../utilities/utilities";
import { DarkModeContext } from "./_app";

interface Props {
  lastChecked: string;
}

export default function Privacy({ lastChecked }: Props) {
  const theme = useContext(DarkModeContext).darkMode ? "dark" : "light";

  return (
    <main className={theme}>
      <NavBar lastUpdatedDate={lastChecked} />
      {/* Background Div */}
      <div className="content-body">
        {/* Central Aligned Div */}
        <div className="central-responsive-div">
          {/* Page Title */}
          <div className="grid-title">Privacy & Cookie Policy</div>
          <div className="max-w-3xl mx-auto min-h-[20rem] px-2">
            <p>
              Each user can choose favourite categories to appear at the top
              menu. These categories are saved as a cookie with session expiry.
              The website can still fully function if cookies are disabled.
            </p>
            <p className="mt-2">No other information is stored or collected.</p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

export async function getStaticProps() {
  const lastChecked = utcDateToMediumDate(new Date());

  return {
    props: {
      lastChecked,
    },
  };
}
