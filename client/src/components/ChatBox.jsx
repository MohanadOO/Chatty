import { useState, useEffect, useContext, useRef } from 'react'
import { ChatContext } from '../Context/ChatContext'
import { RoomContext } from '../Context/RoomContext'
import {
  getUsersConversation,
  saveUserMessage,
  getRoomMessages,
  saveMessage,
} from '../Firebase'
import { StageSpinner } from 'react-spinners-kit'
import RoomHeader from './RoomHeader'
import { sendMessageSocket, sendUserMessageSocket } from '../SocketIo'

export function ChatBox() {
  const { socket, currentUser } = useContext(ChatContext)
  const { friend, room } = useContext(RoomContext)
  const [chat, setChat] = useState([])
  const [message, setMessage] = useState('')
  const [messageRef, setMessageRef] = useState('')
  const [showAvatar, setShowAvatar] = useState(true)
  const chatBoxScroll = useRef()

  useEffect(() => {
    if (friend) {
      getUsersConversation(currentUser, friend?.id).then((messages) => {
        setChat(() => messages.messages)
        setMessageRef(messages.id)
      })
    }
    if (room) {
      getRoomMessages(room?.id).then((messages) => {
        setChat(() => messages)
      })
    }
  }, [friend, room])

  useEffect(() => {
    if (chat) {
      if (chat[chat.length - 1]?.sender?.id === currentUser.uid) {
        setShowAvatar(false)
      } else {
        setShowAvatar(true)
      }
    }

    //Scroll into view
    chatBoxScroll.current.scrollTop = chatBoxScroll.current.scrollHeight
  }, [chat])

  const sendMessage = (e) => {
    e.preventDefault()
    if (message === '') return

    const messageDetails = {
      message: message,
      sender: { name: currentUser.displayName, id: currentUser?.uid },
      userProfile: currentUser.photoURL,
      showAvatar: showAvatar,
    }

    if (message !== '' && chat) {
      setChat((prevMessages) => {
        return [...prevMessages, messageDetails]
      })
      if (friend) {
        //Send Messages through socket
        sendUserMessageSocket(socket, messageDetails, chat, 'one-one')
      } else {
        sendMessageSocket(socket, messageDetails, chat, room)
      }
    } else {
      setChat([messageDetails])
      if (friend) {
        sendUserMessageSocket(socket, messageDetails, chat, 'one-one')
      } else {
        sendMessageSocket(socket, messageDetails, chat, room)
      }
    }

    //Resetting message state
    setMessage('')

    if (friend) {
      //save Message in the Database
      saveUserMessage(messageRef, messageDetails)
    } else {
      saveMessage(room.id, messageDetails)
    }

    setShowAvatar(false)
  }

  //Receive Message From the socket
  useEffect(() => {
    socket.on('receive_message', (payload) => {
      return setChat(() => [...payload.chat])
    })
    setShowAvatar(true)
  }, [socket])

  return (
    <div className='h-full rounded-md flex-1 flex flex-col max-w-5xl justify-between relative shadow-lg dark:shadow-primary-500'>
      <RoomHeader />
      <div
        id='chat-box'
        ref={chatBoxScroll}
        className='flex flex-col justify-start overflow-y-auto mb-[100px]  scrollbar-thin scrollbar-thumb-primary-500 scrollbar-track-slate-500 mt-5 scroll-smooth'
      >
        <>
          {!chat ? (
            <div className='absolute top-[50%] left-[50%] translate-x-[-50%]'>
              {localStorage.theme === 'dark' ? (
                <StageSpinner size={40} color={'#fff'} />
              ) : (
                <StageSpinner size={40} color={'#000'} />
              )}
            </div>
          ) : (
            chat?.map((message, index) => {
              return (
                <div className='ml-5' key={index}>
                  {message?.sender?.id === currentUser?.uid ? (
                    <div className='flex items-center'>
                      {message.showAvatar && (
                        <img
                          className='rounded-md w-6 md:w-7 self-start'
                          src={
                            JSON.parse(localStorage.getItem('user'))
                              .userAvatar || currentUser?.photoURL
                          }
                          alt='user_icon'
                        />
                      )}
                      {message.showAvatar ? (
                        <div className='ml-3'>
                          <p className='text-xs md:text-sm mb-2'>You</p>
                          <p
                            key={index}
                            className='bg-black/10 dark:bg-gray-500 py-1 max-w-sm mb-2 pr-6 pl-3 text-md rounded-xl rounded-tl-none break-words  shadow-sm dark:shadow-white border-2 dark:border-white/30 border-black/30 text-xs md:text-sm font-medium'
                          >
                            {message.message}
                          </p>
                        </div>
                      ) : (
                        <div className='ml-10'>
                          <p
                            key={index}
                            className='bg-black/10 dark:bg-gray-500 py-1 max-w-sm mb-2 pr-6 pl-3 text-md rounded-xl rounded-tl-none break-words  shadow-sm dark:shadow-white border-2 dark:border-white/30 border-black/30  text-xs md:text-sm font-medium'
                          >
                            {message.message}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      {message.showAvatar ? (
                        <div className='flex items-center gap-3 justify-end mr-5'>
                          <div>
                            <p className='text-xs md:text-sm text-right mb-2'>
                              {message.sender.name}
                            </p>
                            <p
                              key={index}
                              className='bg-primary-400 text-white py-1 max-w-sm mb-2 pr-6 pl-3 text-md rounded-xl rounded-tr-none break-words shadow-sm dark:shadow-white border-2 dark:border-white/30 border-black/30  text-xs md:text-sm font-medium'
                            >
                              {message.message}
                            </p>
                          </div>
                          <img
                            className='rounded-md w-6 md:w-7 self-start'
                            src={message.userProfile}
                            alt='user_icon'
                          />
                        </div>
                      ) : (
                        <div className='flex items-center gap-3 justify-end mr-[60px]'>
                          <div>
                            <p
                              key={index}
                              className='bg-primary-400 text-white py-1 max-w-sm mb-2 pr-6 pl-3 text-md rounded-xl rounded-tr-none break-words shadow-sm dark:shadow-white border-2 dark:border-white/30 border-black/30  text-xs md:text-sm font-medium'
                            >
                              {message.message}
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )
            })
          )}
        </>

        <form className='p-3  flex gap-2 items-center absolute bottom-0 w-full'>
          <input
            className='py-4 px-5 md:py-5 md:px-7 rounded-xl h-10 w-full bg-transparent shadow-none border-primary-400/50 border-2'
            type='text'
            placeholder='Write a Message...'
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
          <button
            className='bg-primary-400 text-white text-xs w-40 md:text-sm md:w-40 py-3 px-2 rounded-md'
            onClick={sendMessage}
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatBox
