import { Card, CardContent, Stack, Typography, Box } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import type { Transaction } from "../types";
import { financeCalculations } from "../utils/financeCalculations";
import { formatCurrency } from "../utils/formatting";

interface MonthlySummaryProps {
  monthlyTransactions: Transaction[];
}

const MonthlySummary = ({ monthlyTransactions }: MonthlySummaryProps) => {
  //console.log(monthlyTransactions);
  const {income,expense,balance} = financeCalculations(monthlyTransactions);
  // console.log(monthlyTotals.income);
  return (
    <Stack
      direction="row"
      spacing={{ xs: 1, sm: 2 }}
      sx={{ mb: 2, width: "100%", alignItems: "stretch" }}
    >
      {/* 収入 */}
      <Box sx={{ flex: 1, minWidth: 0, display: "flex" }}>
        <Card
          sx={{
            bgcolor: (theme) => theme.palette.incomeColor.main,
            color: "white",
            borderRadius: "10px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CardContent sx={{ padding: { xs: 1, sm: 2 } }}>
            <Stack direction={"row"} alignItems="center" spacing={1}>
              <ArrowUpwardIcon sx={{ fontSize: "2rem" }} />
              <Typography>収入</Typography>
            </Stack>
            <Typography
              textAlign={"right"}
              variant="h5"
              fontWeight={"fontWeightBold"}
              sx={{
                wordBreak: "break-word",
                fontSize: { xs: ".8rem", sm: "1rem", md: "1.2rem" },
                mt: 1,
              }}
            >
              ¥{formatCurrency(income)}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* 支出 */}
      <Box sx={{ flex: 1, minWidth: 0, display: "flex" }}>
        <Card
          sx={{
            bgcolor: (theme) => theme.palette.expenseColor.main,
            color: "white",
            borderRadius: "10px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CardContent sx={{ padding: { xs: 1, sm: 2 } }}>
            <Stack direction={"row"} alignItems="center" spacing={1}>
              <ArrowDownwardIcon sx={{ fontSize: "2rem" }} />
              <Typography>支出</Typography>
            </Stack>
            <Typography
              textAlign={"right"}
              variant="h5"
              fontWeight={"fontWeightBold"}
              sx={{
                wordBreak: "break-word",
                fontSize: { xs: ".8rem", sm: "1rem", md: "1.2rem" },
                mt: 1,
              }}
            >
              ¥{formatCurrency(expense)}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* 残高 */}
      <Box sx={{ flex: 1, minWidth: 0, display: "flex" }}>
        <Card
          sx={{
            bgcolor: (theme) => theme.palette.balanceColor.main,
            color: "white",
            borderRadius: "10px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CardContent sx={{ padding: { xs: 1, sm: 2 } }}>
            <Stack direction={"row"} alignItems="center" spacing={1}>
              <AccountBalanceIcon sx={{ fontSize: "2rem" }} />
              <Typography>残高</Typography>
            </Stack>
            <Typography
              textAlign={"right"}
              variant="h5"
              fontWeight={"fontWeightBold"}
              sx={{
                wordBreak: "break-word",
                fontSize: { xs: ".8rem", sm: "1rem", md: "1.2rem" },
                mt: 1,
              }}
            >
              ¥{formatCurrency(balance)}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Stack>
  );
};

export default MonthlySummary;
