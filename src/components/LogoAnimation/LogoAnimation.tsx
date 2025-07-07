import React from 'react'
import styles from './LogoAnimation.module.css'

const LogoAnimation = ({size}: {size:number}) => {
    const logo_x = 50
    const logo_y = 100
    const logo_weight = 1000
    const logo_fontSize = 90

  return (
    <div className={styles.box}>
        <svg viewBox="0 0 400 150" width={size*3} height={size}> 
            <text className={styles.l}id="base" fontWeight={logo_weight} fontSize={logo_fontSize} x={logo_x} y={logo_y} fill="black">L</text>
            <text className={styles.b}  x={logo_x+15} y={logo_y} fontWeight={logo_weight} fontSize={logo_fontSize} fill="black">B</text>S
            <rect className={styles.stroke}
                x="74" 
                y="30" 
                width="16" 
                height="56.5" 
                fill="white"
            />
            <rect className={styles.stroke}
                x="89" 
                y="83" 
                width="16" 
                height="20" 
                fill="white"
            />
            <text className={styles.up}id="base" fontWeight={logo_weight} fontSize={logo_fontSize} x={logo_x+4} y={logo_y} fill="black">SW</text>
            <text className={styles.up}id="base" fontWeight={logo_weight} fontSize={logo_fontSize-20} x={logo_x+227} y={logo_y} fill="black">log</text>
            <text className={styles.description} x="126.82" y="130">즐기면서 성장하는 개발자</text>
        </svg>
    </div>
  )
}

export default LogoAnimation