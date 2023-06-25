import { Box, Container, Grid, Paper, Typography } from '@mui/material';
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
                💰 Get rewarded for conserving energy
              </Typography>
              <Typography
                color="textSecondary"
                sx={{ my: 3 }}
                variant="subtitle1"
              >
                Participate in demand response events and beat your energy usage estimate to earn AMP tokens
              </Typography>
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
              <img alt="Dashboard" src="2.png" />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
