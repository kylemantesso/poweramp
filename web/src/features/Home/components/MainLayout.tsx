import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import type { FC, ReactNode } from 'react';

import { Footer } from './Footer';
import { MainNavbar } from './MainNavbar';

interface MainLayoutProps {
  children?: ReactNode;
}

const MainLayoutRoot = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  height: '100%',
  paddingTop: 64,
}));

export const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  return (
    <MainLayoutRoot>
      <MainNavbar />
      {children}
      <Footer />
    </MainLayoutRoot>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node,
};
