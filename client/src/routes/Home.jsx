import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Nav from '../components/Nav'

function Home({ socket }) {
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
    <div className='flex flex-col dark:text-white text-black transition-colors px-5 md:px-10 xl:px-44'>
      <Nav defaultTheme={localStorage.theme} socket={socket} />
      <hr className='border-2 border-b-purple-700/80 border-transparent rounded-lg mt-2' />
      <section
        className='flex flex-col md:flex-row items-center justify-around h-screen'
        id='welcome_section'
      >
        <div className='max-w-xs md:max-w-lg'>
          <h1 className='text-5xl md:text-6xl mb-5 font-[Italina] first-letter:text-purple-800'>
            Welcome To Chatty
          </h1>
          <p className='text-base max-w-sm font-[Italina]'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates,
            quisquam autem molestias praesentium nemo doloribus?
          </p>
        </div>
        <img
          className='max-w-xs md:max-w-lg'
          src='./welcome-illustration.svg'
          alt='welcome_illustration'
        />
      </section>

      <section
        className='flex flex-col md:flex-row items-center justify-around h-screen'
        id='welcome_section'
      >
        <img
          className='max-w-xs md:max-w-lg'
          src='./what-illustration.svg'
          alt='what_illustration'
        />
        <div className='max-w-xs md:max-w-lg'>
          <h1 className='text-5xl md:text-6xl mb-5 font-[Italina] first-letter:text-purple-800'>
            What is Chatty 💭
          </h1>
          <p className='text-base max-w-sm font-[Italina]'>
            Chatty is a Chat Application where you can create a room, join other
            rooms and add your friends and start Chatting!
          </p>
        </div>
      </section>

      <section
        className='flex items-center justify-around my-auto h-screen'
        id='chat_section'
      >
        <div className='flex flex-col gap-5 border-2 border-purple-300/20 px-5 py-5 rounded-lg shadow-xl max-w-6xl w-full'>
          <MohanadMessage text={'Welcome to my Chat Application 🙋‍♀️👋'} />
          <VisitorMessage text={'What Can I do in this App?'} />
          <MohanadMessage
            text={'You can add friends or enter a room and start chatting!'}
          />
          <MohanadMessage text={'Sign Up Now and try it Out !'} />
          <div className='flex justify-center gap-5 border-t-2'>
            <Link
              to='/signup'
              className='bg-purple-600 py-3 px-6 mt-5 rounded-md text-white hover:scale-110 transition-transform'
            >
              Sign Up
            </Link>
          </div>
        </div>
      </section>
      <a href='https://storyset.com/online'>Online illustrations by Storyset</a>
    </div>
  )
}

function MohanadMessage({ text }) {
  return (
    <>
      <div className='flex items-center gap-3 justify-end mr-5'>
        <div>
          <p className='text-sm md:text-md text-right mb-1 font-bold'>
            Mohanad
          </p>
          <p className='inline-block bg-purple-600 text-white py-2 max-w-sm mb-2 pr-6 pl-3 text-md rounded-xl rounded-tr-none break-words shadow-sm  text-xs md:text-base font-medium'>
            {text}
          </p>
        </div>
        <div className='rounded-md w-6 h-6 md:w-7 md:h-7 self-start bg-purple-700 text-white flex justify-center items-center'>
          M
        </div>
      </div>
    </>
  )
}

function VisitorMessage({ text }) {
  return (
    <>
      <div className='flex items-center gap-3 justify-start mr-5'>
        <div className='rounded-md w-6 h-6 md:w-7 md:h-7 self-start bg-gray-600 text-white flex justify-center items-center'>
          V
        </div>
        <div>
          <p className='text-sm md:text-md mb-1 font-bold'>Visitor</p>
          <p className='inline-block bg-gray-400 text-white py-2 max-w-sm mb-2 pr-6 pl-3 rounded-xl rounded-tl-none break-words shadow-sm  text-xs md:text-base font-medium'>
            {text}
          </p>
        </div>
      </div>
    </>
  )
}

export default Home
