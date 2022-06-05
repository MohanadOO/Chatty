import { useEffect, useState, useContext } from 'react'
import { UserContext } from '../Context/UserContext'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FillEye, FillEyeInvisible, GoogleIcon } from '../components/Icons'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const { setUserLoggedIn } = useContext(UserContext)
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

        if (docSnap.exists()) {
          console.log('Logged In')
        } else {
          await setDoc(doc(db, 'users', currentUser.currentUser.uid), {
            name: currentUser.currentUser.displayName,
            profilePicture: currentUser.currentUser.photoURL,
            rooms: [],
            friends: [],
          })
          console.log('Create Document')
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

          if (docSnap.exists()) {
            console.log('Logged In')
          } else {
            await setDoc(doc(db, 'users', currentUser.currentUser.uid), {
              name: currentUser.currentUser.displayName,
              profilePicture: currentUser.currentUser.photoURL,
              rooms: [],
              friends: [],
            })
            console.log('Create Document')
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
    return toast.error(
      (t) => (
        <>
          {field === 'email' ? (
            <span className='error_msg'>Wrong Email</span>
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
      <div className=' border-2 border-primary-500   max-w-[550px] w-full py-10 px-32 rounded-md shadow-lg flex flex-col items-center absolute top-[50%] -translate-y-[50%]'>
        <h1 className='text-center mb-5 underline-offset-2'>Log In</h1>
        <div
          onClick={handleGoogleSignIn}
          className=' /60 flex items-center justify-center gap-3 text-base p-2 bg-black/5 dark:bg-white dark:text-black w-[250px] rounded-md self-center shadow-sm cursor-pointer hover:shadow-md transition-shadow mb-5'
        >
          <GoogleIcon width={20} height={20} />
          <button>Sign in with Google</button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
          <label className='text-lg' htmlFor='email'>
            Email
          </label>
          <input
            {...register('email', { required: true })}
            className='w-[350px] text-primary-white p-2 bg-primary-400 rounded-md '
            type='email'
            name='email'
          />
          <label className='text-lg' htmlFor='password'>
            Password
          </label>
          <div className='relative'>
            <input
              {...register('password', { required: true, minLength: 7 })}
              className='w-[350px] text-primary-white p-2 bg-primary-400 rounded-md'
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
          </div>

          <input
            type='submit'
            value='Log In'
            // onClick={toast.dismiss()}
            className='bg-primary-500 text-primary-text p-2 my-5 rounded-md shadow-lg w-[220px] self-center text-xl cursor-pointer font-semibold hover:scale-105 transition-transform'
          />
        </form>
        <button
          onClick={() => navigate('/signup')}
          className='text-primary-500 bg-primary-50 border-2 p-2 rounded-md shadow-lg w-[220px] text-center text-xl font-semibold hover:scale-105 transition-transform'
        >
          Sign Up
        </button>
      </div>
    </div>
  )
}

export default Login
