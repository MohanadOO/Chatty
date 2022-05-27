import { useState, useContext, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { UserContext } from '../Context/UserContext'
import { useAuth } from '../Firebase'
import io from 'socket.io-client'
import ChatInterface from '../components/ChatInterface'
import CreateRoom from '../components/CreateRoom'
import { ChatContext } from '../Context/ChatContext'
import { getUserRooms } from '../Firebase'
import { StageSpinner } from 'react-spinners-kit'

const socket = io.connect('http://localhost:3001')

function Chat() {
  const currentUser = useAuth()
  const [loading, setLoading] = useState(true)
  const [userRooms, setUserRooms] = useState(undefined)
  const { userLoggedIn } = useContext(UserContext)

  useEffect(() => {
    if (currentUser?.displayName) {
      getUserRooms(currentUser)
        .then((roomsArr) => {
          if (roomsArr) {
            setUserRooms(roomsArr)
            setLoading(false)
          } else {
            setUserRooms(undefined)
            setLoading(false)
          }
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }, [currentUser])

  return (
    <ChatContext.Provider
      value={{
        userRooms,
        setUserRooms,
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
          <>{!userRooms ? <CreateRoom /> : <ChatInterface />}</>
        )}
      </>
    </ChatContext.Provider>
  )
}

export default Chat
