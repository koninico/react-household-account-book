import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Drawer,
  List,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";
//アイコン
import NotesIcon from "@mui/icons-material/Notes";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DailySummary from "./DailySummary";
import IconComponents from "./common/IconComponents";
import type { Transaction } from "../types";
import { formatCurrency } from "../utils/formatting";

interface TransactionMenuProps {
  dailyTransactions: Transaction[];
  currentDay: string;
  onAddTransactionForm: () => void;
  onSelectTransaction: (transaction: Transaction) => void;
  isMobile: boolean;
  open: boolean;
  onClose: () => void;
}

const TransactionMenu = ({
  dailyTransactions,
  currentDay,
  onAddTransactionForm,
  onSelectTransaction,
  isMobile,
  open,
  onClose,
}: TransactionMenuProps) => {
  const menuDrawerWidth = 320;
  return (
    <Drawer
      sx={{
        //全体を表示するエリア
        width: isMobile ? "auto" : menuDrawerWidth, //モバイルなら自動、PCなら固定幅
        "& .MuiDrawer-paper": {
          //MuiDrawer-paperはDrawerの中身全体を指す
          width: isMobile ? "auto" : menuDrawerWidth, //モバイルならmax幅、PCなら固定幅
          boxSizing: "border-box",
          p: 2,

          ...(isMobile && {
            //モバイルサイズの場合の適用スタイル
            height: "80vh", //画面の80%高さ
            borderTopRightRadius: 8,
            borderTopLeftRadius: 8,
          }),
          ...(!isMobile && {
            //モバイルサイズでない場合の適用スタイル
            top: 64,
            height: `calc(100% - 64px)`, // AppBarの高さを引いたビューポートの高さ
          }),
        },
      }}
      variant={isMobile ? "temporary" : "permanent"} //モバイル(1200以下)なら一時的、PCなら常駐
      anchor={isMobile ? "bottom" : "right"} //モバイルなら下、PCなら左
      open={open} //メニューがopenのステートにより開閉する
      onClose={onClose} //メニューを閉じる関数
      slotProps={{
        root: {
          keepMounted: true, // Better open performance on mobile.
        },
      }}
    >
      <Stack sx={{ height: "100%" }} spacing={2}>
        {/* 日付を表示するエリア */}
        <Typography fontWeight={"fontWeightBold"}>
          日時： {currentDay}
        </Typography>

        {/* 収支を表示するエリア */}
        <DailySummary
          dailyTransactions={dailyTransactions}
        />

        {/* 内訳タイトル&内訳追加ボタン */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 1,
          }}
        >
          {/* 左側のメモアイコンとテキスト */}
          <Box display="flex" alignItems="center">
            <NotesIcon sx={{ mr: 1 }} />
            <Typography variant="body1">内訳</Typography>
          </Box>
          {/* 右側の追加ボタン */}
          <Button
            startIcon={<AddCircleIcon />}
            color="primary"
            onClick={onAddTransactionForm}
          >
            内訳を追加
          </Button>
        </Box>

        {/* 取引一覧 */}
        <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
          <List aria-label="取引履歴">
            {" "}
            {/* Listはulタグに変換される */}
            <Stack spacing={2}>
              {dailyTransactions.map((transaction) => (
                <ListItem key={transaction.id} disablePadding>
                  <Card
                    sx={{
                      width: "100%",
                      backgroundColor:
                        transaction.type === "income"
                          ? (theme) => theme.palette.incomeColor.light
                          : (theme) => theme.palette.expenseColor.light,
                    }}
                    onClick={() => onSelectTransaction(transaction)}
                  >
                    <CardActionArea>
                      <CardContent>
                        {/* 1行＝横並び4分割（アイコン／カテゴリ／内容／金額） */}
                        <Stack direction="row" spacing={1} alignItems="center">
                          {/* アイコン（固定幅） */}
                          <Box
                            sx={{
                              minWidth: 24,
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            {/* icon */}
                            {IconComponents[transaction.category]}
                          </Box>

                          {/* カテゴリ（やや短め固定幅） */}
                          <Box sx={{ minWidth: 60 }}>
                            <Typography
                              variant="caption"
                              display="block"
                              gutterBottom
                            >
                              {transaction.category}
                            </Typography>
                          </Box>

                          {/* 内容（可変幅） */}
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" gutterBottom>
                              {transaction.content}
                            </Typography>
                          </Box>

                          {/* 金額（固定幅＋右寄せ） */}
                          <Box sx={{ minWidth: 80, textAlign: "right" }}>
                            <Typography
                              gutterBottom
                              color="text.secondary"
                              sx={{ wordBreak: "break-all" }}
                            >
                              ¥{formatCurrency(transaction.amount)}
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </ListItem>
              ))}
            </Stack>
          </List>
        </Box>
      </Stack>
    </Drawer>
  );
};
export default TransactionMenu;
