import { DatedPrice } from "../../typings";
import { getPriceAvgDifference } from "../../utilities/utilities";

interface Props {
  priceHistory: DatedPrice[];
  unitPrice: string;
}

export default function PriceTag({ priceHistory, unitPrice }: Props) {
  let priceTagDivClass = "glass-capsule h-16 md:h-20 px-3 ring-2";
  let icon;
  const currentPrice = priceHistory[priceHistory.length - 1].Price;

  const priceDiff = getPriceAvgDifference(priceHistory);

  // Icon - Determine up, down, or blank icon depending on price trend
  if (priceDiff >= 2) {
    icon = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-4 h-4 xl:w-6 xl:h-6 text-[#da0202] dark:text-[#f34343]"
      >
        <path
          fillRule="evenodd"
          d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.061l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042-.815a.75.75 0 01-.53-.919z"
          clipRule="evenodd"
        />
      </svg>
    );
  } else if (priceDiff <= -2) {
    icon = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-4 h-4 xl:w-6 xl:h-6 text-[#14bb14] dark:text-[#43d643]"
      >
        <path
          fillRule="evenodd"
          d="M1.22 5.222a.75.75 0 011.06 0L7 9.942l3.768-3.769a.75.75 0 011.113.058 20.908 20.908 0 013.813 7.254l1.574-2.727a.75.75 0 011.3.75l-2.475 4.286a.75.75 0 01-1.025.275l-4.287-2.475a.75.75 0 01.75-1.3l2.71 1.565a19.422 19.422 0 00-3.013-6.024L7.53 11.533a.75.75 0 01-1.06 0l-5.25-5.25a.75.75 0 010-1.06z"
          clipRule="evenodd"
        />
      </svg>
    );
  } else icon = <div className="p-1">-</div>;

  // If price diff is too small, print a grey border
  if (Math.abs(priceDiff) <= 2) {
    priceTagDivClass +=
      " border-[#644] text-[#644] dark:text-zinc-300 dark:border-[#886] dark:text-[#886]";
  }
  // If price diff is +10%, print bold red border
  else if (priceDiff >= 10) {
    priceTagDivClass +=
      " border-[#c00] text-[#c00] dark:border-[#d22] dark:text-[#d22]";
  }
  // If price diff is +2-10%, print mild red border
  else if (priceDiff >= 2) {
    priceTagDivClass +=
      " border-[#a00] text-[#a00] dark:border-[#b33] dark:text-red-700";
  }
  // If price diff is +10%, print bold green border
  else if (priceDiff <= -10) {
    priceTagDivClass +=
      " border-[#0a0] text-[#0a0] dark:border-[#2b2] dark:text-green-500";
  }
  // If price diff is +2-10%, print mild green border
  else if (priceDiff <= -2) {
    priceTagDivClass +=
      " border-[#282] text-[#282] dark:border-[#3a3] dark:text-[#3a3]";
  }

  return (
    <div className="z-50 min-w-38">
      <div className={priceTagDivClass}>
        {/* Icon */}
        <div className="px-1">
          <div className="pr-2 scale-[130%]">{icon}</div>
          <div className="text-sm font-semibold">{Math.abs(priceDiff)}%</div>
        </div>
        <div className="flex flex-col">
          {/* Price */}
          <div className="flex" id="price">
            {/* Dollar Symbol */}
            <div className="pt-[0.2rem] text-sm lg:text-md">$</div>

            {/* Dollars */}
            <div className="font-bold text-xl lg:text-md lg:text-xl tracking-tighter">
              {printDollars(currentPrice)}
            </div>

            {/* Cents */}
            <div className="pt-[0.2rem] pl-[0.1rem] font-semibold text-sm tracking-normal">
              {printCents(currentPrice)}
            </div>
          </div>

          {/* Unit Price */}
          <div className="flex text-md items-center">
            <div className="text-xs">$</div>
            <div className="font-semibold text-lg lg:text-md">{unitPrice}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function printDollars(price: number) {
  if (price === null) return "XX";
  else if (price.toString().includes(".")) {
    return price.toString().split(".")[0];
  } else return price.toString();
}

function printCents(price: number) {
  if (price === null) return "XX";
  else if (price.toString().includes(".")) {
    return "." + price.toString().split(".")[1].padEnd(2, "0");
  } else return "";
}
