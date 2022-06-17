import React from 'react'
import Nav from '../components/Nav'

function Home({ socket }) {
  return (
    <div className='dark:bg-zinc-900 dark:text-white text-black transition-colors h-screen px-5 md:px-10 xl:px-44'>
      <Nav defaultTheme={localStorage.theme} socket={socket} />
      <img className='max-w-2xl' src='/home-logo.svg' alt='home_logo' />
    </div>
  )
}

export default Home
