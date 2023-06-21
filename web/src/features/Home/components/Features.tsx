import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import {
  Avatar,
  Box,
  Container,
  Grid,
  Paper,
  SvgIcon,
  Typography,
} from "@mui/material";
import type { FC } from "react";
interface Feature {
  icon: typeof SvgIcon;
  subheader: string;
  title: string;
}

const getFeatures = (): Feature[] => [
  {
    icon: CreditScoreIcon,
    subheader:
      "All major cards accepted. Our fraud detection takes care of bad actors, leaving you with no risk of change backs!",
    title: "Accept credit card payments",
  },
  {
    icon: AttachMoneyIcon,
    subheader:
      "Payouts happen on-chain, instantly using TRON. We handle the on-chain minting so you don't have to!",
    title: "Get paid instantly",
  },
  {
    icon: AccountBalanceWalletIcon,
    subheader:
      "We take care of creating your customers a wallet linked to their email address, so you can focus on creating content!",
    title: "Easy wallet creation",
  },
];

export const Features: FC = (props) => {
  const features = getFeatures();

  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        py: 15,
      }}
      {...props}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item md={6} xs={12}>
            <Typography variant="h3">🌱 Grow your customer base</Typography>
            <Typography
              color="textSecondary"
              sx={{ py: 2 }}
              variant="subtitle1"
            >
              Reach new audiences with a seamless, intuitive and familiar
              checkout experience
            </Typography>
            {features.map((feature) => {
              const { icon: Icon, subheader, title } = feature;

              return (
                <Box
                  component={Paper}
                  elevation={6}
                  key={title}
                  sx={{
                    borderRadius: 1,
                    cursor: "pointer",
                    display: "flex",
                    mb: 2,
                    p: 2,
                  }}
                >
                  <Avatar
                    sx={{
                      mr: 2,
                      backgroundColor: "primary.main",
                      color: "primary.contrastText",
                    }}
                  >
                    <Icon fontSize="small" />
                  </Avatar>
                  <div>
                    <Typography variant="h6">{title}</Typography>
                    <Typography color="textSecondary" variant="body2">
                      {subheader}
                    </Typography>
                  </div>
                </Box>
              );
            })}
          </Grid>
          <Grid item md={6} xs={12} container alignItems="center">
            <Grid
              item
              sx={{
                "& img": {
                  width: "100%",
                },
              }}
            >
              <Typography variant="h6">Supported blockchains</Typography>
              <Box
                sx={{
                  "& img": {
                    width: "100%",
                    margin: "auto",
                  },
                }}
              >
                <img alt="Wallet" src="tron.png" />
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
