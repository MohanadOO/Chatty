import { useState, useEffect, useContext } from 'react'
import { ChatContext } from '../Context/ChatContext'
import { RoomContext } from '../Context/RoomContext'
import RoomHeader from './RoomHeader'

function ChatArea() {
  const { socket, currentUser } = useContext(ChatContext)
  const { room } = useContext(RoomContext)
  const [chat, setChat] = useState([])
  const [message, setMessage] = useState('')

  const sendMessage = (e) => {
    e.preventDefault()
    if (message !== '') {
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
  }

  useEffect(() => {
    socket.on('receive_message', (payload) => {
      setChat(() => [...payload.chat])
    })
  }, [socket])

  return (
    <div className='rounded-md flex-1 flex flex-col max-w-5xl justify-between relative shadow-md'>
      <RoomHeader />
      <div className='flex flex-col  justify-start overflow-y-auto'>
        {chat.map((message, index) => {
          return (
            <div className='ml-5'>
              {message.sender === currentUser.uid ? (
                <div className='flex items-center gap-3'>
                  <img
                    className='rounded-md w-7 self-start'
                    src={
                      JSON.parse(localStorage.getItem('user')).userAvatar ||
                      currentUser?.photoURL
                    }
                    alt='user_icon'
                  />
                  <div>
                    <p className='text-black text-sm '>
                      {JSON.parse(localStorage.getItem('user')).userName ||
                        currentUser?.displayName}
                    </p>
                    <p
                      key={index}
                      className='bg-black/10 py-1 max-w-sm mb-7 px-3 text-md rounded-lg rounded-tl-none break-words'
                    >
                      {message.message}
                    </p>
                  </div>
                </div>
              ) : (
                <div className='flex items-center gap-3 justify-end'>
                  <div>
                    <p className='text-black text-sm '>{message.userName}</p>
                    <p
                      key={index}
                      className='bg-primary-400 text-white py-1 max-w-sm mb-4 px-3 text-md rounded-lg rounded-tr-none break-words'
                    >
                      {message.message}
                    </p>
                  </div>
                  <img
                    className='rounded-md w-7 self-start'
                    src={message.userProfile}
                    alt='user_icon'
                  />
                </div>
              )}
            </div>
          )
        })}
        <form className='p-5 flex gap-2 items-center'>
          <input
            className='py-6 px-7 rounded-xl h-10 w-full bg-transparent shadow-none border-primary-400 border-2'
            type='text'
            placeholder='Write a Message...'
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
          <button
            className='bg-primary-500 text-white w-40 py-3 px-2 rounded-md '
            onClick={sendMessage}
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatArea
