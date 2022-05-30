import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { useContext } from 'react'
import { addRoomDB } from '../../Firebase'
import { AddIcon } from '../Icons'
import { ChatContext } from '../../Context/ChatContext'
import { RoomContext } from '../../Context/RoomContext'
import toast from 'react-hot-toast'

export function CreateRoomModal() {
  const { currentUser } = useContext(ChatContext)
  const { setRoom, setMatchedRooms } = useContext(RoomContext)
  const [roomName, setRoomName] = useState('')
  let [isOpen, setIsOpen] = useState(false)

  //Create a new Room and Add it to the database.
  async function creteRoom(e) {
    e.preventDefault()
    if (roomName === '') {
      return toast.error('Enter Room Name!')
    }

    setIsOpen(false)
    setRoomName('')

    //Add Room information to the rooms collection and user list of rooms
    await addRoomDB(currentUser, roomName).then((roomInfo) => {
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
          className=' flex items-center gap-3 rounded-md bg-primary-500 px-8 py-2 text-sm font-medium  hover:bg-opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 text-white'
        >
          <AddIcon color={'white'} />
          Create Room
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-25' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                  <Dialog.Title
                    as='h3'
                    className='text-lg text-center font-medium leading-6 text-gray-900'
                  >
                    Create New Room
                  </Dialog.Title>
                  <form>
                    <div className='mt-2 text-center'>
                      <p className='text-sm text-gray-500 p-2'>
                        <input
                          className='py-1 px-4'
                          type='text'
                          placeholder='Room name...'
                          value={roomName}
                          onChange={(e) => setRoomName(e.target.value)}
                        />
                      </p>
                    </div>

                    <div className='mt-3 text-center'>
                      <button
                        onClick={creteRoom}
                        className='inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
                      >
                        Create Room
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
