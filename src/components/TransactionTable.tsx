import * as React from "react";
import { alpha, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Transaction } from "../types";
import { financeCalculations } from "../utils/financeCalculations";
import { formatCurrency } from "../utils/formatting";
import IconComponents from "./common/IconComponents";
import { compareDesc, parseISO } from "date-fns";


// ヘッダー部分のProps型定義
interface TransactionTableHeadProps {
  numSelected: number;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rowCount: number;
}

//ヘッダー部分
function TransactionTableHead(props: TransactionTableHeadProps) {
  const { onSelectAllClick, numSelected, rowCount } = props;

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        <TableCell align={"left"}>日付</TableCell>
        <TableCell align={"left"}>カテゴリ</TableCell>
        <TableCell align={"left"}>金額</TableCell>
        <TableCell align={"left"}>内容</TableCell>
      </TableRow>
    </TableHead>
  );
}

//ツールバーのProps型定義
interface TransactionTableToolbarProps {
  numSelected: number;
  onDelete: () => void;
}

//ツールバー部分
function TransactionTableToolbar(props: TransactionTableToolbarProps) {
  const { numSelected,onDelete } = props;
  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        },
      ]}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected {/* 選択されている時に表示される */}
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          月の収支
        </Typography>
      )}
      {numSelected > 0 && ( //&&をつけると選択されている時のみ削除アイコンを表示
        <Tooltip title="Delete">
          <IconButton onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

// FinancialItemコンポーネントのProps型定義
interface FinancialItemProps {
  title: string;
  value: number;
  color: string;
}

// FinancialItemコンポーネント
function FinancialItem({ title, value, color }: FinancialItemProps) {
  return (
    <>
      <Box
        sx={{
          width: { xs: "33.33%", sm: "33.33%" }, // xs={4} に相当（4/12 = 33.33%）
        }}
        textAlign={"center"}
      >
        <Typography variant="subtitle1" component={"div"}>
          {title}
        </Typography>
        <Typography
          component={"span"}
          fontWeight={"fontWeightBold"}
          sx={{
            color: color,
            fontSize: { xs: "0.8rem", sm: "1rem", md: "1.2rem" },
            wordBreak: "break-word", //文字を折り返す
          }}
        >
          ¥{formatCurrency(value)} {/* 日本円に変換 */}
        </Typography>
      </Box>
    </>
  );
}

// TransactionTableコンポーネントのProps型定義
interface TransactionTableProps {
  monthlyTransactions: Transaction[];
  onDeleteTransaction: (transactionId: string | readonly string[]) => Promise<void>;
}

//本体
export default function TransactionTable({
  monthlyTransactions,
  onDeleteTransaction,
}: TransactionTableProps) {
  const theme = useTheme();
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0); //現在のページ番号
  const [rowsPerPage, setRowsPerPage] = React.useState(5); //1ページあたりの行数

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = monthlyTransactions.map((n) => n.id); //rowからmonthlyTransactionsに修正
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  console.log({ selected });
  // 削除処理
  const handleDelete = () => {
    onDeleteTransaction(selected); //選択されたIDを削除
    setSelected([]); //選択をリセット
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - monthlyTransactions.length)
      : 0;

  //選択されたデータが選択されているかどうかを判定する関数、月間取引データにする
  const visibleRows = React.useMemo(
    () => {
      const sortedMonthlyTransactions = [...monthlyTransactions].sort((a, b) =>
        //日付で降順にソート
        compareDesc(parseISO(a.date), parseISO(b.date))
      );
      console.log(sortedMonthlyTransactions);

      return sortedMonthlyTransactions.slice(
        page * rowsPerPage, //インデックスの開始位置０(0*5),次ページは5(1*5)、その次は10(2*5)...
        page * rowsPerPage + rowsPerPage //インデックスの終了位置（5、10、15...()
      ); //5件分のデータを取得
    },
    [page, rowsPerPage, monthlyTransactions] //依存配列、ここが変わったとき（ページ変更）に再計算される。
  );
  console.log(visibleRows);

  // 月間の財務計算
  const { income, expense, balance } = financeCalculations(monthlyTransactions);
  console.log({ income, expense, balance });

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        {/* 収入、支出、残高の表示部分 */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-around",
            borderBottom: "1px solid rgba(224,224,224,1)", // 罫線の色を変更
          }}
        >
          <FinancialItem
            title={"収入"}
            value={income}
            color={theme.palette.incomeColor.main}
          />
          <FinancialItem
            title="支出"
            value={expense}
            color={theme.palette.expenseColor.main}
          />
          <FinancialItem
            title="残高"
            value={balance}
            color={theme.palette.balanceColor.main}
          />
        </Box>

        {/* ツールバー */}
        <TransactionTableToolbar 
          numSelected={selected.length} 
          onDelete={handleDelete} //TransactionTableToolbarにonDeleteを渡す
        />

        {/* テーブルの取引一覧 */}
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={"medium"}
          >
            {/* ヘッダー部分 */}
            <TransactionTableHead
              numSelected={selected.length}
              onSelectAllClick={handleSelectAllClick}
              rowCount={monthlyTransactions.length}
            />

            {/* テーブルの取引一覧 */}
            <TableBody>
              {visibleRows.map((transaction, index) => {
                const isItemSelected = selected.includes(transaction.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, transaction.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={transaction.id}
                    selected={isItemSelected}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          "aria-labelledby": labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {transaction.date}
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      {IconComponents[transaction.category]}
                      {transaction.category}
                    </TableCell>
                    <TableCell align="left">{transaction.amount}</TableCell>
                    <TableCell align="left">{transaction.content}</TableCell>
                    {/* <TableCell align="right">{row.protein}</TableCell> */}
                  </TableRow>
                );
              })}
              {/* 空行の処理 */}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows, //空の行の高さ分を指定、高さはdenseの値によって変わる,今回は53で固定
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* ページネーション部分 */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={monthlyTransactions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      {/* <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      /> */}
    </Box>
  );
}
