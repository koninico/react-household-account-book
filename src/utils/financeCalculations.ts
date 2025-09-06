import type { Balance, Transaction } from "../types";

export function financeCalculations(transactions: Transaction[]): Balance {
  return transactions.reduce(
    //reduce関数は繰り返し処理を行い、単一の値を返す、終了ごとに累積値を更新
    (acc, transaction) => {
      //accは累積値、transactionは現在の要素
      if (transaction.type == "income") {
        acc.income += transaction.amount; //acc.incomeは初期値0から始まり、収入の合計を計算
      } else {
        acc.expense += transaction.amount; //支出の合計を計算
      }
      acc.balance = acc.income - acc.expense; //収入から支出を引いた値を計算
      return acc; //次のイテレーションにaccを渡す
    },
    { income: 0, expense: 0, balance: 0 }
  ); //初期値を設定,accのオブジェクトの形を指定している
}

//1.日付ごとの収支を計算する関数
export function calculateDailyBalance(
  transactions: Transaction[]
): Record<string, Balance> {
  //Balanceはindex.tsで定義した型、Recordはオブジェクトのキーと値の型を指定する
  return transactions.reduce<Record<string, Balance>>((acc, transaction) => {
    //Recordはaccに型を定義するもの
    // Firestoreの日付データは実際には文字列として保存されている
    const day = transaction.date as unknown as string;
    if (!acc[day]) {
      //その日付のデータがなければ
      acc[day] = { income: 0, expense: 0, balance: 0 }; //その日付のデータがなければ値を0円で初期化
    }

    if (transaction.type === "income") {
      acc[day].income += transaction.amount;
    } else {
      acc[day].expense += transaction.amount;
    }
    acc[day].balance = acc[day].income - acc[day].expense;
    return acc;
  }, {});
  //末尾の{}は初期値、空のオブジェクトを指定している。各日付ごとに収支を計算し、その結果をオブジェクトとして返す

  //上記の関数を使うと、例えば以下のような形で日付ごとの収支を取得できる
  // {
  //   "2023-12-20" : {income: 700, expense: 200, balance: 500},
  //   "2023-12-23" : {income: 0, expense: 0, balance: 0},
  //}
}
