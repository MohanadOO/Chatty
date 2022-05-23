import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { UserContext } from '../Context/UserContext'
import { signOut } from 'firebase/auth'
import { auth, useAuth } from '../Firebase'
import { RotateSpinner } from 'react-spinners-kit'

function Nav() {
  const currentUser = useAuth()
  const { userLoggedIn, setUserLoggedIn } = useContext(UserContext)
  const logout = async () => {
    await signOut(auth)
    localStorage.setItem('loggedIn', false)
    setUserLoggedIn(false)
  }

  return (
    <nav className='text-primary-500  w-full top-0 text-lg px-20 h-[15vh]'>
      <ul className='flex items-center p-5 gap-5'>
        {userLoggedIn ? (
          <>
            {currentUser.photoURL ? (
              <>
                <img
                  className='rounded-full w-10 h-10'
                  src={currentUser.photoURL}
                  alt='user_pic'
                />
                <p className='text-black  mr-auto text-base font-semibold tracking-wider'>
                  {currentUser.displayName}
                </p>
              </>
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
      </ul>
    </nav>
  )
}

export default Nav
