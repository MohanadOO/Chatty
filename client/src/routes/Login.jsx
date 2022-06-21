import { useEffect, useState, useContext } from 'react'
import { UserContext } from '../Context/UserContext'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FillEye, FillEyeInvisible, GoogleIcon } from '../components/Icons'
import { useNavigate, Navigate } from 'react-router-dom'

import { motion } from 'framer-motion'
import { fadeInParent, buttonVariant, fadeInLeft } from '../Variants'

function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const { setUserLoggedIn, userLoggedIn } = useContext(UserContext)
  const navigate = useNavigate()

  const handleShowPassword = () => {
    if (document.getElementById('loginPassword').type === 'text') {
      document.getElementById('loginPassword').type = 'password'
    } else {
      document.getElementById('loginPassword').type = 'text'
    }

    return setShowPassword((prevState) => !prevState)
  }

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

  async function onSubmit(data) {
    const { getAuth, signInWithEmailAndPassword } = await import(
      'firebase/auth'
    )
    const currentUser = getAuth()
    const { auth, db } = await import('../Firebase')
    const { getDoc, doc, setDoc } = await import('firebase/firestore')

    try {
      await signInWithEmailAndPassword(auth, data.email, data.password)

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
      getData().catch((error) => {
        console.error(error)
      })

      toast.success('You are logged in 👋')
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
      toast.error("You can't Login")
      console.error(error.message)
    }
  }

  async function handleGoogleSignIn() {
    const { getAuth } = await import('firebase/auth')
    const currentUser = getAuth()
    const { db, signInWithGoogle } = await import('../Firebase')
    const { getDoc, doc, setDoc } = await import('firebase/firestore')

    toast
      .promise(signInWithGoogle(), {
        loading: <b>Log In With Google..</b>,
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
      })
      .catch((error) => {
        console.error(error.message)
        return 'error'
      })
  }

  function handleError(field) {
    return toast.error(() => (
      <>
        {field === 'email' ? (
          <span className='font-semibold'>Wrong Email</span>
        ) : (
          <span className='font-semibold'>
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
      <div className='max-w-sm md:max-w-[550px] w-full py-10 px-32 rounded-md shadow-lg dark:shadow-white/20 flex flex-col items-center'>
        <h1 className='text-2xl md:text-4xl text-center mb-5 underline-offset-2'>
          Log In
        </h1>
        <motion.div
          variants={buttonVariant}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          onClick={handleGoogleSignIn}
          className='flex items-center justify-center gap-3 text-base p-2 bg-black/5 dark:bg-white dark:text-black w-[250px] rounded-md self-center shadow-sm cursor-pointer hover:shadow-md transition-shadow mb-5'
        >
          <GoogleIcon width={20} height={20} />
          <button>Sign in with Google</button>
        </motion.div>
        <form
          variants={fadeInParent}
          initial='initial'
          animate='animate'
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-col gap-5'
        >
          <label className='text-lg' htmlFor='email'>
            Email
          </label>
          <motion.div variants={fadeInLeft} initial='initial' animate='animate'>
            <input
              {...register('email', { required: true })}
              className='w-[250px] md:w-[350px] text-white p-2 bg-purple-600 rounded-md '
              type='email'
              name='email'
            />
          </motion.div>
          <label className='text-lg' htmlFor='password'>
            Password
          </label>
          <motion.div
            variants={fadeInLeft}
            initial='initial'
            animate='animate'
            transition={{ delay: 0.2 }}
            className='relative'
          >
            <input
              {...register('password', { required: true, minLength: 7 })}
              className='w-[250px] md:w-[350px] text-white p-2 bg-purple-600 rounded-md'
              type='password'
              id='loginPassword'
            />
            <div
              onClick={handleShowPassword}
              className='absolute top-[50%] translate-y-[-50%] right-5 cursor-pointer'
            >
              {!showPassword ? (
                <FillEye width={20} height={20} color='white' />
              ) : (
                <FillEyeInvisible width={20} height={20} color='white' />
              )}
            </div>
          </motion.div>

          <motion.input
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            type='submit'
            value='Log In'
            className='bg-purple-700 text-white p-2 my-5 rounded-md shadow-lg w-[220px] self-center text-xl cursor-pointer font-semibold hover:scale-105 transition-transform'
          />
        </form>
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ease: 'linear', duration: 1.3 }}
          onClick={() => navigate('/signup')}
          className='text-purple-700 bg-white border-2 p-2 rounded-md shadow-lg w-[220px] text-center text-xl font-semibold hover:scale-105 transition-transform'
        >
          Sign Up
        </motion.button>
      </div>
    </div>
  )
}

export default Login
