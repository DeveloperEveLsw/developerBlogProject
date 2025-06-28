import Link from 'next/link'
import React from 'react'
import styles from "./TopNavigation.module.css"
import GithubIcon from "./GithubIcon";

const TopNavigtion = () => {
  return (
    <div className={styles.mainContainer}>
      <h1 className={styles.homeLink}><Link href="/">LSW Blog</Link></h1>
      <div>
        <nav className={styles.rightNav}>
          <Link className={styles["hover"]} href="/toy" title='Toy Project'>
            <span className={styles.desktopText}>Toy Project</span>
            <span className={styles.mobileIcon}>🧩</span>
          </Link>
          <Link className={styles["hover"]} href="https://github.com/DeveloperEveLsw" title='github'>
            <span className={styles.desktopText}>github</span>
            <span className={styles.mobileIcon}><GithubIcon size={20} /></span>
          </Link>
        </nav>
      </div>
    </div>
  )
}

export default TopNavigtion