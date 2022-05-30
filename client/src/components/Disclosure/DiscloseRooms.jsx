import { Disclosure } from '@headlessui/react'
import { useEffect, useContext, useState } from 'react'
import { ChatContext } from '../../Context/ChatContext'
import { RoomContext } from '../../Context/RoomContext'
import { StageSpinner } from 'react-spinners-kit'
import { ChevronUpIcon } from '../Icons'
import { JoinRoomModal } from '../Modals/JoinRoomModal'

export function DiscloseRooms() {
  const [loading, setLoading] = useState(false)
  const { userRooms, socket } = useContext(ChatContext)
  const { setRoom, matchedRooms } = useContext(RoomContext)

  useEffect(() => {
    setLoading(true)
  }, [userRooms])

  function handleEnterRoom(name, id, owners, roomAvatar, users) {
    setRoom({
      name,
      id,
      owners,
      roomAvatar,
      users,
    })

    if (room !== '') {
      socket.emit('join_room', id)
    }
  }

  return (
    <div className='pt-5'>
      <div className=' rounded-2xl bg-white'>
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className='flex w-full justify-between items-center rounded-lg border-primary-500/50  border-2 text-black px-14 py-2  text-sm hover:border-primary-500 transition-colors duration-300'>
                <ChevronUpIcon
                  className={`${
                    !open ? 'rotate-180 transform' : ''
                  } h-3 w-3 text-black`}
                />
                <span>Rooms</span>
              </Disclosure.Button>
              <Disclosure.Panel className='pt-4 text-sm text-gray-500'>
                {loading ? (
                  <>
                    <JoinRoomModal />
                    {matchedRooms.map((room, index) => {
                      return (
                        <div className='flex items-center gap-5' key={index}>
                          {!room.name || !room.roomAvatar ? (
                            <p>Loading...</p>
                          ) : (
                            <div
                              onClick={() =>
                                handleEnterRoom(
                                  room.name,
                                  room.id,
                                  room.owners,
                                  room.roomAvatar,
                                  room.users
                                )
                              }
                              className='flex items-center  gap-5 w-full py-1 px-5 mb-2 hover:bg-primary-500 hover:text-white text-black cursor-pointer mr-5 rounded-md'
                            >
                              <img
                                className='w-8 rounded-full fill-black'
                                key={`${room.name}_avatar`}
                                src={room.roomAvatar}
                                alt='room_avatar'
                              />
                              <p className='p-2' key={room.name}>
                                {room.name}
                              </p>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </>
                ) : (
                  <StageSpinner color={'#000'} />
                )}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  )
}
