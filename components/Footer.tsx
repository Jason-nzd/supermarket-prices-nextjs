import Link from "next/link";

function Footer() {
  return (
    <footer className="w-4/5 mx-auto h-full text-green-200 text-sm m-4">
      {/* Disclaimer */}
      <div className="flex mx-auto w-fit font-semibold px-4 text-center text-zinc-100">
        {`Prices are updated on weekdays, but aren't always guaranteed to be accurate. Each
        local store will likely have slight differences in pricing.`}
      </div>

      {/* Licenses and Credits */}
      <div className="mx-auto my-3 justify-center w-[10rem] md:w-fit">
        <div className="flex flex-wrap mx-auto justify-center md:flex-nowrap gap-x-8">
          <div>Icons licensed from:</div>
          <Link href="https://icon-icons.com" className="hover-to-white">
            icon-icons.com
          </Link>
          <Link
            href="https://icons.getbootstrap.com/"
            className="hover-to-white"
          >
            icons.getbootstrap.com
          </Link>
        </div>
      </div>

      {/* Copyright, Privacy Policy Link, Github Link */}
      <div className="flex mx-auto gap-6 md:gap-14 p-1 w-fit">
        <div>©2025</div>

        <Link href="../privacy" className="hover-to-white">
          Privacy Policy
        </Link>

        <Link
          className="flex gap-2 hover-to-white items-center"
          href="https://github.com/jason-nzd/supermarket-prices"
        >
          {githubIcon} GitHub
        </Link>
      </div>
    </footer>
  );
}

const githubIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="4"
    height="4"
    fill="currentColor"
    className="w-4 h-4"
    viewBox="0 0 16 16"
  >
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
  </svg>
);

export default Footer;
