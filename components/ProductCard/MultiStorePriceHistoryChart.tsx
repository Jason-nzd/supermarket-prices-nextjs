import React from "react";
import { Product } from "../../typings";
import { cleanDate } from "../../utilities/utilities";
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
import { useContext } from "react";
import { DarkModeContext } from "../../pages/_app";

interface Props {
  countdownProduct?: Product | null;
  paknsaveProduct?: Product | null;
  warehouseProduct?: Product | null;
  newworldProduct?: Product | null;
}

function MultiStorePriceHistoryChart({
  countdownProduct,
  paknsaveProduct,
  warehouseProduct,
  newworldProduct,
}: Props) {
  const theme = useContext(DarkModeContext).darkMode ? "dark" : "light";
  const isDark = theme === "dark";
  // Initialize chart.js line chart
  Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    TimeScale,
    Tooltip
  );

  // Dates array will share dates from all stores on the X axis
  const sharedDates: Date[] = [];

  // 1st pass - loop through all store price histories to determine shared date array
  [
    countdownProduct,
    paknsaveProduct,
    warehouseProduct,
    newworldProduct,
  ]!.forEach((product) => {
    product?.priceHistory.forEach((datedPrice) => {
      // Clean any hours, seconds from store dates (converts '2023-06-18T23:46:27.222Z' to '2023-06-18')
      const cleanedStoreDate = cleanDate(datedPrice.date);

      // Check if store date has already been pushed into the shared date array
      // Use string comparison for better reliability
      const dateAlreadyExists = sharedDates.find((sharedDate) => {
        return sharedDate.toString() == cleanedStoreDate.toString();
      });

      // If store date has not yet been pushed into the shared date array, push it
      if (!dateAlreadyExists) {
        sharedDates.push(cleanedStoreDate);
      }
    });
  });

  // Each store will have it's own Y axis dataset, which is initialized to all zeroes
  const priceDataCountdown = new Array(sharedDates.length).fill(NaN);
  const priceDataPaknsave = new Array(sharedDates.length).fill(NaN);
  const priceDataWarehouse = new Array(sharedDates.length).fill(NaN);
  const priceDataNewworld = new Array(sharedDates.length).fill(NaN);

  // Debug
  // if (countdownProduct) {
  //   console.log(
  //     'DEBUG: Countdown 1st date: ' +
  //       utcDateToLongDate(countdownProduct?.priceHistory[0].date) +
  //       ' last date: ' +
  //       utcDateToLongDate(
  //         countdownProduct?.priceHistory[countdownProduct?.priceHistory.length - 1].date
  //       ) +
  //       ' - total prices: ' +
  //       countdownProduct?.priceHistory.length
  //   );
  // }

  // Sort dates
  sharedDates.sort((a, b) => {
    return Number(a) - Number(b);
  });

  // 2nd pass - loop through countdown price history and populate full length dataset
  countdownProduct?.priceHistory.forEach((datedPrice) => {
    const cleanedDate = cleanDate(datedPrice.date);
    // console.log(
    //   'CD [' +
    //     index +
    //     '] - ' +
    //     utcDateToShortDate(cleanedDate) +
    //     ' = Shared [' +
    //     sharedDates.findIndex((sharedDate) => {
    //       return sharedDate.toString() == cleanedDate.toString();
    //     }) +
    //     ']'
    // );

    const matchedStoreToSharedIndex = sharedDates.findIndex((sharedDate) => {
      return sharedDate.toString() == cleanedDate.toString();
    });

    if (matchedStoreToSharedIndex >= 0) {
      priceDataCountdown[matchedStoreToSharedIndex] = datedPrice.price;
    }
  });

  // 2nd pass - loop through paknsave price history and populate full length dataset
  paknsaveProduct?.priceHistory.forEach((datedPrice) => {
    const cleanedDate = cleanDate(datedPrice.date);

    const matchedStoreToSharedIndex = sharedDates.findIndex((sharedDate) => {
      return sharedDate.toString() == cleanedDate.toString();
    });

    if (matchedStoreToSharedIndex >= 0) {
      priceDataPaknsave[matchedStoreToSharedIndex] = datedPrice.price;
    }
  });

  // 2nd pass - loop through warehouse price history and populate full length dataset
  warehouseProduct?.priceHistory.forEach((datedPrice) => {
    const cleanedDate = cleanDate(datedPrice.date);

    const matchedStoreToSharedIndex = sharedDates.findIndex((sharedDate) => {
      return sharedDate.toString() == cleanedDate.toString();
    });

    if (matchedStoreToSharedIndex >= 0) {
      priceDataWarehouse[matchedStoreToSharedIndex] = datedPrice.price;
    }
  });

  // 2nd pass - loop through newworld price history and populate full length dataset
  newworldProduct?.priceHistory.forEach((datedPrice) => {
    const cleanedDate = cleanDate(datedPrice.date);

    const matchedStoreToSharedIndex = sharedDates.findIndex((sharedDate) => {
      return sharedDate.toString() == cleanedDate.toString();
    });

    if (matchedStoreToSharedIndex >= 0) {
      priceDataNewworld[matchedStoreToSharedIndex] = datedPrice.price;
    }
  });

  // Prepare chart data for chart.js line chart
  const chartData: ChartData<"line"> = {
    labels: sharedDates.map((date) => date),
    datasets: [
      {
        label: "Countdown",
        data: priceDataCountdown,
        borderColor: isDark ? "rgb(80, 255, 120)" : "green",
        pointBorderColor: isDark ? "rgb(80, 255, 120)" : "green",
        pointBackgroundColor: isDark ? "rgb(30, 30, 30)" : "white",
        pointHoverRadius: 6,
        pointHitRadius: 30,
        pointBorderWidth: 3,
        borderWidth: 3,
        tension: 0.2,
        stepped: "before",
        spanGaps: true,
      },

      {
        label: "PaknSave",
        data: priceDataPaknsave,
        borderColor: isDark ? "rgb(255, 255, 100)" : "yellow",
        pointBorderColor: isDark ? "rgb(255, 255, 100)" : "yellow",
        pointBackgroundColor: isDark ? "rgb(30, 30, 30)" : "white",
        pointHoverRadius: 6,
        pointHitRadius: 30,
        pointBorderWidth: 3,
        borderWidth: 3,
        tension: 0.2,
        stepped: "before",
        spanGaps: true,
      },
      {
        label: "The Warehouse",
        data: priceDataWarehouse,
        borderColor: isDark ? "rgb(255, 100, 100)" : "red",
        pointBorderColor: isDark ? "rgb(255, 100, 100)" : "red",
        pointBackgroundColor: isDark ? "rgb(30, 30, 30)" : "white",
        pointHoverRadius: 6,
        pointHitRadius: 30,
        pointBorderWidth: 3,
        borderWidth: 3,
        tension: 0.2,
        stepped: "before",
        spanGaps: true,
      },
      {
        label: "New World",
        data: priceDataNewworld,
        borderColor: isDark ? "rgb(255, 180, 100)" : "orange",
        pointBorderColor: isDark ? "rgb(255, 180, 100)" : "red",
        pointBackgroundColor: isDark ? "rgb(30, 30, 30)" : "white",
        pointHoverRadius: 6,
        pointHitRadius: 30,
        pointBorderWidth: 3,
        borderWidth: 3,
        tension: 0.2,
        stepped: "before",
        spanGaps: true,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    resizeDelay: 200,
    plugins: {
      tooltip: {
        // callbacks: {
        //   title: () => {
        //     return '';
        //   },
        //   label: function (context: any) {
        //     return ' ' + printPrice(context.parsed.y);
        //   },
        // },
        backgroundColor: isDark ? "rgb(30, 30, 30)" : "white",
        titleColor: isDark ? "rgb(230, 230, 230)" : "black",
        titleFont: { weight: "normal" },
        bodyColor: isDark ? "rgb(230, 230, 230)" : "black",
        footerColor: isDark ? "rgb(230, 230, 230)" : "black",
        // borderColor: trendColour,
        borderWidth: 1,
        padding: 10,
        cornerRadius: 14,
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "quarter",
          displayFormats: {
            quarter: "MMMM yyyy",
          },
        },
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
            return "$" + (tickValue as number).toFixed(2);
          },
          color: isDark ? "rgb(180, 180, 180)" : "rgb(80, 80, 80)",
        },
        grid: {
          color: isDark ? "rgba(180, 180, 180, 0.1)" : "rgba(0, 0, 0, 0.1)",
        },
      },
    },
  };

  return <Line data={chartData} options={options} className="z-40" />;
}

export default MultiStorePriceHistoryChart;
