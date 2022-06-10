import { Disclosure } from '@headlessui/react'
import { useContext, useEffect, useState } from 'react'
import { StageSpinner } from 'react-spinners-kit'
import { ChatContext } from '../../Context/ChatContext'
import { RoomContext } from '../../Context/RoomContext'
import { ChevronUpIcon } from '../Icons'
import { AddFriendsModal } from '../Modals/AddFriendsModal'

export function DiscloseUsers() {
  const { userFriends, socket } = useContext(ChatContext)
  const { setFriend, setRoom, setSwitchTab } = useContext(RoomContext)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userFriends) {
      setLoading(false)
    }
  }, [userFriends])

  function handleUserConversation(name, id, avatar) {
    setFriend({
      name,
      id,
      avatar,
    })
    setRoom('')

    if (name !== '') {
      socket.emit('join_room', 'one-one')
    }

    setSwitchTab(1)
  }

  return (
    <div className='pt-5'>
      <div className=' rounded-2xl'>
        <Disclosure defaultOpen>
          {({ open }) => (
            <>
              <Disclosure.Button className='flex w-full gap-3 items-center rounded-lg border-2 px-3 py-2 text-sm  hover:border-primary-500 transition-colors duration-300'>
                <ChevronUpIcon
                  className={`${!open ? 'rotate-180 transform' : ''} h-3 w-3 `}
                />
                <span>Users</span>
              </Disclosure.Button>
              <Disclosure.Panel className='pt-3 text-sm'>
                {!loading ? (
                  <>
                    <AddFriendsModal friends={userFriends} />
                    {userFriends.map((friend, index) => {
                      return (
                        <div className='flex items-center gap-5' key={index}>
                          {!friend?.data?.name ||
                          !friend?.data?.profilePicture ? (
                            <p>Loading...</p>
                          ) : (
                            <div
                              onClick={() =>
                                handleUserConversation(
                                  friend.data.name,
                                  friend.id,
                                  friend.data.profilePicture
                                )
                              }
                              className='flex items-center gap-5 w-full py-1 px-3 hover:bg-primary-500  cursor-pointer rounded-md hover:text-white transition-colors'
                            >
                              <img
                                className='w-8 rounded-full fill-black'
                                key={`${friend.data.name}_avatar`}
                                src={`${friend.data.profilePicture}`}
                                alt='friend_avatar'
                              />
                              <p className='p-2' key={friend.data.name}>
                                {friend.data.name}
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
