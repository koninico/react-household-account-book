import { Box, Card, CardContent, Typography } from "@mui/material";
import React from "react";
import type { Transaction } from "../types";
import { financeCalculations } from "../utils/financeCalculations";
import { formatCurrency } from "../utils/formatting";

interface DailySummaryProps {
  dailyTransactions: Transaction[];
}

const DailySummary = ({ dailyTransactions }: DailySummaryProps) => {
  const { income, expense, balance } = financeCalculations(dailyTransactions);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "row", lg: "column" }, // 1200px以下では横並び、1200px超では縦積み
        gap: { xs: 1, lg: 2 },
      }}
    >
      {/* 収入・支出エリア */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: { xs: 1, lg: 2 },
          flex: { xs: 2, lg: "none" }, // 1200px以下では横幅の2/3を占有
          width: { lg: "100%" }, // 1200px超では全幅
        }}
      >
        {/* 収入 */}
        <Card sx={{ bgcolor: (theme) => theme.palette.grey[100], flex: 1 }}>
          <CardContent
            sx={{
              p: { xs: 1, lg: 2 },
              "&:last-child": { pb: { xs: 1, lg: 2 } },
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
            }}
          >
            <Typography
              variant="caption"
              noWrap
              sx={{
                fontSize: { xs: "1rem", lg: "1rem" },
                textAlign: "center",
                mb: 0.5,
              }}
            >
              収入
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: (t) => t.palette.incomeColor.main,
                textAlign: "right",
                fontWeight: "bold",
                wordBreak: "break-all",
                fontSize: { xs: "1rem", lg: "1.2rem" },
              }}
            >
              ¥{formatCurrency(income)}
            </Typography>
          </CardContent>
        </Card>

        {/* 支出 */}
        <Card sx={{ bgcolor: (theme) => theme.palette.grey[100], flex: 1 }}>
          <CardContent
            sx={{
              p: { xs: 1, lg: 2 },
              "&:last-child": { pb: { xs: 1, lg: 2 } },
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
            }}
          >
            <Typography
              variant="caption"
              noWrap
              sx={{
                fontSize: { xs: "1rem", lg: "1rem" },
                textAlign: "center",
                mb: 0.5,
              }}
            >
              支出
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: (theme) => theme.palette.expenseColor.main,
                textAlign: "right",
                fontWeight: "bold",
                wordBreak: "break-all",
                fontSize: { xs: "1rem", lg: "1.2rem" },
              }}
            >
              ¥{formatCurrency(expense)}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* 残高 */}
      <Card
        sx={{
          bgcolor: (theme) => theme.palette.grey[100],
          flex: { xs: 1, lg: "none" }, // 1200px以下では横幅の1/3を占有
          width: { lg: "100%" }, // 1200px超では全幅
        }}
      >
        <CardContent
          sx={{
            p: { xs: 1, lg: 2 },
            "&:last-child": { pb: { xs: 1, lg: 2 } },
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
          }}
        >
          <Typography
            variant="caption"
            noWrap
            sx={{
              fontSize: { xs: "1rem", lg: "1rem" },
              textAlign: "center",
              mb: 0.5,
            }}
          >
            残高
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: (t) => t.palette.balanceColor.main,
              textAlign: "right",
              fontWeight: "bold",
              wordBreak: "break-all",
              fontSize: { xs: "1rem", lg: "1.2rem" },
            }}
          >
            ¥{formatCurrency(balance)}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DailySummary;
