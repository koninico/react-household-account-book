import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Report from "./pages/Report";
import NoMatch from "./pages/NoMatch";
import AppLayout from "./components/layout/AppLayout";
import { theme } from "./theme/theme";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import type { Transaction } from "./types/index";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { format } from "date-fns";
import { formatMonth } from "./utils/formatting";
import type { Schema } from "./validations/schema";
import { is } from "zod/v4/locales";

function App() {
  //transactionの状態を管理するためのuseStateフック
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  //1ヶ月分の取引を管理するためのuseStateフック
  const [currentMonth, setCurrentMonth] = useState(new Date());
  // console.log(currentMonth);

  //日付をformatする
  // const a = format(currentMonth, "yyyy-MM");
  // console.log(a);

  //ローディング状態を管理するためのuseStateフック
  const [isLoading, setIsLoading] = useState(true); //trueでローディング中

  //受け取ったerrがFirestoreのエラーオブジェクトかどうかを判定する型ガード関数
  function isFireStoreError(
    //errをunknown型にすることで、どんな型でも受け取れるようにする
    err: unknown

    //isは型ガード関数の戻り値の型を示す
  ): err is { code: string; message: string } {
    //errがオブジェクトであり、nullでなく、codeプロパティを持っているかどうかをチェック
    return typeof err === "object" && err !== null && "code" in err;
  }

  //Firestoreからデータを取得する処理
  useEffect(() => {
    const fetchTransactions = async () => {
      // データの取得や初期化処理をここに記述
      try {
        const querySnapshot = await getDocs(collection(db, "Transactions"));
        const transactionsData = querySnapshot.docs.map((doc) => {
          return {
            ...doc.data(),
            id: doc.id,
          } as Transaction; //Transaction型にキャスト、タイプスクリプトに型を教える
        });
        setTransactions(transactionsData);
      } catch (err) {
        if (isFireStoreError(err)) {
          console.error("firestoreのエラーは:", err);
        } else {
          console.error("一般的なエラーは:", err);
        }
        //error
      } finally {
        setIsLoading(false); //ローディングをfalseにする
      }
    };
    fetchTransactions();
  }, []);
  console.log(isLoading);

  //ひと月分の取引をフィルタリング
  const monthlyTransactions = transactions.filter((transaction) => {
    // Firestoreから取得した日付は実際には文字列として保存されている
    return (transaction.date as unknown as string).startsWith(
      formatMonth(currentMonth)
    );
  });

  // ここでデータを保存する処理を実装
  const handleSaveTransaction = async (transaction: Schema) => {
    //バリデーションのSchemaを選択
    console.log("App.tsxで受け取ったデータ:", transaction);
    try {
      //firestoreに保存する処理
      const docRef = await addDoc(collection(db, "Transactions"), {
        ...transaction,
      });
      console.log("Document written with ID: ", docRef.id);

      //保存が成功したら、ローカルの状態も更新する
      const newTransaction = {
        id: docRef.id, //firestoreで自動作成されたID
        ...transaction, //スプレッド構文でtransactionの内容を展開
      } as Transaction; // 型アサーションを追加
      //型アサーションを使うことで、TypeScriptに対してnewTransactionがTransaction型であることを明示する
      console.log("新しい取引:", newTransaction);
      setTransactions((prev) => [...prev, newTransaction]); //スプレッド構文でprevの配列を展開し、新しい取引を追加
    } catch (err) {
      if (isFireStoreError(err)) {
        console.error("firestoreのエラーは:", err);
      } else {
        console.error("一般的なエラーは:", err);
      }
    }
  };

  //firestoreからデータを削除する処理
  const handleDeleteTransaction = async (
    transactionIds: string | readonly string[]
  ) => {
    try {
      const idsToDelete = Array.isArray(transactionIds)
        ? transactionIds
        : [transactionIds];
      // 引数が配列の時はそのまま返す、配列でない時は配列に変換
      console.log(idsToDelete);


      for(const id of idsToDelete) { //idsToDelete内から一つずつidを取り出して、idに格納
        // Firestoreからデータを削除
        await deleteDoc(doc(db, "Transactions", id));
      }

      // //削除が成功したら、ローカルの状態も更新する
      // const filteredTransactions = transactions.filter(
      //   (transaction) => transaction.id !== transactionId //idに一致しないものだけを残す
      // );
      //削除が成功したら、ローカルの状態も更新する
      const filteredTransactions = transactions.filter(
        (transaction) => !idsToDelete.includes(transaction.id) //idがidsToDeleteに含まれていないものだけを残す
      );
      console.log("削除後の取引:", filteredTransactions);
      setTransactions(filteredTransactions);

    } catch (err) {
      if (isFireStoreError(err)) {
        console.error("firestoreのエラーは:", err);
      } else {
        console.error("一般的なエラーは:", err);
      }
    }
  };

  // firestoreの更新処理
  const handleUpdateTransaction = async (
    transaction: Schema,
    transactionId: string
  ) => {
    try {
      const docRef = doc(db, "Transactions", transactionId);
      await updateDoc(docRef, transaction);

      //更新が成功したら、フロントも更新する
      const updatedTransactions = transactions.map((t) =>
        //transactionsからidが更新されたidと一致していれば、更新されたデータで置き換える
        //一致するものがなければそのまま
        //tは元のデータ、transactionは更新されたデータ、transactionでidは更新されないのでt.idを使う
        t.id === transactionId ? { ...t, ...transaction } : t
      ) as Transaction[];
      //setTransactionsは空文字列を受け取れないが、updatedTransactionsは空文字を受け入れるため型アサーションをする
      console.log("更新後の取引:", updatedTransactions);
      setTransactions(updatedTransactions);
    } catch (err) {
      if (isFireStoreError(err)) {
        console.error("firestoreのエラーは:", err);
      } else {
        console.error("一般的なエラーは:", err);
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      {" "}
      {/* テーマの適用 */}
      <CssBaseline /> {/* MUIのCSSリセット */}
      <Router basename="/react-household-account-book">
        <Routes>
          {/* 親ルート: AppLayoutを使用 */}
          <Route path="/" element={<AppLayout />}>
            {/* 子ルート: AppLayout内の<Outlet />に表示される */}
            <Route
              index
              element={
                <Home
                  monthlyTransactions={monthlyTransactions}
                  setCurrentMonth={setCurrentMonth}
                  onSaveTransaction={handleSaveTransaction}
                  onDeleteTransaction={handleDeleteTransaction}
                  onUpdateTransaction={handleUpdateTransaction}
                />
              }
            />
            <Route
              path="report"
              element={
                <Report
                  currentMonth={currentMonth}
                  setCurrentMonth={setCurrentMonth}
                  monthlyTransactions={monthlyTransactions}
                  isLoading={isLoading}
                  onDeleteTransaction={handleDeleteTransaction}
                />
              }
            />
          </Route>
          <Route path="*" element={<NoMatch />} /> {/* 404ページ*/}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
