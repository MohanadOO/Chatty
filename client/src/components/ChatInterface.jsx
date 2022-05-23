import Rooms from './Rooms'
import ChatArea from './ChatArea'
import UsersDetails from './UsersDetails'
import { RoomContext } from '../Context/RoomContext'
import { useState } from 'react'

function ChatInterface() {
  const [room, setRoom] = useState('')

  return (
    <RoomContext.Provider value={{ room, setRoom }}>
      <div className='flex justify-between gap-5 h-[75vh]'>
        <Rooms />
        <ChatArea />
        <UsersDetails />
      </div>
    </RoomContext.Provider>
  )
}

export default ChatInterface
