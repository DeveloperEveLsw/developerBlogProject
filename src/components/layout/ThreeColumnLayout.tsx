import React from 'react';
import styles from './ThreeColumnLayout.module.css';

interface ThreeColumnLayoutProps {
  left?: React.ReactNode;
  center: React.ReactNode;
  right?: React.ReactNode;
  centerMaxWidth?: number | string;
}

const ThreeColumnLayout: React.FC<ThreeColumnLayoutProps> = ({ left, center, right, centerMaxWidth }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      {left && <div style={{ flex: '1 1 0', minWidth: 0 }}>{left}</div>}
      <div
        style={
          centerMaxWidth
            ? { flex: '0 1 auto', maxWidth: typeof centerMaxWidth === 'number' ? `${centerMaxWidth}px` : centerMaxWidth, width: '100%' }
            : { flex: '1 1 0', minWidth: 0 }
        }
      >
        {center}
      </div>
      {right && <div style={{ flex: '1 1 0', minWidth: 0 }}>{right}</div>}
    </div>
  );
};

export default ThreeColumnLayout; 