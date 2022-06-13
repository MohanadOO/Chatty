import UsersDetails from './UsersDetails'

function RoomHeader({ userTyping, room, friend, friendStatue }) {
  function handleImageError(e, name) {
    console.log(e, name)
    e.target.src = `https://ui-avatars.com/api/?name=${
      name.split(' ')[0]
    }&length=1`
  }
  
  return (
    <>
      {room || friend ? (
        <div className='flex items-center rounded-md gap-2 py-3 px-4 md:py-4 md:px-8 text-black dark:text-white shadow-md shadow-purple-600/20 dark:shadow-purple-600/10 border-2 border-purple-700'>
          <div className='relative'>
            <img
              className='w-8 md:w-9 rounded-full bg-white'
              src={room?.roomAvatar || friend?.avatar}
              onError={(e) => handleImageError(e, friend.name || room.name)}
              alt={room?.roomAvatar ? 'room_avatar' : 'friend_avatar'}
            />
            <span
              className={`top-0 left-7 absolute w-3 h-3 border-2 border-white dark:border-gray-800 rounded-full ${
                friendStatue === 'online' ? 'bg-green-400' : 'bg-gray-600'
              }`}
            ></span>
          </div>
          <div className='px-2 flex flex-col '>
            <p className='text-xs sm:text-sm md:text-base text-medium text-shadow-sm'>
              {room?.name || friend.name}
            </p>
            {userTyping === friend?.name && (
              <span className='text-xs text-slate-600 dark:text-slate-100'>
                {userTyping} is typing...
              </span>
            )}
            {room && userTyping?.roomRef?.id === room?.id && (
              <span className='text-xs text-slate-600 dark:text-slate-100'>
                {userTyping?.currentUserName} is typing...
              </span>
            )}
          </div>
          <div className='ml-auto'>
            {room && <UsersDetails users={room?.users} />}
          </div>
        </div>
      ) : (
        <div className='flex items-center justify-center rounded-md gap-2 py-2 md:py-4 px-8 text-black dark:text-white shadow-md shadow-purple-600/20 dark:shadow-purple-600/10 border-2 border-purple-700'>
          <p className=''>No room entered</p>
        </div>
      )}
    </>
  )
}

export default RoomHeader
