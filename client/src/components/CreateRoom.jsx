import { useContext, useState } from 'react'
import { addRoomDB } from '../Firebase'
import { ChatContext } from '../Context/ChatContext'
import toast from 'react-hot-toast'

function CreateRoom() {
  const [room, setRoom] = useState('')
  const { currentUser, socket, userRooms, setUserRooms } =
    useContext(ChatContext)

  //User will create and Join the room.
  const joinRoom = () => {
    if (userRooms !== '') {
      socket.emit('join_room', userRooms)
    }
    toast.success(
      <b>
        Joined Room <span className='text-primary-500'>{userRooms}</span>
      </b>
    )
    addRoomDB(currentUser, room)
    setUserRooms(room)
  }

  return (
    <div className='absolute top-[50%] left-[50%] translate-x-[-50%]'>
      <input
        className='p-2 bg-black rounded-md text-white'
        type='text'
        placeholder='Create Room ...'
        onChange={(e) => setRoom(e.target.value)}
      />
      <button
        className='bg-primary-400 text-primary-white block my-5 mx-auto p-2 rounded-md'
        onClick={joinRoom}
      >
        Create Room
      </button>
    </div>
  )
}

export default CreateRoom
