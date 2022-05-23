import { useEffect, useContext, useState } from 'react'
import { ChatContext } from '../Context/ChatContext'
import { RoomContext } from '../Context/RoomContext'
import { StageSpinner } from 'react-spinners-kit'
import { MyModal } from '../components/DialogModal'

function Rooms() {
  const { rooms } = useContext(ChatContext)
  const { setRoom } = useContext(RoomContext)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (rooms) {
      setLoading(true)
    }
  }, [rooms])

  function handleJoinRoom(room) {
    //Join Room And Display Messages
    setRoom(room)
  }

  return (
    <div className=' w-50 overflow-y-auto px-2 '>
      <div className='cursor-pointer my-10 px-10'>
        <MyModal />
      </div>
      {loading ? (
        rooms.map((room) => {
          return (
            <p
              className='p-2 cursor-pointer text-center hover:bg-primary-500 transition-colors text-white bg-primary-400 mb-5 rounded-md'
              key={room.stringValue}
              onClick={() => handleJoinRoom(room.stringValue)}
            >
              {room.stringValue}
            </p>
          )
        })
      ) : (
        <StageSpinner color={'#000'} />
      )}
    </div>
  )
}

export default Rooms
