import {
  Box,
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
        <Stack spacing={1}>
          <Typography align="center" variant="h1">
            Connect, conserve, earn!
          </Typography>
          <Typography align="center" variant="h5">
              PowerAmp enables you to earn rewards for conserving energy ⚡️🌱💰
          </Typography>
        </Stack>

        {/*<Box*/}
        {/*  sx={{*/}
        {/*    display: 'flex',*/}
        {/*    flexWrap: 'wrap',*/}
        {/*    justifyContent: 'center',*/}
        {/*    mx: -1,*/}
        {/*    mt: 2,*/}
        {/*    mb: 6,*/}
        {/*    '& > a': {*/}
        {/*      m: 1,*/}
        {/*    },*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <Button*/}
        {/*    component="a"*/}
        {/*    size="large"*/}
        {/*    variant="outlined"*/}
        {/*    href="https://youtu.be/FsXELo_1lww&amp;mode=theatre"*/}
        {/*    target="_blank"*/}
        {/*  >*/}
        {/*    Watch intro*/}
        {/*  </Button>*/}
        {/*  <Button*/}
        {/*    component="a"*/}
        {/*    href="https://cooldogs.hellohelix.app"*/}
        {/*    size="large"*/}
        {/*    variant="contained"*/}
        {/*  >*/}
        {/*    🐶 Demo checkout*/}
        {/*  </Button>*/}
        {/*</Box>*/}
      </Container>
      {/*<Box*/}
      {/*  sx={{*/}
      {/*    maxWidth: 800,*/}
      {/*    width: '100%',*/}
      {/*    mx: 'auto',*/}
      {/*    padding: {*/}
      {/*      xs: 2,*/}
      {/*      sm: 4,*/}
      {/*      md: 4,*/}
      {/*    },*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <Paper*/}
      {/*    sx={{*/}
      {/*      maxWidth: '100%',*/}
      {/*      height: 'auto',*/}
      {/*      padding: 0,*/}
      {/*      margin: 0,*/}
      {/*    }}*/}
      {/*    elevation={24}*/}
      {/*    component="img"*/}
      {/*    alt="Checkout"*/}
      {/*    src="checkout.gif"*/}
      {/*  ></Paper>*/}
      {/*</Box>*/}
    </Box>
  );
};
