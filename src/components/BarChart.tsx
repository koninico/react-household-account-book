import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import type { Transaction } from "../types";
import { calculateDailyBalance } from "../utils/financeCalculations";
import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import { is } from "zod/v4/locales";

ChartJS.register(
  //importしたものから必要なものを登録
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  monthlyTransactions: Transaction[];
  isLoading: boolean;
}

const BarChart = ({ monthlyTransactions, isLoading }: BarChartProps) => {
  const theme = useTheme();

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      // legend: {
      //   position: "top" as const,//支出と収入の凡例の位置,デフォルトではtopなのでコメントアウト
      // },
      title: {
        display: true,
        text: "日別収支", //グラフのタイトル
      },
    },
  };

  const dailyBalances = calculateDailyBalance(monthlyTransactions);
  console.log(dailyBalances);
  console.log(monthlyTransactions);

  //日付ラベルの配列
  const dateLabels = Object.keys(dailyBalances).sort(); //日付順にソート
  console.log(dateLabels);
  //日付ラベルに対応する収入と支出のデータ配列
  const expenseData = dateLabels.map((day) => dailyBalances[day].expense);
  const incomeData = dateLabels.map((day) => dailyBalances[day].income);

  const data: ChartData<"bar"> = {
    labels: dateLabels,
    datasets: [
      {
        label: "支出",
        data: incomeData, //日付に対応する収入データ
        backgroundColor: theme.palette.expenseColor.light,
      },
      {
        label: "収入",
        data: expenseData, //日付に対応する支出データ
        backgroundColor: theme.palette.incomeColor.light,
      },
    ],
  };
  return (
    <Box
      sx={{
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
      }}
    >
      {isLoading ? (
        <CircularProgress />
      ) : monthlyTransactions.length > 0 ? (
        <Bar options={options} data={data} />
      ) : (
        <Typography>データがありません</Typography>
      )}
    </Box>
  );
};

export default BarChart;
