import React from 'react'
import Nav from '../components/Nav'

function Home() {
  return (
    <div className='h-screen dark:bg-primary-dark-600 dark:text-primary-white text-black'>
      <Nav defaultTheme={localStorage.theme} />
      <h1>Home</h1>
    </div>
  )
}

export default Home
