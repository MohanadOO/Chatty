import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Nav from '../components/Nav'

import { motion } from 'framer-motion'
import {
  sectionElement,
  sectionVariantLeft,
  sectionVariantRight,
  chatMessageLeft,
  chatMessageRight,
  chatBoxVariant,
  signUpButton,
} from '../Variants'

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
    <div className='flex flex-col dark:text-white text-black transition-colors px-5 md:px-10 xl:px-44 overflow-hidden'>
      <Nav defaultTheme={localStorage.theme} socket={socket} />
      <hr className='border-2 border-b-purple-700/80 border-transparent rounded-lg mt-2' />
      <motion.section
        variants={sectionVariantLeft}
        initial='initial'
        whileInView='animate'
        viewport={{ once: true }}
        className='flex flex-col md:flex-row items-center justify-around my-20'
        id='welcome_section'
      >
        <div className='max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl text-center md:text-left'>
          <motion.h1
            variants={sectionElement}
            className='text-5xl lg:text-6xl xl:text-7xl mb-5 first-letter:text-purple-800'
          >
            Welcome To Chatty
          </motion.h1>
          <motion.p
            variants={sectionElement}
            className='text-base xl:text-lg text-gray-700 dark:text-gray-300 max-w-sm xl:max-w-md mb-5'
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates,
            quisquam autem molestias praesentium nemo doloribus?
          </motion.p>
        </div>
        <motion.img
          animate={{ scale: 1.1 }}
          transition={{
            repeat: Infinity,
            duration: 2.2,
            ease: 'easeInOut',
            repeatType: 'reverse',
          }}
          className='max-w-sm md:max-w-md lg:max-w-lg'
          src='./welcome-illustration.svg'
          alt='welcome_illustration'
        />
      </motion.section>

      <motion.section
        variants={sectionVariantRight}
        viewport={{ once: true, margin: '-100px' }}
        initial='initial'
        whileInView='animate'
        className='flex flex-col md:flex-row items-center justify-around my-20'
        id='welcome_section'
      >
        <motion.img
          animate={{ scale: 1.1 }}
          transition={{
            repeat: Infinity,
            duration: 2.2,
            ease: 'easeInOut',
            repeatType: 'reverse',
          }}
          className='max-w-sm md:max-w-md lg:max-w-lg'
          src='./what-illustration.svg'
          alt='what_illustration'
        />
        <div className='max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl text-center md:text-left'>
          <motion.h1
            variants={sectionElement}
            className='text-5xl lg:text-6xl xl:text-7xl mb-5 first-letter:text-purple-800'
          >
            What is Chatty
          </motion.h1>
          <motion.p
            variants={sectionElement}
            className='text-base xl:text-lg text-gray-700 dark:text-gray-300 max-w-sm xl:max-w-md mb-5'
          >
            Chatty is a Chat Application where you can create a room, join other
            rooms and add your friends and start Chatting!
          </motion.p>
        </div>
      </motion.section>

      <motion.section
        variants={chatBoxVariant}
        initial='initial'
        whileInView='animate'
        className='flex items-center justify-around my-20'
        id='chat_section'
      >
        <div className='flex flex-col gap-5 border-2 border-black/30 dark:border-white/50 px-4 md:px-10 py-5 rounded-lg shadow-xl max-w-6xl w-full'>
          <MohanadMessage text={'Welcome to my Chat Application 🙋‍♀️👋'} />
          <VisitorMessage text={'What Can I do in this App?'} />
          <MohanadMessage
            text={'You can add friends or enter a room and start chatting!'}
          />
          <MohanadMessage text={'Sign Up Now and try it Out !'} />
          <div className='flex justify-center gap-5 border-t-2'>
            <Link to='/signup'>
              <motion.button
                className='bg-purple-600 text-xs md:text-base py-2 px-3  md:px-5 mt-5 mb-3 rounded-md text-white'
                variants={signUpButton}
              >
                Sign Up
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.section>
      <a
        className='text-xs mb-12 inline-block w-[200px] font-bold first-letter:text-lg underline first-letter:no-underline'
        target='_blank'
        href='https://storyset.com/online'
      >
        Online illustrations by Storyset
      </a>
    </div>
  )
}

function MohanadMessage({ text }) {
  return (
    <>
      <motion.div
        variants={chatMessageRight}
        className='flex gap-3 justify-end w-full'
      >
        <div className='flex flex-col'>
          <p className='text-xs sm:text-sm md:text-md text-right mb-1 font-bold'>
            Mohanad
          </p>
          <p className='inline-block bg-purple-600 text-white py-2 max-w-sm mb-2 pr-6 pl-3 text-md rounded-xl rounded-tr-none break-words shadow-sm  text-xs md:text-base font-medium'>
            {text}
          </p>
        </div>
        <div className='rounded-md w-6 h-6 md:w-7 md:h-7 self-start bg-purple-700 text-white flex justify-center items-center'>
          M
        </div>
      </motion.div>
    </>
  )
}

function VisitorMessage({ text }) {
  return (
    <>
      <motion.div
        variants={chatMessageLeft}
        className='flex gap-3 justify-start w-full'
      >
        <div className='rounded-md w-6 h-6 md:w-7 md:h-7 self-start bg-gray-600 text-white flex justify-center items-center'>
          V
        </div>
        <div>
          <p className='text-xs sm:text-sm md:text-md mb-1 font-bold'>
            Visitor
          </p>
          <p className='inline-block bg-gray-400 text-white py-2 max-w-sm mb-2 pr-6 pl-3 rounded-xl rounded-tl-none break-words shadow-sm  text-xs md:text-base font-medium'>
            {text}
          </p>
        </div>
      </motion.div>
    </>
  )
}

export default Home
