import React from 'react';
import styles from './ThreeColumnLayout.module.css';

interface ThreeColumnLayoutProps {
  left?: React.ReactNode;
  center: React.ReactNode;
  right?: React.ReactNode;
  leftWidth?: number | string;
  rightWidth?: number | string;
  centerMaxWidth?: number | string;
}

const ThreeColumnLayout: React.FC<ThreeColumnLayoutProps> = ({
  left,
  center,
  right,
  leftWidth,
  rightWidth,
  centerMaxWidth,
}) => {
  const format = (value: number | string | undefined) => {
    if (value === undefined) return undefined;
    return typeof value === 'number' ? `${value}px` : value;
  };

  return (
    <div className={styles.layoutContainer}>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', minWidth: 0 }}>
        {left && (
          <div className={styles.leftPanel} style={{ width: format(leftWidth) }}>
            {left}
          </div>
        )}
      </div>

      <div
        className={styles.centerPanel}
        style={{
          flex: '0 1 auto',
          width: format(centerMaxWidth),
          maxWidth: format(centerMaxWidth),
        }}
      >
        {center}
      </div>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start', minWidth: 0 }}>
        {right && (
          <div className={styles.rightPanel} style={{ width: format(rightWidth) }}>
            {right}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreeColumnLayout; 