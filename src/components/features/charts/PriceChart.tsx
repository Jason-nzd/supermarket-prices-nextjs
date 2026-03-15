import { DatedPrice, Product } from "@/typings";
import { getPriceAvgDifference, printPrice } from "@/lib/utils";
import {
  CategoryScale,
  Chart,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";
import "chartjs-adapter-date-fns";
import { DarkModeContext } from "@/pages/_app";
import { useContext, useEffect, useState, useRef } from "react";

interface Props {
  product: Product;
  useLargeVersion: boolean;
  useSteppedLine?: boolean;
}

// Initialize chart.js line chart
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Tooltip,
);

function PriceChart({
  product,
  useLargeVersion = false,
  useSteppedLine = true,
}: Props) {
  const chartRef = useRef<Chart<"line">>(null);
  const theme = useContext(DarkModeContext).darkMode ? "dark" : "light";
  const isDark = theme === "dark";

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const currentRef = chartRef.current;
    return () => {
      // Manual cleanup to prevent "ownerDocument" errors on unmount/HMR
      if (currentRef) {
        currentRef.destroy();
      }
    };
  }, []);

  // Make a copy of the price history array for chart specific tweaks
  const ph = [...product.priceHistory];

  // Check if the price was updated today or not
  const lastDatedPrice = ph[ph.length - 1];
  const lastCheckedDate = lastDatedPrice.date;
  const todayString = new Date().toISOString().split("T")[0];
  const wasUpdatedToday = lastCheckedDate == todayString;

  // Limit small charts to five months ago for readability
  const fiveMonthsAgo = new Date(
    new Date().getTime() - 5 * 30 * 24 * 60 * 60 * 1000,
  );

  // Find the min and max all time price
  const minPrice = Math.min(...ph.map((datedPrice) => datedPrice.price));
  const maxPrice = Math.max(...ph.map((datedPrice) => datedPrice.price));

  // If any of prices are too high to warrant decimals, don't show decimals
  const displayWithoutDecimals = ph.some((datedPrice) => datedPrice.price > 9);

  // If the price wasn't changed today, duplicate the most recent price point
  // This highlights the last checked price should still be valid
  if (!wasUpdatedToday) {
    const duplicatedDatedPrice: DatedPrice = {
      date: todayString,
      price: ph[ph.length - 1].price,
    };
    ph.push(duplicatedDatedPrice);
  }

  // Set line colour to green, red or gray depending on price trend
  let trendColour = "";
  const priceDiff = getPriceAvgDifference(ph);

  // If price difference from the average price is +/- 3%, print black border
  if (Math.abs(priceDiff) <= 2) {
    trendColour += isDark ? "rgb(180, 180, 180)" : "rgb(120, 120, 120)";
  }
  // If price diff is +10%, print bold red border
  else if (priceDiff > 10) {
    trendColour += isDark ? "rgb(255, 80, 80)" : "rgb(230, 0, 0)";
  }
  // If price diff is +2-10%, print mild red border
  else if (priceDiff > 2) {
    trendColour += isDark ? "rgb(255, 100, 100)" : "rgb(190, 30, 30)";
  }
  // If price diff is +10%, print bold green border
  else if (priceDiff < -10) {
    trendColour += isDark ? "rgb(80, 255, 80)" : "rgb(0, 200, 0)";
  }
  // If price diff is +2-10%, print mild green border
  else if (priceDiff < -2) {
    trendColour += isDark ? "rgb(100, 255, 100)" : "rgb(30, 170, 30)";
  }

  // Use smaller point radius for denser charts
  let relativePointRadius = 1;
  if (ph.length > 10 && !useLargeVersion) relativePointRadius = 0;

  // Prepare chart data for chart.js line chart
  const chartData: ChartData<"line"> = {
    labels: ph.map((datedPrice) => datedPrice.date),
    datasets: [
      {
        data: ph.map((datedPrice) => datedPrice.price),
        borderColor: trendColour,
        pointBorderColor: trendColour,
        pointBackgroundColor: "white",
        pointRadius: relativePointRadius,
        pointHoverRadius: 6,
        pointHitRadius: 30,
        pointBorderWidth: 3,
        borderWidth: useLargeVersion ? 3 : 2.5,
        tension: 0.5,
        stepped: useSteppedLine ? "before" : false, // Toggle the stepped line graph
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          // Tooltip title - set to blank to override default title
          title: () => {
            return "";
          },

          label: function (context: import("chart.js").TooltipItem<"line">) {
            // Tooltip body - show the date and price
            const date = new Date();
            date.setTime(context.parsed.x as number);
            return (
              date.toLocaleDateString("en-NZ", {
                day: "numeric",
                month: "short",
                year: "2-digit",
              }) +
              "       " +
              printPrice(context.parsed.y!)
            );
          },
        },
        backgroundColor: isDark ? "rgb(30, 30, 30)" : "white",
        titleColor: isDark ? "rgb(230, 230, 230)" : "black",
        titleFont: { weight: "normal" },
        bodyColor: isDark ? "rgb(230, 230, 230)" : "black",
        footerColor: isDark ? "rgb(230, 230, 230)" : "black",
        borderColor: trendColour,
        borderWidth: 1,
        padding: 10,
        cornerRadius: 14,
        displayColors: false,
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: useLargeVersion ? "quarter" : "month",
          displayFormats: {
            month: "MMM",
            quarter: "MMMM yyyy",
          },
        },
        min: useLargeVersion ? "" : fiveMonthsAgo.getTime(),
        ticks: {
          color: isDark ? "rgb(180, 180, 180)" : "rgb(80, 80, 80)",
        },
        grid: {
          color: isDark ? "rgba(180, 180, 180, 0.1)" : "rgba(0, 0, 0, 0.1)",
        },
      },
      y: {
        ticks: {
          callback(tickValue) {
            return (
              "$" +
              (tickValue as number).toFixed(displayWithoutDecimals ? 0 : 2)
            );
          },
          color: isDark ? "rgb(180, 180, 180)" : "rgb(80, 80, 80)",
        },
        suggestedMin: Math.floor(minPrice),
        suggestedMax: Math.ceil(maxPrice),
        grid: {
          color: isDark ? "rgba(180, 180, 180, 0.1)" : "rgba(0, 0, 0, 0.1)",
        },
      },
    },
  };

  if (!mounted) return <div className="h-full w-full bg-transparent" />;

  return (
    <Line
      ref={chartRef}
      data={chartData}
      options={options}
      className="z-40"
      id={`chart-${product.id}`}
    />
  );
}

export default PriceChart;
