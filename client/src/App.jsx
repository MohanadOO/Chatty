import Nav from './components/Nav'
import { useEffect, useState } from 'react'
import { UserContext } from './Context/UserContext'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(
    JSON.parse(localStorage.getItem('loggedIn')) || false
  )

  useEffect(() => {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark')
      localStorage.theme = 'dark'
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.theme = 'light'
    }
  }, [])

  return (
    <UserContext.Provider value={{ userLoggedIn, setUserLoggedIn }}>
      <div className='dark:bg-primary-dark-600 dark:text-white text-black transition-colors h-screen'>
        <Toaster />
        <Nav defaultTheme={localStorage.theme} />
        <Outlet />
      </div>
    </UserContext.Provider>
  )
}

export default App
