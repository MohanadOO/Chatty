import { Menu } from '@headlessui/react'
import { Link, useLocation } from 'react-router-dom'
import { useContext, useState } from 'react'
import { UserContext } from '../Context/UserContext'
import { auth, useAuth } from '../Firebase'
import { RotateSpinner } from 'react-spinners-kit'
import { LogoutIcon, MoonIcon, SunIcon } from '../components/Icons'
import { HomeIcon, ChatIcon } from '@heroicons/react/solid'

function Nav({ defaultTheme, socket }) {
  const location = useLocation()
  const currentUser = useAuth()
  const { userLoggedIn, setUserLoggedIn } = useContext(UserContext)
  const [theme, setTheme] = useState(defaultTheme)
  const [imageError, setImageError] = useState(false)
  const logout = async () => {
    const { signOut } = await import('firebase/auth')
    await signOut(auth)
    localStorage.setItem('loggedIn', false)
    localStorage.removeItem('users_info')
    localStorage.removeItem('rooms_messages')
    setUserLoggedIn(false)
    socket.emit('logout')
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

  function handleImageError() {
    setImageError(true)
  }

  return (
    <nav className='dark:bg-zinc-900 w-full text-lg h-[10vh] flex flex-col justify-center px-10'>
      <ul className='flex gap-5 items-center'>
        {userLoggedIn || currentUser ? (
          <>
            {JSON.parse(localStorage.getItem('user')) ||
            currentUser.photoURL ? (
              <>
                <>
                  <Link
                    className={`${
                      location.pathname == '/'
                        ? 'cursor-default '
                        : 'hover:scale-110 transition-transform '
                    } flex items-center gap-2 py-3 px-7 bg-purple-600 text-white rounded-full text-sm`}
                    to='/'
                  >
                    {location.pathname == '/' && 'Home'}
                    <HomeIcon className='w-5 h-5' />
                  </Link>
                  <Link
                    className={`${
                      location.pathname == '/chat'
                        ? 'cursor-default '
                        : 'hover:scale-110 transition-transform '
                    } flex items-center gap-2 py-3 px-7 bg-purple-600 text-white rounded-full text-sm mx-auto`}
                    to='/chat'
                  >
                    {location.pathname == '/chat' && 'Chat'}
                    <ChatIcon className='w-5 h-5' />
                  </Link>
                  <UserImage
                    currentUser={currentUser}
                    handleImageError={handleImageError}
                    logout={logout}
                    imageError={imageError}
                    theme={theme}
                  />

                  {theme === 'light' ? (
                    <li
                      className='cursor-pointer hover:scale-125 transition-transform text-purple-700 dark:text-white'
                      onClick={toggleTheme}
                    >
                      <MoonIcon className={'w-8 hover:fill-purple-700'} />
                    </li>
                  ) : (
                    <li
                      className='cursor-pointer hover:scale-125 transition-transform text-purple-700 dark:text-white'
                      onClick={toggleTheme}
                    >
                      <SunIcon className={'w-8 hover:fill-purple-700'} />
                    </li>
                  )}
                </>
              </>
            ) : (
              <RotateSpinner size={40} color={'#000'} />
            )}
          </>
        ) : (
          <Link
            className='mr-auto text-xl bg-purple-700 py-1 px-8  rounded-lg relative hover:scale-110 transition-transform shadow-md cursor-pointer text-white'
            to='/'
          >
            Chatter
            <div className='absolute bottom-0 left-0 border-[12px] border-transparent border-l-purple-700 bg-transparent translate-y-2'></div>
          </Link>
        )}
        {currentUser == null ? (
          <>
            <Link
              className='bg-purple-700 py-2 px-5  border-2 border-purple-700 rounded-md  hover:scale-105 transition-all shadow-md  text-white'
              to='./signup'
            >
              Sign Up
            </Link>
            <Link
              className='border-purple-700 border-2 py-2 px-5 text-purple-700 dark:text-white rounded-md hover:border-2  hover:scale-105 transition-all shadow-md '
              to='./login'
            >
              Log In
            </Link>
            {theme === 'light' ? (
              <li
                className='ml-10 cursor-pointer hover:scale-125 transition-transform text-purple-700 dark:text-white'
                onClick={toggleTheme}
              >
                <MoonIcon className={'w-10 hover:fill-purple-700'} />
              </li>
            ) : (
              <li
                className='ml-10 cursor-pointer hover:scale-125 transition-transform text-purple-700 dark:text-white'
                onClick={toggleTheme}
              >
                <SunIcon className={'w-10 hover:fill-purple-700'} />
              </li>
            )}
          </>
        ) : (
          ''
        )}
      </ul>
    </nav>
  )
}

function UserImage({
  currentUser,
  handleImageError,
  logout,
  imageError,
  theme,
}) {
  return (
    <Menu as='div' className='relative flex'>
      <Menu.Button>
        {imageError ? (
          <span className='inline-block h-[2.875rem] w-[2.875rem] bg-gray-100 rounded-full overflow-hidden ring-green-400 ring-2 active:ring-4 transition-all'>
            <svg
              className='h-full w-full text-gray-300 dark:text-gray-100 dark:bg-gray-800'
              width='16'
              height='16'
              viewBox='0 0 16 16'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              {theme === 'light' ? (
                <rect
                  x='0.62854'
                  y='0.359985'
                  width='15'
                  height='15'
                  rx='7.5'
                  fill='white'
                />
              ) : (
                <rect
                  x='0.62854'
                  y='0.359985'
                  width='15'
                  height='15'
                  rx='7.5'
                  fill='black'
                />
              )}
              <path
                d='M8.12421 7.20374C9.21151 7.20374 10.093 6.32229 10.093 5.23499C10.093 4.14767 9.21151 3.26624 8.12421 3.26624C7.0369 3.26624 6.15546 4.14767 6.15546 5.23499C6.15546 6.32229 7.0369 7.20374 8.12421 7.20374Z'
                fill='currentColor'
              />
              <path
                d='M11.818 10.5975C10.2992 12.6412 7.42106 13.0631 5.37731 11.5537C5.01171 11.2818 4.69296 10.9631 4.42107 10.5975C4.28982 10.4006 4.27107 10.1475 4.37419 9.94123L4.51482 9.65059C4.84296 8.95684 5.53671 8.51624 6.30546 8.51624H9.95231C10.7023 8.51624 11.3867 8.94749 11.7242 9.62249L11.8742 9.93184C11.968 10.1475 11.9586 10.4006 11.818 10.5975Z'
                fill='currentColor'
              />
            </svg>
          </span>
        ) : (
          <>
            <img
              className='rounded-full w-10 h-10 ring-green-400 ring-2 active:ring-4 transition-all'
              onError={handleImageError}
              src={
                JSON.parse(localStorage.getItem('user'))?.userAvatar ||
                currentUser?.photoURL
              }
              alt='user_pic'
            />
            <span className='bg-green-400 bottom-0 left-7  absolute w-[10px] h-[10px] border-2 border-white dark:border-gray-800 rounded-full'></span>
          </>
        )}
      </Menu.Button>
      <Menu.Items className='absolute z-20 right-0 mt-12 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-left'>
        <div className='px-1 py-1 '>
          <Menu.Item>
            <div class='py-3 px-4'>
              <span class='block text-sm text-gray-900'>
                {currentUser?.displayName}
              </span>
              <span class='block text-sm font-medium text-gray-500 truncate dark:text-gray-400'>
                {currentUser?.email}
              </span>
            </div>
          </Menu.Item>
        </div>
        {/* <div className='px-5 py-1'>
          <Menu.Item>
            {({ active }) => (
              <button>
                <span className=''>Change State</span>
              </button>
            )}
          </Menu.Item>
        </div> */}
        <div className='px-1 py-1 '>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={logout}
                className={`${
                  active ? 'bg-violet-500 text-white' : 'text-gray-900'
                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
              >
                <LogoutIcon className={'mr-2 w-5 h-5'} aria-hidden='true' />
                Log Out
              </button>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    </Menu>
  )
}

export default Nav
