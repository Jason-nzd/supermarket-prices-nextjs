import React from "react";
import { DatedPrice } from "../../typings";
import { priceTrend, PriceTrend, printPrice } from "../../utilities/utilities";
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

interface Props {
  priceHistory: DatedPrice[];
  lastChecked: Date;
  useLargeVersion: boolean;
  useSteppedLine?: boolean;
}

function PriceHistoryChart({
  priceHistory,
  useLargeVersion = false,
  useSteppedLine = true,
}: Props) {
  // Initialize chart.js line chart
  Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    TimeScale,
    Tooltip
  );

  // Check if the price was updated today or not
  const lastDatedPrice = priceHistory[priceHistory.length - 1];
  const lastCheckedDateString = new Date(lastDatedPrice.date).toDateString();
  const todayString = new Date().toDateString();
  const wasUpdatedToday = lastCheckedDateString == todayString;

  // Limit small charts to five months ago for readability
  const fiveMonthsAgo = new Date(
    new Date().getTime() - 5 * 30 * 24 * 60 * 60 * 1000
  );

  // If any of prices are too high to warrant decimals, don't show decimals
  const displayWithoutDecimals = priceHistory.some(
    (datedPrice) => datedPrice.price > 9
  );

  // If the price wasn't changed today, duplicate the most recent price point
  // This highlights the last checked price should still be valid today
  if (!wasUpdatedToday) {
    let duplicatedDatedPrice: DatedPrice = {
      date: new Date(),
      price: priceHistory[priceHistory.length - 1].price,
    };
    priceHistory.push(duplicatedDatedPrice);
  }

  // Set line colour to green or red depending on price trend
  let trendColour = "";
  switch (priceTrend(priceHistory)) {
    case PriceTrend.Decreased:
      trendColour = "rgb(0, 255, 0)";
      break;
    case PriceTrend.Increased:
      trendColour = "rgb(255, 0, 0)";
      break;
    case PriceTrend.Same:
    default:
      trendColour = "rgb(120, 120, 120)";
      break;
  }

  // Use smaller point radius for denser charts
  let relativePointRadius = 1;
  if (priceHistory.length > 10 && !useLargeVersion) relativePointRadius = 0;

  // Prepare chart data for chart.js line chart
  const chartData: ChartData<"line"> = {
    labels: priceHistory.map((datedPrice) => datedPrice.date),
    datasets: [
      {
        data: priceHistory.map((datedPrice) => datedPrice.price),
        borderColor: trendColour,
        pointBorderColor: trendColour,
        pointBackgroundColor: "white",
        pointRadius: relativePointRadius,
        pointHoverRadius: 6,
        pointHitRadius: 30,
        pointBorderWidth: 3,
        borderWidth: useLargeVersion ? 3 : 2,
        tension: 0.5,
        stepped: useSteppedLine ? "before" : false, // Toggle the stepped line graph
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    resizeDelay: 200,
    plugins: {
      tooltip: {
        callbacks: {
          // Tooltip title - set to blank to override default title
          title: () => {
            return "";
          },

          label: function (context: any) {
            // Tooltip body - show the date and price
            const date = new Date();
            date.setTime(context.parsed.x);
            return (
              date.toLocaleDateString("en-NZ", {
                day: "numeric",
                month: "short",
                year: "2-digit",
              }) +
              "       " +
              printPrice(context.parsed.y)
            );
          },
        },
        backgroundColor: "white",
        titleColor: "black",
        titleFont: { weight: "normal" },
        bodyColor: "black",
        footerColor: "black",
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
      },
      y: {
        ticks: {
          callback(tickValue) {
            return (
              "$" +
              (tickValue as number).toFixed(displayWithoutDecimals ? 0 : 2)
            );
          },
        },
      },
    },
  };

  return <Line data={chartData} options={options} className="z-40" />;
}

export default PriceHistoryChart;
