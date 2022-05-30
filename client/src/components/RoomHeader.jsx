import { useContext } from 'react'
import UsersDetails from './UsersDetails'
import { RoomContext } from '../Context/RoomContext'

function RoomHeader() {
  const { room } = useContext(RoomContext)

  return (
    <>
      <div className='flex items-center rounded-lg gap-2 py-2 px-8 bg-primary-400'>
        <img
          className='w-8 rounded-full bg-white'
          src={room?.roomAvatar}
          alt='room_icon'
        />
        <p className='px-2 text-white'>{room?.name}</p>
        <div className='ml-auto'>
          <UsersDetails />
        </div>
      </div>
    </>
  )
}

export default RoomHeader
