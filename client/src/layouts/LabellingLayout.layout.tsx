import React, { ReactNode } from 'react';
import NavBar from '../components/labelling/navbar/NavBar.component';

interface IProps {
  children?: ReactNode | ReactNode[];
  childrenPadding?: string
}

const LabellingLayout = ({ children, childrenPadding= '14px 25px' }: IProps) => {
  return (
    <>
      <NavBar />
      <div
        style={{
          boxSizing: 'border-box',
          overflowX: 'hidden',
          minHeight: '100vh',
          padding: childrenPadding
        }}
      >
        {children}
      </div>
    </>
  );
};

export default LabellingLayout;
