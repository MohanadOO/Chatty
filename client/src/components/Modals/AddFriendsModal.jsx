import { useState } from 'react'
import { AddIcon } from '../Icons'
import Modal from '../Modals/Modal'

export function AddFriendsModal({ friends }) {
  const [isOpen, setIsOpen] = useState(false)

  function openModal() {
    setIsOpen(true)
  }

  function closeModal() {
    setIsOpen(false)
  }

  return (
    <>
      <div className='border-purple-200 border-b-2 dark:border-white/50 mb-2'>
        <button
          type='button'
          onClick={openModal}
          className='flex items-center gap-3 rounded-lg px-3 w-full py-2 mb-1 text-sm hover:bg-opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 hover:text-white hover:bg-purple-500 transition-colors'
        >
          <AddIcon />
          Add Friends
        </button>
      </div>

      <Modal
        isOpen={isOpen}
        openModal={openModal}
        closeModal={closeModal}
        title={'Add Friends'}
        friends={friends}
      />
    </>
  )
}
