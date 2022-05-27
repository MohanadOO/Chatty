import SidePanel from './SidePanel'
import ChatArea from './ChatArea'
import { RoomContext } from '../Context/RoomContext'
import { ChatContext } from '../Context/ChatContext'
import { useState, useEffect, useContext } from 'react'
import { getRooms } from '../Firebase'

function ChatInterface() {
  const { userRooms } = useContext(ChatContext)
  const [matchedRooms, setMatchedRooms] = useState([])
  const [room, setRoom] = useState({})

  useEffect(() => {
    getRooms(userRooms).then((rooms) => {
      setMatchedRooms(rooms)
    })
  }, [])

  useEffect(() => {
    setRoom({
      room: matchedRooms[0]?.name,
      id: matchedRooms[0]?.id,
      avatar: matchedRooms[0]?.roomAvatar,
      users: matchedRooms[0]?.users,
      owners: matchedRooms[0]?.owners,
    })
  }, [matchedRooms])

  return (
    <RoomContext.Provider
      value={{ room, setRoom, matchedRooms, setMatchedRooms }}
    >
      <div className='flex justify-center gap-3 py-5 h-[83vh]  border-t-2 border-b-2 border-primary-400/40'>
        <SidePanel />
        <ChatArea />
      </div>
    </RoomContext.Provider>
  )
}

export default ChatInterface
