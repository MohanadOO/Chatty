import { useState, useContext, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { UserContext } from '../Context/UserContext'
import { useAuth } from '../Firebase'
import io from 'socket.io-client'
import ChatInterface from '../components/ChatInterface'
import CreateRoom from '../components/CreateRoom'
import { ChatContext } from '../Context/ChatContext'
import { getRooms } from '../Firebase'
import { StageSpinner } from 'react-spinners-kit'

const socket = io.connect('http://localhost:3001')

function Chat() {
  const currentUser = useAuth()
  const [loading, setLoading] = useState(true)
  const [rooms, setRooms] = useState(undefined)
  const { userLoggedIn } = useContext(UserContext)

  useEffect(() => {
    if (currentUser?.displayName) {
      getRooms(currentUser)
        .then((roomsArr) => {
          console.log(roomsArr)
          if (roomsArr) {
            setRooms(roomsArr)
            setLoading(false)
          } else {
            setRooms(undefined)
            setLoading(false)
          }
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }, [currentUser])

  console.log(rooms)

  return (
    <ChatContext.Provider
      value={{
        rooms,
        setRooms,
        socket,
        currentUser,
      }}
    >
      <>
        {!userLoggedIn && <Navigate to='/login' replace />}
        {loading ? (
          <div className=' absolute top-[50%] left-[50%] translate-x-[-50%]'>
            <StageSpinner size={50} color={'#000'} />
          </div>
        ) : (
          <div className='mx-16 bg-primary-50'>
            {!rooms ? <CreateRoom /> : <ChatInterface />}
          </div>
        )}
      </>
    </ChatContext.Provider>
  )
}

export default Chat
