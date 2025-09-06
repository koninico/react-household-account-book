import { Box, Paper } from "@mui/material";
import React from "react";
import BarChart from "../components/BarChart";
import MonthSelector from "../components/MonthSelector";
import CategoryChart from "../components/CategoryChart";
import TransactionTable from "../components/TransactionTable";
import type { Transaction } from "../types";

interface ReportProps {
  currentMonth: Date;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  monthlyTransactions: Transaction[];
  isLoading: boolean;
  onDeleteTransaction: (transactionId: string | readonly string[]) => Promise<void>;
}

const Report = ({
  currentMonth,
  setCurrentMonth,
  monthlyTransactions,
  isLoading,
  onDeleteTransaction,
}: ReportProps) => {
  const commonPaperStyle = {
    height: "400px",
    display: "flex",
    flexDirection: "column",
    p: 2, //padding
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box
        sx={{
          width: "100%", // xs={12} に相当 - 小画面で全幅
        }}
      >
        {/* 日付選択エリア */}
        <MonthSelector
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
        />
      </Box>
      {/* 横並びのコンテナ */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row", // デフォルトは横並び
          width: "100%", // xs={12} に相当 - 小画面で全幅
          gap: 2,
          "@media (max-width: 900px)": {
            flexDirection: "column", // 900px以下では縦並び
          },
        }}
      >
        {/* 円グラフ */}
        <Box
          sx={{
            flex: 1, // 横幅を均等にする
            width: "100%", // xs={12} に相当 - 小画面で全幅
          }}
        >
          <Paper sx={commonPaperStyle}>
            <CategoryChart
              monthlyTransactions={monthlyTransactions}
              isLoading={isLoading}
            />
          </Paper>
        </Box>

        {/* 棒グラフ */}
        <Box
          sx={{
            flex: 2, // 横幅をカテゴリグラフの2倍にする
            width: "100%", // xs={12} に相当 - 小画面で全幅
          }}
        >
          <Paper sx={commonPaperStyle}>
            <BarChart
              monthlyTransactions={monthlyTransactions}
              isLoading={isLoading}
            />
          </Paper>
        </Box>
      </Box>

      {/* 取引一覧テーブル */}
      <Box
        sx={{
          width: "100%", // xs={12} に相当 - 小画面で全幅
        }}
      >
        <TransactionTable
          monthlyTransactions={monthlyTransactions}
          onDeleteTransaction={onDeleteTransaction}
        />
      </Box>
    </Box>
  );
};

export default Report;
