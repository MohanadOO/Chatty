import { useState, useContext, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { UserContext } from '../Context/UserContext'
import { useAuth } from '../Firebase'
import { getDoc } from 'firebase/firestore'
import io from 'socket.io-client'
import ChatContainer from '../components/ChatContainer'
import { ChatContext } from '../Context/ChatContext'
import { getUserRooms, getFriends } from '../Firebase'
import { StageSpinner } from 'react-spinners-kit'

const socket = io.connect('http://localhost:3001')

function Chat() {
  //Current User Information
  const currentUser = useAuth()
  const [loading, setLoading] = useState(true)
  const [userRooms, setUserRooms] = useState(undefined)
  const [userFriends, setUserFriends] = useState(undefined)
  const { userLoggedIn } = useContext(UserContext)

  useEffect(() => {
    if (currentUser?.displayName) {
      //Get User Rooms from Database {name, id}
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

      //Get User Friends from database.
      getFriends(currentUser).then((i) => {
        if (i) {
          const friendDetailsPromiseArr = i.map(async (friend) => {
            return await getDoc(friend.friendRef).then((info) => {
              return { data: info.data(), id: info.id }
            })
          })
          Promise.all(friendDetailsPromiseArr).then((item) => {
            setUserFriends(item)
          })
        } else {
          setUserFriends([])
        }
      })
    }
  }, [currentUser])


  return (
    <ChatContext.Provider
      value={{
        userRooms,
        setUserRooms,
        userFriends,
        setUserFriends,
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
          <ChatContainer />
        )}
      </>
    </ChatContext.Provider>
  )
}

export default Chat
