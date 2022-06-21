import { useState, useEffect, useContext, useRef } from 'react'
import { ChatContext } from '../../../Context/ChatContext'
import { RoomContext } from '../../../Context/RoomContext'
import {
  getUsersConversation,
  saveUserMessage,
  getRoomMessages,
  saveMessage,
} from '../../../Firebase'
import { StageSpinner } from 'react-spinners-kit'
import RoomHeader from './RoomHeader/RoomHeader'
import { sendMessageSocket, sendUserMessageSocket } from '../../../SocketIo'
import { useInterval } from 'react-use'

import { motion } from 'framer-motion'
import { fadeInRightChild } from '../../../Variants'
import { PaperAirplaneIcon } from '@heroicons/react/solid'

export function ChatBox() {
  const { socket, currentUser } = useContext(ChatContext)
  const { friend, room, friendStatue, roomUsersStatue } =
    useContext(RoomContext)

  const [chat, setChat] = useState([])
  const [message, setMessage] = useState('')

  //Detect which user is typing.
  const [userTyping, setUserTyping] = useState('')

  //Save room id's
  const [roomRef, setRoomRef] = useState('')

  //State to decide when if to show user avatar with the message sent or not
  const [showAvatar, setShowAvatar] = useState(true)

  const chatBoxScroll = useRef()

  function handleMessage(e) {
    setMessage(() => e.target.value)

    if (roomRef && friend) {
      //Emitting an Event that the user is typing to a particular user
      return socket.emit(
        'user_typing_user',
        roomRef.new,
        currentUser.displayName
      )
    }

    //Emitting an Event that the user is typing to a room
    return socket.emit('user_typing_room', roomRef.new, currentUser.displayName)
  }

  //Get Room or User chat log from the database
  useEffect(() => {
    if (friend) {
      getUsersConversation(currentUser, friend?.id).then((messages) => {
        setChat(() => messages.messages)
        setRoomRef(() => {
          return { old: roomRef.new, new: messages.id }
        })
      })
    }
    if (room) {
      getRoomMessages(room?.id).then((messages) => {
        setChat(() => messages)
        setRoomRef(() => {
          return { old: roomRef.new, new: room.id }
        })
      })
    }
  }, [friend, room])

  //Update the server when user join or leave a room
  useEffect(() => {
    if (roomRef !== '' && roomRef?.new !== roomRef?.old) {
      socket.emit('join_room', roomRef?.new)
      if (roomRef?.old) {
        socket.emit('leave_room', roomRef?.old)
      }
    }
  }, [roomRef])

  //Make the chat box scroll into view
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

  //Receive information's From the socket
  useEffect(() => {
    socket.on('receive_message', (payload) => {
      setShowAvatar(true)
      setChat(() => [...payload.chat])
    })

    socket.on('user_typing_to_user', (payload) => {
      setUserTyping(() => payload)
    })

    socket.on('user_typing_to_room', (payload) => {
      setUserTyping(() => payload)
    })
  }, [socket])

  //Resetting the state of user is typing after 5 seconds
  useInterval(() => {
    setUserTyping('')
  }, 5000)

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
        sendUserMessageSocket(socket, messageDetails, chat, roomRef?.new)
      } else {
        sendMessageSocket(socket, messageDetails, chat, room)
      }
    } else {
      setChat([messageDetails])
      if (friend) {
        sendUserMessageSocket(socket, messageDetails, chat, roomRef?.new)
      } else {
        sendMessageSocket(socket, messageDetails, chat, room)
      }
    }

    //save Message in the Database
    if (friend) {
      saveUserMessage(roomRef?.new, messageDetails)
    } else {
      saveMessage(roomRef?.new, messageDetails)
    }

    //Resetting message state
    setMessage('')

    setShowAvatar(false)
    setUserTyping('')
  }

  function handleImageError(e, name) {
    e.target.src = `https://ui-avatars.com/api/?name=${
      name.split(' ')[0]
    }&length=1`
  }
  return (
    <motion.div
      variants={fadeInRightChild}
      className='h-[95%] sm:h-full rounded-md flex-1 flex flex-col max-w-5xl justify-between relative shadow- dark:shadow-purple-700'
    >
      <RoomHeader
        friend={friend}
        room={room}
        userTyping={userTyping}
        socket={socket}
        friendStatue={friendStatue}
        roomUSersStatue={roomUsersStatue}
      />

      <div
        id='chat-box'
        ref={chatBoxScroll}
        className='scrollbar-thumb-transparent scrollbar-track-transparent scrollbar-thin  hover:scrollbar-thumb-purple-700 active:scrollbar-thumb-purple-400 hover:scrollbar-track-slate-100 hover:dark:scrollbar-track-zinc-900 hover:dark:scrollbar-thumb-purple-900 scroll-smooth flex flex-col justify-start overflow-y-auto mb-[100px] mt-5 font-poppins'
      >
        <>
          {!chat ? (
            <div className='absolute top-[50%] left-[50%] translate-x-[-50%]'>
              <StageSpinner
                size={40}
                color={`${localStorage.theme === 'dark' ? '#fff' : '#000'}`}
              />
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
                              ?.userAvatar || currentUser?.photoURL
                          }
                          onError={(e) =>
                            handleImageError(e, message?.sender?.name)
                          }
                          alt='user_icon'
                        />
                      )}
                      {message.showAvatar ? (
                        <div className='ml-3'>
                          <p className='text-xs md:text-sm mb-1 '>You</p>
                          <p
                            key={index}
                            className='bg-gray-200 dark:bg-gray-500 py-2 max-w-sm mb-2 pr-6 pl-3 text-md rounded-xl rounded-tl-none break-words shadow-sm text-xs md:text-sm lg:text-base'
                          >
                            {message.message}
                          </p>
                        </div>
                      ) : (
                        <div className='ml-10'>
                          <p
                            key={index}
                            className='bg-gray-200 dark:bg-gray-500 py-2 max-w-sm mb-2 pr-6 pl-3 text-md rounded-xl rounded-tl-none break-words shadow-sm text-xs md:text-sm lg:text-base'
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
                            <p className='text-xs md:text-sm text-right mb-1'>
                              {message.sender.name}
                            </p>
                            <p
                              key={index}
                              className='inline-block ml-24 bg-purple-600 text-white py-2 max-w-sm mb-2 pr-6 pl-3 text-md rounded-xl rounded-tr-none break-words shadow-sm  text-xs md:text-sm'
                            >
                              {message.message}
                            </p>
                          </div>
                          <img
                            className='rounded-md w-6 md:w-7 self-start'
                            src={message.userProfile}
                            onError={(e) =>
                              handleImageError(e, message?.sender?.name)
                            }
                            alt='user_icon'
                          />
                        </div>
                      ) : (
                        <div className='flex items-center gap-3 justify-end mr-[60px]'>
                          <p
                            key={index}
                            className='bg-purple-600 text-white py-2 max-w-sm mb-2 pr-6 pl-3 text-md rounded-xl rounded-tr-none break-words shadow-sm  text-xs md:text-sm'
                          >
                            {message.message}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )
            })
          )}
        </>

        <form className='p-3  flex gap-3 items-center absolute bottom-0 w-full'>
          <input
            className='outline-none py-4 px-5 md:py-5 md:px-7 rounded-md h-10 w-full bg-transparent shadow-none border-purple-600/50 border-2 focus:border-purple-600'
            type='text'
            placeholder='Write a Message'
            onChange={handleMessage}
            value={message}
          />
          <button
            className='bg-purple-600 text-white text-xs md:text-sm  py-3 px-5 rounded-lg'
            onClick={sendMessage}
          >
            <PaperAirplaneIcon className='w-5 rotate-90 cursor-pointer hover:scale-110' />
          </button>
        </form>
      </div>
    </motion.div>
  )
}

export default ChatBox
