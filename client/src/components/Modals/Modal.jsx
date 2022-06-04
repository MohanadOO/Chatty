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
              <Dialog.Panel className='w-full max-w-md transform overflow-auto rounded-2xl bg-white p-6 text-left h-64 align-middle shadow-xl transition-all'>
                <Dialog.Title
                  as='h3'
                  className='text-lg text-center font-medium leading-6 text-gray-900'
                >
                  {title}
                </Dialog.Title>
                {friends && <UsersComboBox friends={friends} />}
                {rooms && (
                  <form onSubmit={(e) => createRoom(e)}>
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
                      <input
                        onClick={(e) => createRoom(e)}
                        className='inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 cursor-pointer'
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
