import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { UsersComboBox } from '../ComboBox/UsersComboBox'

function Modal({
  friends,
  isOpen,
  closeModal,
  title,
  rooms,
  roomName,
  setRoomName,
  createRoom,
}) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={() => closeModal()}>
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
          <div className='flex min-h-full items-center justify-center p-4'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <Dialog.Panel className='w-full max-w-md transform overflow-auto rounded-2xl bg-white py-14 px-10 text-left align-middle shadow-xl transition-all'>
                <Dialog.Title
                  as='h3'
                  className='text-xl font-semibold leading-6 text-gray-700'
                >
                  {title}
                </Dialog.Title>
                {friends && (
                  <UsersComboBox friends={friends} closeModal={closeModal} />
                )}
                {rooms && (
                  <form onSubmit={(e) => createRoom(e)}>
                    <div className='mt-5'>
                      <input
                        className='py-2 px-5 text-sm ring-1 rounded-md ring-purple-500 focus:ring-2 focus:outline-none'
                        type='text'
                        placeholder='Room name...'
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                      />
                    </div>

                    <div className='mt-5'>
                      <input
                        onClick={(e) => createRoom(e)}
                        className='rounded-md border border-transparent bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-900 hover:bg-purple-200 hover:ring-2 hover:ring-purple-500 focus:outline-none cursor-pointer'
                        value='Create Room'
                        type='button'
                      />
                    </div>
                  </form>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default Modal
