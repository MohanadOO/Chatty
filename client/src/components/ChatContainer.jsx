import SidePanel from './SidePanel'
import { RoomContext } from '../Context/RoomContext'
import { ChatContext } from '../Context/ChatContext'
import { useState, useEffect, useContext } from 'react'
import { getMatchedRooms } from '../Firebase'
import ChatBox from './ChatBox'

function ChatContainer() {
  const { userRooms, socket } = useContext(ChatContext)
  const [matchedRooms, setMatchedRooms] = useState([])
  const [room, setRoom] = useState(undefined)
  const [friend, setFriend] = useState(undefined)

  useEffect(() => {
    //Get All the rooms details that the user is joined to {name, id, owners, users, avatar}
    getMatchedRooms(userRooms).then((rooms) => {
      setMatchedRooms(rooms)
    })
  }, [userRooms])

  //Join First Room When Logged In
  useEffect(() => {
    if (typeof room === 'string' && matchedRooms?.length > 0) {
      setRoom({
        name: matchedRooms[0]?.name,
        id: matchedRooms[0]?.id,
        owners: matchedRooms[0]?.owners,
        roomAvatar: matchedRooms[0]?.roomAvatar,
        users: matchedRooms[0]?.users,
      })
      socket.emit('join_room', matchedRooms[0]?.id)
    }
  }, [matchedRooms])

  return (
    <RoomContext.Provider
      value={{
        room,
        setRoom,
        friend,
        setFriend,
        matchedRooms,
        setMatchedRooms,
      }}
    >
      <div className='flex justify-center gap-3 py-5 h-[83vh]  border-t-2 border-b-2 border-primary-400/40'>
        <SidePanel />
        <ChatBox />
      </div>
    </RoomContext.Provider>
  )
}

export default ChatContainer
