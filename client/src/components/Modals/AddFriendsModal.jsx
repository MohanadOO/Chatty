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
      <div>
        <button
          type='button'
          onClick={openModal}
          className='flex items-center gap-3 hover:rounded-lg px-3 w-full py-2 text-sm hover:bg-opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 mb-3 hover:text-white hover:bg-primary-500 border-primary-500/20 border-b-2 dark:border-primary-white/50 transition-colors'
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
