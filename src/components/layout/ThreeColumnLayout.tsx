import React from 'react';
import styles from './ThreeColumnLayout.module.css';

interface ThreeColumnLayoutProps {
  left?: React.ReactNode;
  center: React.ReactNode;
  right?: React.ReactNode;
}

const ThreeColumnLayout: React.FC<ThreeColumnLayoutProps> = ({ left, center, right }) => {
  return (
    <div className={styles.layoutContainer}>
      {left && <aside className={styles.leftPanel}>{left}</aside>}
      <main className={styles.centerPanel}>{center}</main>
      {right && <aside className={styles.rightPanel}>{right}</aside>}
    </div>
  );
};

export default ThreeColumnLayout; 