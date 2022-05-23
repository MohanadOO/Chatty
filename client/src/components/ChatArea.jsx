import React from 'react'
import { useState, useEffect, useContext } from 'react'
import { ChatContext } from '../Context/ChatContext'
import { RoomContext } from '../Context/RoomContext'

function ChatArea() {
  const { socket, currentUser } = useContext(ChatContext)
  const { room } = useContext(RoomContext)
  const [chat, setChat] = useState([])
  const [message, setMessage] = useState('')

  const sendMessage = () => {
    setChat((prevMessages) => {
      return [
        ...prevMessages,
        {
          message,
          sender: currentUser.uid,
          userProfile: currentUser.photoURL,
        },
      ]
    })
    socket.emit('send_message', {
      chat: [
        ...chat,
        {
          message,
          sender: currentUser.uid,
          userProfile: currentUser.photoURL,
        },
      ],
      room,
    })
    setMessage('')
  }

  useEffect(() => {
    socket.on('receive_message', (payload) => {
      setChat(() => [...payload.chat])
    })
  }, [socket])

  return (
    <div className='bg-blue-200 flex-1'>
      <p className='p-2 text-black'>{room}</p>
      {chat.map((message, index) => {
        return (
          <div className='flex gap-5 items-center justify-center'>
            {message.sender === currentUser.uid ? (
              <>
                <img
                  className='rounded-full w-10'
                  src={currentUser?.photoURL}
                  alt='user_icon'
                />
                <p
                  key={index}
                  className='  bg-red-200 py-1 flex-1 my-2 px-5 text-xl rounded-md'
                >
                  {message.message}
                </p>
              </>
            ) : (
              <>
                <p
                  key={index}
                  className='  bg-blue-200 py-1 my-2 flex-1 px-5 text-xl rounded-md'
                >
                  {message.message}
                </p>
                <img
                  className='rounded-full w-10'
                  src={`${message.userProfile}`}
                  alt='user_icon'
                />
              </>
            )}
          </div>
        )
      })}
      <input
        className='p-2  '
        type='text'
        placeholder='Message...'
        onChange={(e) => setMessage(e.target.value)}
        value={message}
      />
      <button
        className='bg-black text-primary-50 ml-5 my-5 p-2 rounded-md'
        onClick={sendMessage}
      >
        Send Message
      </button>
    </div>
  )
}

export default ChatArea
