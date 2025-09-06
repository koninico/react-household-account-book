import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogContent,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  ListItemIcon,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { use, useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close"; // 閉じるボタン用のアイコン
import FastfoodIcon from "@mui/icons-material/Fastfood"; //食事アイコン
import { Controller, useForm, type SubmitHandler } from "react-hook-form"; //収支切り替えボタン
import type { JSX } from "@fullcalendar/core/preact.js";
import type { ExpenseCategory, IncomeCategory, Transaction } from "../types";
import AlarmIcon from "@mui/icons-material/Alarm";
import AddHomeIcon from "@mui/icons-material/AddHome";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";
import TrainIcon from "@mui/icons-material/Train";
import WorkIcon from "@mui/icons-material/Work";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import SavingsIcon from "@mui/icons-material/Savings";
import { zodResolver } from "@hookform/resolvers/zod"; //バリデーション
import { transactionSchema, type Schema } from "../validations/schema"; //スキーマ
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import type { is } from "zod/v4/locales";

interface TransactionFormProps {
  onCloseForm: () => void;
  isEntryDrawerOpen: boolean;
  currentDay: string; // 追加: 親コンポーネントからcurrentDayを受け取る
  onSaveTransaction: (transaction: Schema) => Promise<void>;
  selectedTransaction: Transaction | null; // 追加: 選択された取引データ
  onDeleteTransaction: (transactionId: string| readonly string[]) => Promise<void>;
  setSelectedTransaction: React.Dispatch<
    React.SetStateAction<Transaction | null>
  >;
  onUpdateTransaction: (
    transaction: Schema,
    transactionId: string
  ) => Promise<void>;
  isMobile: boolean;
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

type IncomeExpense = "income" | "expense";

interface CategoryItem {
  label: IncomeCategory | ExpenseCategory; //index.tsの型を使用、指定された型のみ許可
  icon: JSX.Element; //MUI
}

const TransactionForm = ({
  onCloseForm,
  isEntryDrawerOpen,
  currentDay,
  onSaveTransaction,
  selectedTransaction,
  onDeleteTransaction,
  setSelectedTransaction,
  onUpdateTransaction,
  isMobile,
  isDialogOpen,
  setIsDialogOpen,
}: TransactionFormProps) => {
  const formWidth = 320;

  //支出カテゴリを定義
  const expenseCategories: CategoryItem[] = [
    { label: "食費", icon: <FastfoodIcon /> }, //カテゴリに対して型を定義
    { label: "日用品", icon: <AlarmIcon fontSize="small" /> },
    { label: "住居費", icon: <AddHomeIcon fontSize="small" /> },
    { label: "交際費", icon: <Diversity3Icon fontSize="small" /> },
    { label: "娯楽", icon: <SportsTennisIcon fontSize="small" /> },
    { label: "交通費", icon: <TrainIcon fontSize="small" /> },
  ];

  //収入カテゴリを定義
  const incomeCategories: CategoryItem[] = [
    { label: "給与", icon: <WorkIcon fontSize="small" /> },
    { label: "副収入", icon: <AddBusinessIcon fontSize="small" /> },
    { label: "お小遣い", icon: <SavingsIcon fontSize="small" /> },
  ];

  const [categories, setCategories] = useState(expenseCategories);

  const {
    control,
    setValue,
    watch,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<Schema>({
    //フォームの初期値
    defaultValues: {
      type: "expense",
      date: currentDay, // 親コンポーネントからcurrentDayを受け取る
      category: "",
      amount: 0,
      content: "",
    },
    resolver: zodResolver(transactionSchema), //バリデーション
  });
  console.log(errors);

  //収支切り替えボタンの処理
  const incomeExpenseToggle = (type: IncomeExpense) => {
    return () => {
      setValue("type", type); //typeフィールドの値を更新
      setValue("category", ""); //typeフィールドの値を更新
    };
  };

  //現在の収支タイプを監視
  const currentType = watch("type");
  console.log(currentType);

  //カテゴリの更新
  useEffect(() => {
    const newCategories =
      currentType === "expense" ? expenseCategories : incomeCategories;
    console.log(newCategories);
    setCategories(newCategories);
  }, [currentType]);

  //カレンダーの日付がクリックされたときに呼ばれる関数
  useEffect(() => {
    setValue("date", currentDay);
  }, [currentDay]); //依存関係は配列で囲む

  //送信処理、更新処理
  const onSubmit: SubmitHandler<Schema> = (data) => {
    //この中にフィールドの値が入る
    console.log(data);
    //選択された取引データがあれば更新、なければ新規作成
    if (selectedTransaction) {
      onUpdateTransaction(data, selectedTransaction.id)
        .then(() => {
          // console.log("更新");
          setSelectedTransaction(null); //更新後に選択を解除
          if (isMobile){
            setIsDialogOpen(false); //更新処理が完了した後に閉じる
          }
        })
        .catch((error) => {
          //appでもcatchしているが安全性向上のため記載
          console.error("更新エラー:", error);
        });
    } else {
      onSaveTransaction(data)
        .then(() => {
          console.log("保存");
        })
        .catch((error) => {
          console.error("保存エラー:", error);
        });
    }
    reset({
      //送信後にフォームをリセット
      type: "expense",
      date: data.date,
      category: "",
      amount: 0,
      content: "",
    });
  };

  //収支タイプの違う取引を選択したときに発生する警告を解消するためのuseEffect
  useEffect(() => {
    //選択肢が更新されたか確認
    if (selectedTransaction) {
      const categoryExists = categories.some(
        (category) => category.label === selectedTransaction.category
      );
      setValue("category", categoryExists ? selectedTransaction.category : ""); //
      console.log(categories);
      console.log(categoryExists);
    }
  }, [selectedTransaction, categories]); //この配列が変わったときに実行される

  //選択された取引データが変更されたときにフォームを更新
  useEffect(() => {
    if (selectedTransaction) {
      setValue("type", selectedTransaction.type); //setValueはreact-hook-formの値を更新
      setValue("date", selectedTransaction.date);

      setValue("amount", selectedTransaction.amount);
      setValue("content", selectedTransaction.content);
    } else {
      reset({
        date: currentDay,
        type: "expense",
        category: "",
        amount: 0,
        content: "",
      }); //日付はcurrentDayにリセットされる
    }
  }, [selectedTransaction]);

  //削除ボタンの処理
  const handleDelete = () => {
    if (selectedTransaction) {
      onDeleteTransaction(selectedTransaction?.id); //取引を特定するためにIDを渡す
      if (isMobile) {
        setIsDialogOpen(false); //削除処理が完了した後に閉じる
      }
      setSelectedTransaction(null); //取引選択を解除(モバイル・PC共通)
    }
  };

  {/* モバイル・PC兼用のフォーム内容をここに実装 */}
  const formContent = (
    <>
      {/* 入力エリアヘッダー */}
      <Box display={"flex"} justifyContent={"space-between"} mb={2}>
        <Typography variant="h6">入力</Typography>
        {/* 閉じるボタン */}
        <IconButton
          onClick={() => {
            // 閉じるボタンがクリックされたときの処理
            onCloseForm();
          }}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* フォーム要素 */}
      <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
        {" "}
        {/* フォームの要素 */}
        <Stack spacing={2}>
          {/* 収支切り替えボタン */}
          <Controller
            name="type"
            control={control} //これでMUIとReact Hook Formを連携
            render={({ field }) => {
              console.log(field);
              return (
                //描画要素を指定
                <ButtonGroup fullWidth>
                  <Button
                    variant={
                      field.value === "expense" ? "contained" : "outlined"
                    } //塗りつぶされたボタン
                    color="error"
                    onClick={incomeExpenseToggle("expense")}
                  >
                    支出
                  </Button>
                  <Button
                    variant={
                      field.value === "income" ? "contained" : "outlined"
                    }
                    color="primary"
                    onClick={incomeExpenseToggle("income")}
                  >
                    収入
                  </Button>
                </ButtonGroup>
              );
            }}
          />

          {/* 日付 */}
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="日付"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                error={!!errors.date} //errors.dateプロパティが存在する場合にエラーを表示
                //!!を使うと、nullやundefinedをfalseに変換できる。
                helperText={errors.date ? errors.date.message : ""} //エラーメッセージを表示
              />
            )}
          />

          {/* カテゴリ */}
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              // <TextField
              //   {...field}
              //   id="カテゴリ"
              //   label="カテゴリ"
              //   error={!!errors.category} //errors.categoryプロパティが存在する場合にエラーを表示
              //   helperText={errors.category ? errors.category.message : ""} //エラーメッセージを表示
              //   select //select属性を追加
              //   InputLabelProps={{
              //     htmlFor: "category",
              //   }}
              //   inputProps={{ id: "category" }} //idを追加
              // >
              //   {categories.map((category) => (
              //     <MenuItem value={category.label}>
              //       <ListItemIcon>{category.icon}</ListItemIcon>
              //       {category.label}
              //     </MenuItem>
              // //   ))}
              // </TextField>
              <FormControl fullWidth error={!!errors.category}>
                <InputLabel id="category-select-label">カテゴリ</InputLabel>
                <Select
                  {...field}
                  labelId="category-select-label"
                  id="category-select"
                  label="カテゴリ"
                >
                  {categories.map((category) => (
                    <MenuItem value={category.label}>
                      <ListItemIcon>{category.icon}</ListItemIcon>
                      {category.label}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {errors.category ? errors.category.message : ""}
                </FormHelperText>
              </FormControl>
            )}
          />

          {/* 金額 */}
          <Controller
            name="amount"
            control={control}
            render={({ field }) => {
              console.log(field);
              return (
                <TextField
                  error={!!errors.amount} //errors.amountプロパティが存在する場合にエラーを表示
                  helperText={errors.amount ? errors.amount.message : ""} //エラーメッセージを表示
                  {...field}
                  value={field.value === 0 ? "" : field.value} //0のときは空文字を表示
                  onChange={(e) => {
                    //入力した都度変換
                    const newValue = parseInt(e.target.value, 10) || 0;
                    //10進数にする。空文字の時は0に変換
                    //文字を入力する都度、number型に変換してからvalueを更新
                    field.onChange(newValue);
                  }}
                  label="金額"
                  type="number"
                />
              );
            }}
          />

          {/* 内容 */}
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="内容"
                type="text"
                error={!!errors.content} //errors.contentプロパティが存在する場合にエラーを表示
                helperText={errors.content ? errors.content.message : ""} //エラーメッセージを表示
              />
            )}
          />

          {/* 保存・更新ボタン */}
          <Button
            type="submit"
            variant="contained"
            color={currentType === "income" ? "primary" : "error"}
            fullWidth
          >
            {selectedTransaction ? "更新" : "保存"}
          </Button>

          {/* 削除ボタン */}
          {selectedTransaction && (
            <Button
              onClick={handleDelete}
              variant="outlined"
              color={"secondary"}
              fullWidth
            >
              削除
            </Button>
          )}
        </Stack>
      </Box>
    </>
  );

  return (
    <>
    {isMobile ? (
      //mobile
      <Dialog open={isDialogOpen} onClose={onCloseForm} fullWidth maxWidth="sm"> {/* maxWidth="sm"で横幅を制限 */}
        <DialogContent>
          {formContent}
        </DialogContent>
      </Dialog>
    ) : (
      //PC
    <Box
      sx={{
        position: "fixed",
        top: 64,
        right: isEntryDrawerOpen ? formWidth : "-2%", // フォームの位置を調整
        width: formWidth,
        height: "100%",
        bgcolor: "background.paper",
        zIndex: (theme) => theme.zIndex.drawer - 1,
        transition: (theme) =>
          theme.transitions.create("right", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        p: 2, // 内部の余白
        boxSizing: "border-box", // ボーダーとパディングをwidthに含める
        boxShadow: "0px 0px 15px -5px #777777",
      }}
    >
      {formContent}
    </Box>

    )}
    </>
  );
};
export default TransactionForm;
