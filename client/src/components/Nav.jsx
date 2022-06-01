import { Link } from 'react-router-dom'
import { useContext, useState } from 'react'
import { UserContext } from '../Context/UserContext'
import { signOut } from 'firebase/auth'
import { auth, useAuth } from '../Firebase'
import { RotateSpinner } from 'react-spinners-kit'
import { MoonIcon, SunIcon } from '../components/Icons'

function Nav({ defaultTheme }) {
  const currentUser = useAuth()
  const { userLoggedIn, setUserLoggedIn } = useContext(UserContext)
  const [theme, setTheme] = useState(defaultTheme)
  const logout = async () => {
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
    <nav className='text-primary-500 dark:bg-black dark:text-white w-full text-lg h-[10vh] flex flex-col justify-center px-20 '>
      <ul className='flex items-center gap-10'>
        {userLoggedIn ? (
          <>
            {JSON.parse(localStorage.getItem('user')) ||
            currentUser.photoURL ? (
              <div className='flex items-center gap-5'>
                <img
                  className='rounded-full w-10 h-10'
                  src={
                    JSON.parse(localStorage.getItem('user')).userAvatar ||
                    currentUser?.photoURL
                  }
                  alt='user_pic'
                />
                <p className='text-black  mr-auto text-base font-base tracking-wider'>
                  {JSON.parse(localStorage.getItem('user')).userName ||
                    currentUser.displayName}
                </p>
              </div>
            ) : (
              <RotateSpinner size={40} color={'#000'} />
            )}
          </>
        ) : (
          <h2 className='mr-auto text-xl'>Chat App</h2>
        )}
        {!userLoggedIn ? (
          <>
            <Link
              className='bg-primary-500 py-2 px-5 text-white border-2 border-primary-500 rounded-md hover:bg-primary-white hover:text-primary-500 hover:scale-105 transition-all'
              to='./signup'
            >
              Sign Up
            </Link>
            <Link
              className='border-primary-500 border-2 py-2 px-5  rounded-md hover:border-2 hover:bg-primary-500 hover:text-primary-white hover:scale-105 transition-all'
              to='./login'
            >
              Log In
            </Link>
          </>
        ) : (
          <button
            onClick={logout}
            className='border-primary-500 border-2 py-2 px-5  rounded-md hover:border-2 hover:bg-primary-500 hover:text-primary-white hover:scale-105 transition-all ml-auto'
          >
            Log Out
          </button>
        )}
        {theme === 'light' ? (
          <MoonIcon
            onClick={toggleTheme}
            className={'w-8 cursor-pointer hover:fill-primary-500'}
          />
        ) : (
          <SunIcon
            onClick={toggleTheme}
            className={'w-8 cursor-pointer hover:fill-primary-500'}
          />
        )}
      </ul>
    </nav>
  )
}

export default Nav
