import { useState, useContext, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { UserContext } from '../Context/UserContext'
import { useAuth } from '../Firebase'
import ChatContainer from '../components/ChatContainer/ChatContainer'
import { ChatContext } from '../Context/ChatContext'
import { StageSpinner } from 'react-spinners-kit'

function Chat({ socket }) {
  //Current User Information
  const currentUser = useAuth()

  const [loading, setLoading] = useState(true)

  //User rooms list and friend list states from the database
  const [userRooms, setUserRooms] = useState(undefined)
  const [userFriends, setUserFriends] = useState(undefined)

  const { userLoggedIn } = useContext(UserContext)

  useEffect(() => {
    const getData = async () => {
      const { getUserRooms, getFriends } = await import('../Firebase')

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
              const { getDoc } = await import('firebase/firestore')
              return await getDoc(friend.friendRef).then((info) => {
                return { data: info.data(), id: info.id, statue: 'offline' }
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
    }
    getData()
  }, [currentUser])

  //Save user statues in the server after logging in.
  useEffect(() => {
    if (currentUser?.uid) {
      socket.emit('login', currentUser?.uid)
    }
  }, [currentUser, userFriends])

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
