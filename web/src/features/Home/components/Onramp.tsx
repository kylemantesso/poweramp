import { Box, Button, Container, Grid, Paper, Typography } from '@mui/material';
import type { FC } from 'react';

export const Onramp: FC = props => {
  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        py: 15,
      }}
      {...props}
    >
      <Container maxWidth="lg">
        <Grid alignItems="center" container justifyContent="center" spacing={3}>
          <Grid item md={6} sm={8} order={{ xs: 2, md: 1 }}>
            <Box
              px={{
                xs: 2,
                md: 2,
              }}
              py={{
                xs: 2,
                md: 0,
              }}
            >
              <Paper
                elevation={24}
                sx={{
                  '& img': {
                    width: '100%',
                    margin: 'auto',
                  },
                }}
              >
                <img alt="Helix NFT wallet" src="product-3.png" />
              </Paper>
            </Box>
          </Grid>
          <Grid item md={6} xs={12} order={{ xs: 1, md: 2 }}>
            <Typography variant="h3">👛 No wallet? No worries!</Typography>
            <Typography
              color="textSecondary"
              sx={{ my: 3 }}
              variant="subtitle1"
            >
              Your customers can purchase NFTs directly into their secure Helix
              Wallet by simply using their email address.
            </Typography>
            <Box>
              <Button
                component="a"
                href="/wallet"
                size="large"
                variant="outlined"
              >
                Open your Helix Wallet
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
