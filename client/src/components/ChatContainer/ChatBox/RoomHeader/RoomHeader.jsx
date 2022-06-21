import UsersDetails from './UsersDetails'

import { motion } from 'framer-motion'
import { fadeInChild, fadeInParent } from '../../../../Variants'

function RoomHeader({ userTyping, room, friend, friendStatue }) {
  function handleImageError(e, name) {
    e.target.src = `https://ui-avatars.com/api/?name=${
      name.split(' ')[0]
    }&length=1`
  }

  return (
    <>
      {room || friend ? (
        <motion.div
          variants={fadeInParent}
          className='flex items-center rounded-md gap-2 py-3 px-4 md:py-4 md:px-8 text-black dark:text-white shadow-sm shadow-purple-600/20 dark:shadow-purple-600/10 border-2 border-purple-700'
        >
          <motion.div
            variants={fadeInChild}
            className='relative cursor-pointer'
          >
            <motion.img
              variants={fadeInChild}
              className={`${
                room
                  ? 'ring-black dark:ring-white'
                  : friendStatue === 'online'
                  ? 'ring-green-400 '
                  : 'ring-gray-400 '
              } ring-2 w-7 md:w-10 rounded-full`}
              src={room?.roomAvatar || friend?.avatar}
              onError={(e) => handleImageError(e, friend.name || room.name)}
              alt={room?.roomAvatar ? 'room_avatar' : 'friend_avatar'}
              title={
                room ? '' : friendStatue === 'online' ? 'Online' : 'Offline'
              }
            />
            {friend && (
              <span
                className={`bottom-0 left-5 md:left-7 absolute w-3 h-3 border-2 border-white dark:border-gray-800 rounded-full ${
                  friendStatue === 'online' ? 'bg-green-400' : 'bg-gray-600'
                }`}
              ></span>
            )}
          </motion.div>
          <div className='px-2 flex flex-col '>
            <p className='text-xs sm:text-sm md:text-base text-medium'>
              {room?.name || friend.name}
            </p>
            {userTyping === friend?.name && (
              <span className='text-xs text-slate-600 dark:text-slate-100'>
                {userTyping} is typing...
              </span>
            )}
            {room && userTyping?.roomRef === room?.id && (
              <span className='text-xs text-slate-600 dark:text-slate-100'>
                {userTyping?.currentUserName} is typing...
              </span>
            )}
          </div>
          <div className='ml-auto'>
            {room && <UsersDetails users={room?.users} />}
          </div>
        </motion.div>
      ) : (
        <motion.div
          variants={fadeInParent}
          className='flex items-center justify-center rounded-md gap-2 py-2 md:py-4 px-8 text-black dark:text-white shadow-sm shadow-purple-600/20 dark:shadow-purple-600/10 border-2 border-purple-700'
        >
          <p>No room entered</p>
        </motion.div>
      )}
    </>
  )
}

export default RoomHeader
