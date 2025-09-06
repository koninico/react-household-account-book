import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import jaLocale from "@fullcalendar/core/locales/ja"; // 日本語ロケールをインポート
import type { DatesSetArg, EventContentArg } from "@fullcalendar/core/index.js";
import type { DateClickArg } from "@fullcalendar/interaction";
import "../calendar.css";
import { calculateDailyBalance } from "../utils/financeCalculations";
import type { Balance, CalendarContent, Transaction } from "../types";
import { formatCurrency } from "../utils/formatting";
import interactionPlugin from "@fullcalendar/interaction";
import { theme } from "../theme/theme";
import { useTheme } from "@mui/material";
import { isSameMonth } from "date-fns";

//propsの型定義
interface CalendarProps {
  monthlyTransactions: Transaction[];
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  setCurrentDay: React.Dispatch<React.SetStateAction<string>>;
  currentDay: string; //追加
  today: string; //追加
  onDateClick: (dateInfo: DateClickArg) => void; //追加
}

const Calendar = ({
  monthlyTransactions,
  setCurrentMonth,
  setCurrentDay,
  currentDay,
  today,
  onDateClick,
}: CalendarProps) => {
  const theme = useTheme(); //MUIのテーマを取得

  const events = [
    { title: "Meeting", start: "2025-08-25" }, //titleやstartはFullCalendarの仕様
    {
      title: "afdafe",
      start: "2025-08-26",
      income: 300,
      expense: 200,
      balance: 100,
    },
    { start: "2025-08-27", display: "background", backgroundColor: "red" },
  ];

  const backgroundEvents = {
    start: currentDay,
    display: "background",
    backgroundColor: theme.palette.incomeColor.light,
  };

  const dailyBalances = calculateDailyBalance(monthlyTransactions);
  // console.log(dailyBalances);

  //1.日付ごとの収支を計算するための関数
  // const dailyBalances =
  // {
  //   "2025-08-25": { income: 0, expense: 0, balance: 0 },
  //   "2025-08-26": { income: 0, expense: 0, balance: 0 },
  // };

  //2.fullCalendar用のイベントを生成する関数
  const createCalendarEvents = (
    dailyBalances: Record<string, Balance>
  ): CalendarContent[] => {
    return Object.keys(dailyBalances).map((date) => {
      const { income, expense, balance } = dailyBalances[date]; //income, expense, balanceを取得
      return {
        start: date, //dateはstring型
        income: formatCurrency(income), //string型に変換
        expense: formatCurrency(expense),
        balance: formatCurrency(balance),
      };
    });
  };

  const calendarEvents = createCalendarEvents(dailyBalances);
  // console.log(calendarEvents);

  console.log([...calendarEvents, backgroundEvents]);

  // イベントの内容をカスタマイズする関数
  const renderEventContent = (eventInfo: EventContentArg) => {
    //イベントの中身を作る
    console.log(eventInfo);
    return (
      <div>
        <div className="money" id="event-income">
          {eventInfo.event.extendedProps.income}
        </div>

        <div className="money" id="event-expense">
          {eventInfo.event.extendedProps.expense}
        </div>

        <div className="money" id="event-balance">
          {eventInfo.event.extendedProps.balance}
        </div>
      </div>
    );
  };

  //月が変わったときに呼ばれる関数
  const handleDateSet = (datesetInfo: DatesSetArg) => {
    const currentMonth = datesetInfo.view.currentStart;
    // console.log(datesetInfo);
    setCurrentMonth(currentMonth); //startは選択された期間の開始日
    const todayDate = new Date(); //string型なので注意、todayをhomeから渡す
    if (isSameMonth(todayDate, currentMonth)) {
      setCurrentDay(today);
    } //todayDateの月とcurrentMonthの月が同じかどうかを判定
  };

  return (
    <FullCalendar
      locale={jaLocale} // 日本語ロケールを設定
      plugins={[dayGridPlugin, interactionPlugin]} //グリッド表示のプラグインを追加
      initialView="dayGridMonth" //初期表示を月表示に設定
      events={[...calendarEvents, backgroundEvents]} //イベントを設定
      eventContent={renderEventContent}
      datesSet={handleDateSet} //選択された日付範囲が変更されたときに呼び出される関数
      dateClick={onDateClick}
    />
  );
};

export default Calendar;
