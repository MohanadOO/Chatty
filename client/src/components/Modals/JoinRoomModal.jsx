import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { AddIcon } from '../Icons'
import { RoomsAutoCompleteComboBox } from '../ComboBox/RoomsAutoCompleteComboBox'

export function JoinRoomModal() {
  const [isOpen, setIsOpen] = useState(false)

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
          className=' flex items-center gap-3 rounded-md  px-8 py-2 text-sm font-medium  hover:bg-opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 text-black mb-3 hover:bg-primary-500 hover:text-white'
        >
          <AddIcon color={'black hover:white'} />
          Join Room
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
            <div className='fixed inset-0 bg-black bg-opacity-25 ' />
          </Transition.Child>

          <div className='fixed inset-0 '>
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
                    Room Name
                  </Dialog.Title>
                  <RoomsAutoCompleteComboBox />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
