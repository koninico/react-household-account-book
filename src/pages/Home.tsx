import { Box, useMediaQuery, useTheme } from "@mui/material";
import MonthlySummary from "../components/MonthlySummary";
import Calendar from "../components/Calendar";
import TransactionMenu from "../components/TransactionMenu";
import TransactionForm from "../components/TransactionForm";
import type { Transaction } from "../types";
import { useState } from "react";
import { format } from "date-fns";
import type { Schema } from "../validations/schema";
import type { DateClickArg } from "@fullcalendar/interaction/index.js";

interface HomeProps {
  //型を定義する
  monthlyTransactions: Transaction[];
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  onSaveTransaction: (transaction: Schema) => Promise<void>;
  onDeleteTransaction: (
    transactionId: string | readonly string[]
  ) => Promise<void>;
  onUpdateTransaction: (
    transaction: Schema,
    transactionId: string
  ) => Promise<void>;
}

const Home = ({
  monthlyTransactions,
  setCurrentMonth,
  onSaveTransaction,
  onDeleteTransaction,
  onUpdateTransaction,
}: HomeProps) => {
  const today = format(new Date(), "yyyy-MM-dd");
  console.log(today);
  const [currentDay, setCurrentDay] = useState(today);
  const [isEntryDrawerOpen, setIsEntryDrawerOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  //選択された取引データを管理するためのuseStateフック
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null); //nullで初期化

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  //1200px以下でtrue,以上でfalse
  console.log(isMobile);

  //月間データから１日分の選択データを抽出する
  const dailyTransactions = monthlyTransactions.filter((transaction) => {
    return (transaction.date as unknown as string) === currentDay;
  });
  console.log(dailyTransactions);

  // フォームを閉じる処理
  const closeForm = () => {
    setSelectedTransaction(null); //選択された取引データをリセット
    if (isMobile) {
      setIsDialogOpen(!isDialogOpen); //閉じる時にはisDialogOpenはtrueになっているので、反転させる
    } else {
      //PC用
      setIsEntryDrawerOpen(!isEntryDrawerOpen); //trueの場合falseに、falseの場合trueにする
    }
  };

  //フォームの開閉処理(内訳追加ボタンを押したとき)
  const handleAddTransactionForm = () => {
    if (isMobile) {
      setIsDialogOpen(true);
    } else {
      if (selectedTransaction) {
        setSelectedTransaction(null);
      } else {
        setIsEntryDrawerOpen(!isEntryDrawerOpen);
      }
    }
  };

  // 取引が選択されたときの処理
  const handleSelectTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    if (isMobile) {
      setIsDialogOpen(true);
    }else {    
      setIsEntryDrawerOpen(true); //何度押しても閉まらずずっと開きたいのでtrueにする
    }
  };

  //カレンダーの日付がクリックされたときに呼ばれる関数
  const handleDateClick = (dateInfo: DateClickArg) => {
    console.log(dateInfo);
    setCurrentDay(dateInfo.dateStr); //クリックされた日付を文字列で取得
    setIsMobileDrawerOpen(true); //モバイル用のドロワーを開く
  };

  //モバイル用のドロワーを閉じる処理
  const handleCloseMobileDrawer = () => {
    setIsMobileDrawerOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* 左側コンテンツ */}
      <Box sx={{ flexGrow: 1 }}>
        {/* flexGrowは1で、残りのスペースを占有、狭めて右コンテンツが消えたら左をmax幅で表示するため */}
        <MonthlySummary monthlyTransactions={monthlyTransactions} />
        <Calendar
          monthlyTransactions={monthlyTransactions}
          setCurrentMonth={setCurrentMonth}
          setCurrentDay={setCurrentDay}
          currentDay={currentDay} //currentDayをCalendarに渡す
          today={today}
          onDateClick={handleDateClick}
        />
      </Box>

      {/* 右側コンテンツ */}
      <Box>
        <TransactionMenu
          dailyTransactions={dailyTransactions}
          currentDay={currentDay}
          onAddTransactionForm={handleAddTransactionForm}
          onSelectTransaction={handleSelectTransaction}
          isMobile={isMobile}
          open={isMobileDrawerOpen}
          onClose={handleCloseMobileDrawer}
        />
        <TransactionForm
          onCloseForm={closeForm}
          isEntryDrawerOpen={isEntryDrawerOpen}
          currentDay={currentDay}
          onSaveTransaction={onSaveTransaction}
          selectedTransaction={selectedTransaction}
          onDeleteTransaction={onDeleteTransaction}
          setSelectedTransaction={setSelectedTransaction}
          onUpdateTransaction={onUpdateTransaction}
          isMobile={isMobile}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        />
      </Box>
    </Box>
  );
};

export default Home;
