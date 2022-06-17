import { Disclosure } from '@headlessui/react'
import { useContext, useEffect, useState } from 'react'
import { StageSpinner } from 'react-spinners-kit'
import { ChatContext } from '../../../Context/ChatContext'
import { RoomContext } from '../../../Context/RoomContext'
import { ChevronUpIcon } from './../../Icons'
import { AddFriendsModal } from '../../Modals/AddFriendsModal'

export function DiscloseUsers() {
  const { userFriends } = useContext(ChatContext)
  const { setFriend, setRoom, setSwitchTab, connectedUsersStatue } =
    useContext(RoomContext)
  const [loading, setLoading] = useState(true)

  const [userFriendsStatues, setUserFriendsStatues] = useState([])

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
    setSwitchTab(1)
  }

  useEffect(() => {
    if (userFriends) {
      let userStatue
      const friendsStateList = userFriends.map((friend) => {
        const userExist = connectedUsersStatue.some((user) => {
          if (user.user === friend.id) {
            return (userStatue = user)
          }
        })
        if (userExist) {
          return { ...friend, statue: userStatue.statue }
        }
        return { ...friend, statue: 'offline' }
      })

      setUserFriendsStatues(() => friendsStateList)
    }
  }, [connectedUsersStatue, userFriends])

  function handleImageError(e, name) {
    e.target.src = `https://ui-avatars.com/api/?name=${
      name.split(' ')[0]
    }&length=1`
  }

  return (
    <div className='pt-5'>
      <div className=' rounded-2xl'>
        <Disclosure defaultOpen>
          {({ open }) => (
            <>
              <Disclosure.Button className='flex w-full gap-3 items-center rounded-lg border-2 px-3 py-2 text-sm  hover:border-purple-700 transition-colors duration-300'>
                <ChevronUpIcon
                  className={`${!open ? 'rotate-180 transform' : ''} h-3 w-3 `}
                />
                <span>Users</span>
              </Disclosure.Button>
              <Disclosure.Panel className='pt-3 text-sm'>
                {!loading ? (
                  <>
                    <AddFriendsModal friends={userFriends} />
                    {userFriendsStatues.map((friend, index) => {
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
                              className='flex items-center gap-5 w-full py-1 px-3 hover:bg-purple-500  cursor-pointer rounded-md hover:text-white transition-colors'
                            >
                              <div className='relative flex items-center justify-center'>
                                <img
                                  className={`${
                                    friend.statue === 'online'
                                      ? 'ring-green-400 '
                                      : 'ring-gray-400 '
                                  } ring-2 w-10 rounded-full`}
                                  key={`${friend.data.name}_avatar`}
                                  src={`${friend.data.profilePicture}`}
                                  title={`${
                                    friend?.statue === 'online'
                                      ? 'Online'
                                      : 'Offline'
                                  }`}
                                  onError={(e) =>
                                    handleImageError(e, friend.data.name)
                                  }
                                  alt='friend_avatar'
                                />
                                <span
                                  className={`${
                                    friend?.statue === 'online'
                                      ? 'bg-green-400'
                                      : 'bg-gray-600'
                                  } bottom-0 left-[23px]  absolute w-[10px] h-[10px] border-2 border-white dark:border-gray-800 rounded-full`}
                                ></span>
                              </div>
                              <p className='p-2 w-full' key={friend.data.name}>
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
