import { Box, Button } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { addMonths } from "date-fns";
import dayjs from "dayjs";
import "dayjs/locale/ja";

// dayjsのグローバルロケールを日本語に設定
dayjs.locale("ja");

interface MonthSelectorProps {
  currentMonth: Date;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
}

const MonthSelector = ({
  currentMonth,
  setCurrentMonth,
}: MonthSelectorProps) => {
  //日付が変更されたときの処理
  const handleDateChange = (newDate: Date | null) => {
    //何も選択されていない時はnullが入る
    console.log(newDate);
    if (newDate) {
      setCurrentMonth(newDate);
    }
  };

  //先月ボタンを押したときの処理
  const handlePreviousMonth = () => {
    const previousMonth = addMonths(currentMonth, -1);
    console.log("前の月:", previousMonth);
    setCurrentMonth(previousMonth); //親コンポーネントの状態を更新
  };

  //次月ボタンを押したときの処理
  const handleNextMonth = () => {
    const nextMonth = addMonths(currentMonth, 1);
    console.log("次の月:", nextMonth);
    setCurrentMonth(nextMonth); //親コンポーネントの状態を更新
  };

  return (
    //LocalizationProviderでラップ、日付ピッカーのコンテキストを提供
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ja">
      {/* 横並びにして中央寄せ */}
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Button
          onClick={handlePreviousMonth}
          color={"error"}
          variant="contained"
        >
          先月
        </Button>
        {/* mxは左右のマージン、年と月のみ表示して、年月の順序で表示する */}
        <DatePicker
          onChange={handleDateChange}
          value={dayjs(currentMonth)} //リロード時に今月を表示
          label="年月を選択"
          sx={{ mx: 2, background: "white" }}
          views={["year", "month"]}
          format="YYYY/MM"
          slotProps={{
            calendarHeader: { format: "YYYY年 MM月" },
            toolbar: {
              toolbarFormat: "YYYY年 MM月",
            },
          }}
        />

        <Button onClick={handleNextMonth} color={"primary"} variant="contained">
          次月
        </Button>
      </Box>
    </LocalizationProvider>
  );
};

export default MonthSelector;
