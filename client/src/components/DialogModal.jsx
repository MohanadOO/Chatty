import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { useContext } from 'react'
import { addRoomDB } from '../Firebase'
import { AddIcon } from '../components/Icons'
import { ChatContext } from '../Context/ChatContext'

export function MyModal() {
  const [room, setRoom] = useState('')
  const { currentUser, setRooms } = useContext(ChatContext)
  let [isOpen, setIsOpen] = useState(false)

  function creteRoom() {
    addRoomDB(currentUser, room)
    setRooms((prevRooms) => [...prevRooms, { stringValue: room }])
    setIsOpen(false)
    setRoom('')
  }

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  return (
    <>
      <div className=' inset-0 flex items-center justify-center'>
        <button
          type='button'
          onClick={openModal}
          className=' flex items-center gap-3 rounded-md bg-primary-500 bg-opacity-50 px-4 py-2 text-sm font-medium  hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 text-white'
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
                  <div className='mt-2 text-center'>
                    <p className='text-sm text-gray-500 p-2'>
                      <input
                        className='py-1 px-4'
                        type='text'
                        placeholder='Room name...'
                        value={room}
                        onChange={(e) => setRoom(e.target.value)}
                      />
                    </p>
                  </div>

                  <div className='mt-3 text-center'>
                    <button
                      type='button'
                      className='inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
                      onClick={creteRoom}
                    >
                      Create Room
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
