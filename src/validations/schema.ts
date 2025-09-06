import { z } from "zod";

//バリデーションのスキーマを定義
export const transactionSchema = z.object({
  type: z.enum(["income", "expense"]), //リアクトフックフォームで選択する収入か支出かの値
  date: z.string().min(1, { message: "日付は必須です" }), //最低1文字以上
  amount: z.number().min(1, { message: "金額は1円以上が必須です" }), //最低1以上受け付ける。1以上は数値を守る

  content: z
    .string()
    .min(1, { message: "内容を入力してください" })
    .max(50, { message: "内容は50文字以内で入力してください" }), //最低1文字、最大50文字まで

  category: z
    .union([
      z.enum(["食費", "日用品", "住居費", "交際費", "娯楽", "交通費"]),
      z.enum(["給与", "副収入", "お小遣い"]),
      z.literal(""),//空文字も許容する
    ])
    .refine((val) => val !== "", { message: "カテゴリを選択してください" }),
  //
});

export type Schema = z.infer<typeof transactionSchema>;
//上記のバリデーションロジックから型を生成可能
