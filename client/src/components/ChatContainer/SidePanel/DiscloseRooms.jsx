import { Disclosure } from '@headlessui/react'
import { useEffect, useContext, useState } from 'react'
import { ChatContext } from '../../../Context/ChatContext'
import { RoomContext } from '../../../Context/RoomContext'
import { StageSpinner } from 'react-spinners-kit'
import { ChevronUpIcon } from './../../Icons'
import { JoinRoomModal } from '../../Modals/JoinRoomModal'

export function DiscloseRooms() {
  const [loading, setLoading] = useState(false)
  const { userRooms, socket } = useContext(ChatContext)
  const { setRoom, setFriend, matchedRooms, setSwitchTab } =
    useContext(RoomContext)

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

    setFriend('')

    setSwitchTab(1)
  }

  return (
    <div className='pt-5'>
      <div className=' rounded-2xl bg-white dark:bg-zinc-900'>
        <Disclosure defaultOpen>
          {({ open }) => (
            <>
              <Disclosure.Button className='flex w-full gap-3 items-center rounded-lg border-2 px-3 py-2 text-sm  hover:border-purple-700 transition-colors duration-300'>
                <ChevronUpIcon
                  className={`${!open ? 'rotate-180 transform' : ''} h-3 w-3 `}
                />
                <span>Rooms</span>
              </Disclosure.Button>
              <Disclosure.Panel className='pt-3 text-sm'>
                {loading ? (
                  <>
                    <JoinRoomModal />
                    {matchedRooms?.map((room, index) => {
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
                              className='flex items-center gap-5 w-full py-1 px-3 hover:bg-purple-500  cursor-pointer rounded-md hover:text-white transition-colors'
                            >
                              <img
                                className='w-7 rounded-full ring-2 ring-black dark:ring-white bg-white'
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
