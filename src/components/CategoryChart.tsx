import React, { useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartData,
} from "chart.js";
import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";
import {
  type ExpenseCategory,
  type IncomeCategory,
  type Transaction,
  type TransactionType,
} from "../types";
import { useTheme } from "@mui/material";

ChartJS.register(ArcElement, Tooltip, Legend);

interface CategoryChartProps {
  monthlyTransactions: Transaction[];
  isLoading: boolean;
}

const CategoryChart = ({
  monthlyTransactions,
  isLoading,
}: CategoryChartProps) => {
  const theme = useTheme();
  const [selectedType, setSelectedType] = useState<TransactionType>("expense");

  const handleChange = (e: SelectChangeEvent<TransactionType>) => {
    //テキストコンポーネントがinputやtextareaのときに対応するための型指定
    setSelectedType(e.target.value as TransactionType);
    //e.target.valueがstring型であるため、TransactionTypeで処理
  };

  //フィルタリングされた取引データからカテゴリごとの合計金額を計算
  const categorySums = monthlyTransactions
    .filter((transaction) => transaction.type === selectedType)
    .reduce<Record<IncomeCategory | ExpenseCategory, number>>(
      (acc, transaction) => {
        //accは累積値、transactionは現在の要素,accに型を指定
        if (!acc[transaction.category]) {
          acc[transaction.category] = 0; //初期化処理
        }
        acc[transaction.category] += transaction.amount;
        // acc[transaction.category] += transaction.amount;だと初期値がundefinedになる可能性があるため、上記のように修正
        return acc; //accを返すことで次の処理に渡す
      },
      {} as Record<IncomeCategory | ExpenseCategory, number>
    ); //初期値は空のオブジェクト、accの型をキーが文字列、値が数値の形
  //例　{"食費": 1000, "交通費": 500}

  const categoryLabels = Object.keys(categorySums) as (
    | IncomeCategory
    | ExpenseCategory
  )[];
  const categoryValues = Object.values(categorySums);
  console.log(categorySums);
  console.log(categoryLabels);
  console.log(categoryValues);

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {},
  };

  //収入用カテゴリーの色
  const incomeCategoryColor: Record<IncomeCategory, string> = {
    給与: theme.palette.incomeCategoryColor.給与,
    副収入: theme.palette.incomeCategoryColor.副収入,
    お小遣い: theme.palette.incomeCategoryColor.お小遣い,
  };

  //支出用カテゴリーの色
  const expenseCategoryColor: Record<ExpenseCategory, string> = {
    食費: theme.palette.expenseCategoryColor.食費,
    日用品: theme.palette.expenseCategoryColor.日用品,
    住居費: theme.palette.expenseCategoryColor.住居費,
    交際費: theme.palette.expenseCategoryColor.交際費,
    娯楽: theme.palette.expenseCategoryColor.娯楽,
    交通費: theme.palette.expenseCategoryColor.交通費,
  };

  const getCategoryColor = (
    category: IncomeCategory | ExpenseCategory
  ): string => {
    if (selectedType === "income") {
      return incomeCategoryColor[category as IncomeCategory]; //型アサーションを使ってIncomeCategory型であることを明示
    } else {
      return expenseCategoryColor[category as ExpenseCategory]; //型アサーションを使ってExpenseCategory型であることを明示
    }
  };

  const data: ChartData<"pie"> = {
    //円グラフとして適切かを検証する
    labels: categoryLabels,
    datasets: [
      {
        data: categoryValues,

        // backgroundColor: 
        // カテゴリーごとの色を取得する関数,categoryLabelsには選択後のカテゴリー名が入っている
        backgroundColor: categoryLabels.map((category) => 
          getCategoryColor(category)
          //categoryLabelsは本来incomeCategoryColorまたはexpenseCategoryColor型であるべきなのにstring型が割り当てされてしまっている。
          //categoryLabelsには型アサーションを使うと、categoryもIncomeCategoryまたはExpenseCategory型になると明示できるが、ここでは割愛
        ),
        borderColor: categoryLabels.map((category) => 
          getCategoryColor(category)
        ),
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <FormControl fullWidth>
        <InputLabel id="type-select-label">収支の種類</InputLabel>
        <Select
          labelId="type-select-label"
          id="type-select"
          value={selectedType}
          label="収支の種類"
          onChange={handleChange}
        >
          <MenuItem value={"income"}>収入</MenuItem>
          <MenuItem value={"expense"}>支出</MenuItem>
        </Select>
      </FormControl>
      <Box
        sx={{
          flexGrow: 1,
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          height: "100%",
          width: "100%",
        }}
      >
        {isLoading ? (
          <CircularProgress />
        ) : monthlyTransactions.length > 0 ? (
          <Pie data={data} options={options} />
        ) : (
          <Typography>データがありません</Typography>
        )}
      </Box>
    </>
  );
};

export default CategoryChart;
