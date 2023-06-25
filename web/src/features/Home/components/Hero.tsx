import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
} from '@mui/material';
import type { FC } from 'react';

export const Hero: FC = props => {
  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        py: 6,
      }}
      {...props}
    >
      <Container
        maxWidth="md"
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Stack spacing={1} alignItems="center">
          <Typography align="center" variant="h1">
            Connect, reduce, reward!
          </Typography>
          <Typography width="90%" align="center" variant="h5">
              PowerAmp is a revolutionary, decentralised demand response platform built on Hedera! ⚡️🌱💰
          </Typography>
        </Stack>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            mx: -1,
            mt: 4,
            mb: 6,
            '& > a': {
              m: 1,
            },
          }}
        >
          <iframe width="560" height="315" src="https://www.youtube.com/embed/wFejlriuAJg" title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen></iframe>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            mx: -1,
            mt: 2,
            mb: 6,
            '& > a': {
              m: 1,
            },
          }}
        >
          <Button
            component="a"
            href="/login"
            size="large"
            variant="contained"
          >
            Join PowerAmp today!
          </Button>
        </Box>
      </Container>
    </Box>
  );
};
