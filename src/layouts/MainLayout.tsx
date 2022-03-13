import Navigation from 'common/Navigation';
import React from 'react';
import styled from 'styled-components/macro';

const Container = styled.main`
  min-height: calc(100vh - 56px);
  background-color: #eff0f5; //TODO background color to global style
`;

interface MainLayoutProps {}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <>
      <header>
        <Navigation />
      </header>
      <Container className="">{children}</Container>
    </>
  );
};

export default MainLayout;
