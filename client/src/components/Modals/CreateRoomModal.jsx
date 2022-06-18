import { useState } from 'react'
import { useContext } from 'react'
import { addRoomDB } from '../../Firebase'
import { AddIcon } from '../Icons'
import { ChatContext } from '../../Context/ChatContext'
import { RoomContext } from '../../Context/RoomContext'
import toast from 'react-hot-toast'
import Modal from '../Modals/Modal'

export function CreateRoomModal() {
  const { currentUser } = useContext(ChatContext)
  const { setRoom, setMatchedRooms } = useContext(RoomContext)
  const [roomName, setRoomName] = useState('')
  let [isOpen, setIsOpen] = useState(false)

  //Create a new Room and Add it to the database.
  function createRoom(e) {
    e.preventDefault()
    if (roomName === '') {
      return toast.error('Enter Room Name!')
    }

    setIsOpen(false)
    setRoomName('')

    //Add Room information to the rooms collection and user list of rooms
    addRoomDB(currentUser, roomName).then((roomInfo) => {
      setRoom(roomInfo)
      setMatchedRooms((prevRooms) => {
        return [...prevRooms, roomInfo]
      })
    })
  }

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  return (
    <>
      <div className=' flex items-center justify-center'>
        <button
          type='button'
          onClick={openModal}
          className=' flex items-center gap-3 rounded-md bg-purple-700  px-8 py-2 text-sm font-medium  hover:bg-opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 text-white'
        >
          <AddIcon color={'white'} />
          Create Room
        </button>
      </div>

      <Modal
        isOpen={isOpen}
        openModal={openModal}
        closeModal={closeModal}
        rooms={true}
        roomName={roomName}
        createRoom={(e) => createRoom(e)}
        setRoomName={setRoomName}
        title={'Create New Room'}
      />
    </>
  )
}
