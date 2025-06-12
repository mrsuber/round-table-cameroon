import React from 'react';
import './AnimatedFlicker.css';

const AnimatedFlicker = ({ children }: { children: any }) => {
  return <div className='animate-flicker'>{children}</div>;
};

export default AnimatedFlicker;
