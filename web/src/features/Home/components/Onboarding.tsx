import { Box, Button, Container, Grid, Paper, Typography } from '@mui/material';
import type { FC } from 'react';
// import { Link as RRLink } from 'react-router-dom';

export const Onboarding: FC = props => {
  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        py: 15,
      }}
      {...props}
    >
      <Container maxWidth="lg">
        <Grid alignItems="center" container justifyContent="center" spacing={3}>
          <Grid item md={6} xs={12}>
            <div>
              <Typography variant="h3">
                🛍️ Create your NFT checkout in minutes
              </Typography>
              <Typography
                color="textSecondary"
                sx={{ my: 3 }}
                variant="subtitle1"
              >
                After deploying your Helix compatible TRC-721 smart contract,
                creating a checkout takes just a few minutes.
              </Typography>
              <Button
                size="large"
                variant="contained"
                component="a"
                href="https://cooldogs.hellohelix.app"
              >
                Try it out
              </Button>
            </div>
          </Grid>
          <Grid item md={6} sm={8}>
            <Paper
              elevation={24}
              sx={{
                '& img': {
                  width: '100%',
                  margin: 'auto',
                },
              }}
            >
              <img alt="Dashboard" src="product-4.png" />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
