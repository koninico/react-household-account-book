import { type IncomeCategory, type ExpenseCategory } from './../types/index';
import { createTheme, type PaletteColor, type PaletteColorOptions } from "@mui/material";
import { amber, blue, cyan, green, lightBlue, lightGreen, lime, red } from "@mui/material/colors";

// Material-UIのパレット型を拡張
declare module "@mui/material/styles" {
  interface Palette {//型定義の拡張
    incomeColor: PaletteColor;
    expenseColor: PaletteColor;
    balanceColor: PaletteColor;
    incomeCategoryColor: Record<IncomeCategory, string>;//収入カテゴリごとの色
    expenseCategoryColor: Record<ExpenseCategory, string>;//支出カテゴリごとの色
  }
  
  interface PaletteOptions {//プロパティは必須ではない
    incomeColor?: PaletteColorOptions;//オプショナル?をつけると、指定しなくてもよくなる
    expenseColor?: PaletteColorOptions;
    balanceColor?: PaletteColorOptions;
    incomeCategoryColor?: Record<IncomeCategory, string>;//収入カテゴリごとの色
    expenseCategoryColor?: Record<ExpenseCategory, string>;//支出カテゴリごとの色
  }
}

export const theme = createTheme({
  //MUIが提供しているテーマ
  typography: {
    fontFamily: "Noto Sans JP, Roboto, 'Helvetica Neue', Arial, sans-serif",
    //左から右へ読み進める言語向けのフォントファミリー
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },

  palette: {
    //収入の色を追加
    incomeColor: {
      main: blue[500],
      light: blue[100],
      dark: blue[700],
    },

    //支出の色を追加
    expenseColor: {
      main: red[500],
      light: red[100],
      dark: red[700],
    },

    //残高の色を追加
    balanceColor: {
      main: green[500],
      light: green[100],
      dark: green[700],
    },

    //収入用
    incomeCategoryColor :{
      給与: lightBlue[600],
      副収入: cyan[200],
      お小遣い: lightGreen["A700"],
    },

    //支出用
    expenseCategoryColor: {
      食費: lightBlue[600],
      日用品: cyan[200],
      住居費: lightGreen["A700"],
      交際費: lime[600],
      娯楽: amber[200],
      交通費: red[600],
    },

  },
});
