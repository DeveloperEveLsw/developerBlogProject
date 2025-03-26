import Link from 'next/link'
import React from 'react'

const TopNavigtion = () => {
  return (
    <div className='TopNavigation'>
      <h1><Link href="/">LSW Blog</Link></h1>
      <div>
        <nav className='top-rigth-nav'>
          <Link href="/toy">Toy Project</Link>
          <Link href="https://github.com/DeveloperEveLsw">github</Link>
        </nav>
      </div>
    </div>
  )
}

export default TopNavigtion