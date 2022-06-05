import { Link } from 'react-router-dom'
import { useContext, useState } from 'react'
import { UserContext } from '../Context/UserContext'
import { auth, useAuth } from '../Firebase'
import { RotateSpinner } from 'react-spinners-kit'
import { MoonIcon, SunIcon } from '../components/Icons'

function Nav({ defaultTheme }) {
  const currentUser = useAuth()
  const { userLoggedIn, setUserLoggedIn } = useContext(UserContext)
  const [theme, setTheme] = useState(defaultTheme)
  const logout = async () => {
    const { signOut } = await import('firebase/auth')
    await signOut(auth)
    localStorage.setItem('loggedIn', false)
    setUserLoggedIn(false)
  }

  function toggleTheme() {
    if (localStorage.theme === 'dark') {
      localStorage.theme = 'light'
      setTheme('light')
      return document.documentElement.classList.remove('dark')
    }
    localStorage.theme = 'dark'
    setTheme('dark')
    return document.documentElement.classList.add('dark')
  }

  return (
    <nav className=' dark:bg-primary-dark-400 w-full text-lg h-[10vh] flex flex-col justify-center px-20 '>
      <ul className='flex items-center gap-10'>
        {userLoggedIn ? (
          <>
            {JSON.parse(localStorage.getItem('user')) ||
            currentUser.photoURL ? (
              <div className='flex items-center gap-5'>
                <img
                  className='rounded-full w-12 h-12 border-2 border-primary-400'
                  src={
                    JSON.parse(localStorage.getItem('user')).userAvatar ||
                    currentUser?.photoURL
                  }
                  alt='user_pic'
                />
                <p className='mr-auto text-base font-base tracking-wider  text-shadow-md text-shadow-primary-400'>
                  {JSON.parse(localStorage.getItem('user')).userName ||
                    currentUser.displayName}
                </p>
              </div>
            ) : (
              <RotateSpinner size={40} color={'#000'} />
            )}
          </>
        ) : (
          <Link
            className='mr-auto text-xl bg-primary-500 py-1 px-8  rounded-lg relative hover:scale-110 transition-transform shadow-md cursor-pointer shadow-primary-500 text-white'
            to='/'
          >
            Sheesh Chat
            <div className='absolute bottom-0 left-0 border-[12px] border-transparent border-l-primary-500 bg-transparent translate-y-2'></div>
          </Link>
        )}
        {!userLoggedIn ? (
          <>
            <Link
              className='bg-primary-500 py-2 px-5  border-2 border-primary-500 rounded-md  hover:scale-105 transition-all shadow-md shadow-primary-500 text-white'
              to='./signup'
            >
              Sign Up
            </Link>
            <Link
              className='border-primary-500 border-2 py-2 px-5 text-primary-500 dark:text-white rounded-md hover:border-2  hover:scale-105 transition-all shadow-md shadow-primary-500'
              to='./login'
            >
              Log In
            </Link>
          </>
        ) : (
          <button
            onClick={logout}
            className='border-primary-500 border-2 py-2 px-5  rounded-md hover:border-2 hover:bg-primary-500 text-primary-500 dark:text-white hover:text-primary-white hover:scale-105 transition-all ml-auto shadow-md shadow-primary-500'
          >
            Log Out
          </button>
        )}
        {theme === 'light' ? (
          <div
            className='cursor-pointer p-2 hover:scale-125 transition-transform text-primary-500 dark:text-white'
            onClick={toggleTheme}
          >
            <MoonIcon className={'w-10 hover:fill-primary-500'} />
          </div>
        ) : (
          <div
            className='cursor-pointer p-2 hover:scale-125 transition-transform text-primary-500 dark:text-white'
            onClick={toggleTheme}
          >
            <SunIcon className={'w-10 hover:fill-primary-500'} />
          </div>
        )}
      </ul>
    </nav>
  )
}

export default Nav
