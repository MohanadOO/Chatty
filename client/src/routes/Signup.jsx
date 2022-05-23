import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FillEye, FillEyeInvisible, GoogleIcon } from '../components/Icons'
import { signInWithGoogle } from '../Firebase'
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from 'firebase/auth'
import { auth, db } from '../Firebase'
import { UserContext } from '../Context/UserContext'
import { getDoc, doc, setDoc } from 'firebase/firestore'

function Signup() {
  const currentUser = getAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { setUserLoggedIn } = useContext(UserContext)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
    reset,
  } = useForm()

  useEffect(() => {
    reset({
      keepIsSubmitted: false,
    })
  }, [isSubmitted])

  function handleShowPassword(input) {
    if (input === 'password') {
      if (document.getElementById('password').type === 'text') {
        document.getElementById('password').type = 'password'
      } else {
        document.getElementById('password').type = 'text'
      }
      return setShowPassword((prevState) => !prevState)
    } else if (input === 'confirm_password') {
      if (document.getElementById('confirm_password').type === 'text') {
        document.getElementById('confirm_password').type = 'password'
      } else {
        document.getElementById('confirm_password').type = 'text'
      }
      return setShowConfirmPassword((prevState) => !prevState)
    }
  }

  async function registerUser(data) {
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      )
      await updateProfile(user.user, {
        displayName: data.username,
        photoURL: `https://ui-avatars.com/api/?name=${
          data.username.split(' ')[0]
        }&background=random`,
      })

      const getData = async () => {
        await setDoc(doc(db, 'users', currentUser.currentUser.uid), {
          name: currentUser.currentUser.displayName,
          profilePicture: currentUser.currentUser.photoURL,
          rooms: [],
        })
      }
      getData().catch((error) => {
        console.error(error)
      })
      localStorage.setItem('loggedIn', true)
      setUserLoggedIn(true)
      navigate('/chat', { replace: true })
    } catch (error) {
      toast.error(<b>This email is used</b>)
      console.error(error.message)
    }
  }

  function handleGoogleSignUp() {
    toast
      .promise(signInWithGoogle(), {
        loading: <b>Signing With Google..</b>,
        success: <b>Sign success 👋</b>,
        error: <b>Try Again</b>,
      })
      .then(() => {
        localStorage.setItem('loggedIn', true)
        setUserLoggedIn(true)

        const getData = async () => {
          const docRef = doc(db, 'users', currentUser.currentUser.uid)
          const docSnap = await getDoc(docRef)

          if (docSnap.exists()) {
            console.log('Document data:', docSnap.data())
          } else {
            await setDoc(doc(db, 'users', currentUser.currentUser.uid), {
              name: currentUser.currentUser.displayName,
              profilePicture: currentUser.currentUser.photoURL,
              rooms: [],
            })
          }
        }
        getData().catch((error) => {
          console.error(error)
        })
        navigate('/chat', { replace: true })
      })
      .catch((error) => {
        console.error(error.message)
        return 'error'
      })
  }

  function onSubmit(data) {
    if (data.password === data.confirm_password) {
      registerUser(data)
    } else {
      toast.error(
        (t) => <span className='error_msg'>Password not match!</span>,
        {
          style: {
            backgroundColor: '#5447BD',
          },
        }
      )
    }
  }

  function handleError(field) {
    return toast.error(
      (t) => (
        <>
          {field === 'Username' ? (
            <span className='error_msg'>
              Username must be 5 characters or more
            </span>
          ) : (
            <span className='error_msg'>
              Password must be 7 characters or more
            </span>
          )}
        </>
      ),
      {
        style: {
          backgroundColor: '#5447BD',
        },
      }
    )
  }

  return (
    <div className='flex justify-center items-center'>
      {errors.password ? handleError('Password') : null}
      {errors.username ? handleError('Username') : null}
      <div className='border-2 border-primary-500/90  py-16 px-2 max-w-[750px]  absolute top-[50%] -translate-y-[50%] w-full rounded-md shadow-lg flex flex-col  '>
        <h1 className='text-center mb-5'>Sign Up</h1>
        <div
          onClick={handleGoogleSignUp}
          className=' /60 flex items-center justify-center gap-3 text-base p-2 bg-white w-[250px] rounded-md self-center shadow-sm cursor-pointer hover:shadow-md transition-shadow'
        >
          <GoogleIcon width={20} height={20} />
          <button>Sign Up with Google</button>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex justify-around items-center'
        >
          <div className='flex flex-col gap-2'>
            <label htmlFor='username'>Username</label>
            <input
              {...register('username', { required: true, minLength: 5 })}
              className='w-[350px] p-2 bg-primary-400 text-primary-white'
              type='text'
              name='username'
            />
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              name='email'
              {...register('email', { required: true })}
              className='w-[350px] p-2 bg-primary-400 text-primary-white'
            />
            <label htmlFor='password'>Password</label>
            <div className='relative'>
              <input
                {...register('password', { required: true, minLength: 7 })}
                className='w-[350px] p-2 bg-primary-400 text-primary-white'
                type='password'
                name='password'
                id='password'
              />
              <div
                onClick={() => handleShowPassword('password')}
                className='absolute top-[50%] translate-y-[-50%] right-5 cursor-pointer'
              >
                {!showPassword ? (
                  <FillEye width={20} height={20} color='white' />
                ) : (
                  <FillEyeInvisible width={20} height={20} color='white' />
                )}
              </div>
            </div>

            <label htmlFor='password'>Confirm Password</label>
            <div className='relative'>
              <input
                {...register('confirm_password', {
                  required: true,
                  minLength: 7,
                })}
                className='w-[350px] p-2 bg-primary-400 text-primary-white'
                type='password'
                name='confirm_password'
                id='confirm_password'
              />
              <div
                onClick={() => handleShowPassword('confirm_password')}
                className='absolute top-[50%] translate-y-[-50%] right-5 cursor-pointer'
              >
                {!showConfirmPassword ? (
                  <FillEye width={20} height={20} color='white' />
                ) : (
                  <FillEyeInvisible width={20} height={20} color='white' />
                )}
              </div>
            </div>
          </div>
          <div className='mt-8 w-[220px]'>
            <input
              type='submit'
              value='Sign Up'
              className='bg-primary-500 font-semibold p-2 text-primary-text mb-5 rounded-md shadow-lg w-[220px] self-center text-xl cursor-pointer hover:scale-105 transition-transform'
            />
            <button
              onClick={() => navigate('/login')}
              className='text-primary-500 font-semibold bg-primary-50 border-2 p-2 rounded-md shadow-lg w-[220px] text-center text-xl hover:scale-105 transition-transform'
            >
              Log In
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Signup
