import { useContext, useEffect, useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FillEye, FillEyeInvisible, GoogleIcon } from '../components/Icons'
import { UserContext } from '../Context/UserContext'

import { motion } from 'framer-motion'
import {
  fadeInLeftChild,
  fadeInLeft,
  buttonVariant,
  fadeInParent,
} from '../Variants'

function Signup() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { setUserLoggedIn, userLoggedIn } = useContext(UserContext)
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
    const { auth, db } = await import('../Firebase')
    const { getAuth, createUserWithEmailAndPassword, updateProfile } =
      await import('firebase/auth')
    const { doc, setDoc } = await import('firebase/firestore')

    const currentUser = getAuth()

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
          friends: [],
        })
      }
      getData().catch((error) => {
        console.error(error)
      })
      localStorage.setItem('loggedIn', true)
      localStorage.setItem(
        'user',
        JSON.stringify({
          userName: currentUser.currentUser.displayName,
          userAvatar: currentUser.currentUser.photoURL,
        })
      )
      setUserLoggedIn(true)
      navigate('/chat', { replace: true })
    } catch (error) {
      toast.error(<b>This email is used</b>)
      console.error(error.message)
    }
  }

  async function handleGoogleSignUp() {
    const { signInWithGoogle, db } = await import('../Firebase')
    const { getAuth } = await import('firebase/auth')
    const { getDoc, doc, setDoc } = await import('firebase/firestore')

    const currentUser = getAuth()

    toast
      .promise(signInWithGoogle(), {
        loading: <b>Signing With Google..</b>,
        success: <b>Sign success 👋</b>,
        error: <b>Try Again</b>,
      })
      .then(() => {
        const getData = async () => {
          const docRef = doc(db, 'users', currentUser.currentUser.uid)
          const docSnap = await getDoc(docRef)

          if (!docSnap.exists()) {
            await setDoc(doc(db, 'users', currentUser.currentUser.uid), {
              name: currentUser.currentUser.displayName,
              profilePicture: currentUser.currentUser.photoURL,
              rooms: [],
              friends: [],
            })
          }
        }
        localStorage.setItem('loggedIn', true)
        localStorage.setItem(
          'user',
          JSON.stringify({
            userName: currentUser.currentUser.displayName,
            userAvatar: currentUser.currentUser.photoURL,
          })
        )
        setUserLoggedIn(true)
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
      toast.error((t) => (
        <span className='font-semibold'>Password not match!</span>
      ))
    }
  }

  function handleError(field) {
    return toast.error((t) => (
      <>
        {field === 'Username' ? (
          <span className='font-bold'>
            Username must be 5 characters or more
          </span>
        ) : (
          <span className='font-bold'>
            Password must be 7 characters or more
          </span>
        )}
      </>
    ))
  }

  return (
    <div className='flex justify-center items-center h-[85vh]'>
      {userLoggedIn && <Navigate to='/chat' replace />}
      {errors.password ? handleError('Password') : null}
      {errors.username ? handleError('Username') : null}
      <div className=' px-2 py-7  max-w-sm md:max-w-[750px] w-full rounded-md shadow-lg  dark:shadow-white/20 flex flex-col'>
        <h1 className='text-2xl md:text-4xl text-center my-5'>Sign Up</h1>
        <motion.div
          variants={buttonVariant}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          onClick={handleGoogleSignUp}
          className='flex items-center justify-center gap-3 text-sm md:text-base p-2 mb-5 bg-black/5 dark:bg-white dark:text-black w-[200px] md:w-[250px] rounded-md self-center shadow-sm cursor-pointer hover:shadow-md transition-shadow'
        >
          <GoogleIcon width={20} height={20} />
          <button>Sign Up with Google</button>
        </motion.div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-col md:flex-row justify-around items-center'
        >
          <motion.div
            variants={fadeInParent}
            className='flex flex-col gap-2'
            initial='initial'
            animate='animate'
          >
            <label htmlFor='username'>Username</label>
            <motion.div
              variants={fadeInLeft}
              initial='initial'
              animate='animate'
            >
              <input
                {...register('username', { required: true, minLength: 5 })}
                className='w-[250px] md:w-[350px] p-2 bg-purple-600 text-white rounded-md'
                type='text'
                name='username'
              />
            </motion.div>
            <label htmlFor='email'>Email</label>
            <motion.div
              variants={fadeInLeft}
              initial='initial'
              animate='animate'
              transition={{ delay: 0.2 }}
            >
              <input
                variants={fadeInLeftChild}
                type='email'
                name='email'
                {...register('email', { required: true })}
                className='w-[250px] md:w-[350px] p-2 bg-purple-600 text-white rounded-md'
              />
            </motion.div>
            <label htmlFor='password'>Password</label>
            <div className='relative'>
              <motion.div
                variants={fadeInLeft}
                initial='initial'
                animate='animate'
                transition={{ delay: 0.4 }}
              >
                <input
                  variants={fadeInLeftChild}
                  {...register('password', { required: true, minLength: 7 })}
                  className='w-[250px] md:w-[350px] p-2 bg-purple-600 text-white rounded-md'
                  type='password'
                  name='password'
                  id='password'
                />
              </motion.div>
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
            <motion.div
              variants={fadeInLeft}
              initial='initial'
              animate='animate'
              transition={{ delay: 0.6 }}
              className='relative'
            >
              <input
                {...register('confirm_password', {
                  required: true,
                  minLength: 7,
                })}
                className='w-[250px] md:w-[350px] p-2 bg-purple-600 text-white rounded-md'
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
            </motion.div>
          </motion.div>
          <motion.div
            variants={fadeInParent}
            initial='initial'
            animate='animate'
            className='mt-8 w-[220px] flex items-center justify-center md:flex-col gap-5'
          >
            <motion.input
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              type='submit'
              value='Sign Up'
              className='bg-purple-700 font-semibold p-2 text-white rounded-md shadow-lg w-[220px] self-center text-xl cursor-pointer hover:scale-105 transition-transform'
            />
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => navigate('/login')}
              className='text-purple-700 font-semibold bg-white  p-2 rounded-md shadow-lg w-[220px] text-center text-xl hover:scale-105 transition-transform'
            >
              Log In
            </motion.button>
          </motion.div>
        </form>
      </div>
    </div>
  )
}

export default Signup
