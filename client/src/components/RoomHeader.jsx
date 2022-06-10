import { useContext } from 'react'
import UsersDetails from './UsersDetails'
import { RoomContext } from '../Context/RoomContext'

function RoomHeader() {
  const { room, friend } = useContext(RoomContext)
  return (
    <>
      {room || friend ? (
        <div className='flex items-center rounded-md gap-2 py-3 px-4 md:py-4 md:px-8 text-black dark:text-white shadow-md shadow-primary-400/20 dark:shadow-primary-400/10 border-2 border-primary-500'>
          <img
            className='w-6 md:w-9 rounded-full bg-white'
            src={room?.roomAvatar || friend.avatar}
            alt='room_icon'
          />
          <p className='px-2 text-xs sm:text-sm md:text-base text-medium text-shadow-sm'>
            {room?.name || friend.name}
          </p>
          <div className='ml-auto'>
            {room && <UsersDetails users={room?.users} />}
          </div>
        </div>
      ) : (
        <div className='flex items-center justify-center rounded-md gap-2 py-2 md:py-4 px-8 text-black dark:text-white shadow-md shadow-primary-400/20 dark:shadow-primary-400/10 border-2 border-primary-500'>
          <p className=''>No room entered</p>
        </div>
      )}
    </>
  )
}

export default RoomHeader
