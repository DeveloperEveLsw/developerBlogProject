import Link from 'next/link'
import React from 'react'
import styles from "./TopNavigation.module.css"

const TopNavigtion = () => {
  return (
    <div className={styles.mainContainer}>
      <h1 className={styles.homeLink}><Link href="/">LSW Blog</Link></h1>
      <div>
        <nav className={styles.rightNav}>
          <Link className={styles["hover"]} href="/toy" title='Toy Project'>Toy Project</Link>
          <Link className={styles["hover"]} href="https://github.com/DeveloperEveLsw" title='github'>github</Link>
        </nav>
      </div>
    </div>
  )
}

export default TopNavigtion