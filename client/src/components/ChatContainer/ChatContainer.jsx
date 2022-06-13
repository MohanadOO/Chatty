import { Tab } from '@headlessui/react'
import SidePanel from './SidePanel/SidePanel'
import { RoomContext } from '../../Context/RoomContext'
import { ChatContext } from '../../Context/ChatContext'
import { useState, useEffect, useContext } from 'react'
import { getMatchedRooms } from '../../Firebase'
import ChatBox from '../ChatContainer/ChatBox/ChatBox'

function ChatContainer() {
  const { userRooms, socket } = useContext(ChatContext)

  //Save all users rooms details
  const [matchedRooms, setMatchedRooms] = useState([])

  //Help switch to the chatBox component when joining a room in Mobile.
  const [switchTab, setSwitchTab] = useState(0)

  //Determine if a user joined a group room or private room with a friend user
  const [room, setRoom] = useState(undefined)
  const [friend, setFriend] = useState(undefined)

  //Set connected friend statue
  const [connectedUsersStatue, setConnectedUsersStatue] = useState([])
  const [friendStatue, setFriendStatue] = useState('')

  //Get All the rooms details that the user is joined to {name, id, owners, users, avatar}
  useEffect(() => {
    getMatchedRooms(userRooms).then((rooms) => {
      setMatchedRooms(rooms)
    })
  }, [userRooms])

  //Join First Room When Logged In
  useEffect(() => {
    if (typeof room === 'string' && matchedRooms?.length > 0) {
      setRoom({
        name: matchedRooms[0]?.name,
        id: matchedRooms[0]?.id,
        owners: matchedRooms[0]?.owners,
        roomAvatar: matchedRooms[0]?.roomAvatar,
        users: matchedRooms[0]?.users,
      })
      socket.emit('join_room', matchedRooms[0]?.id)
    }
  }, [matchedRooms])

  //Get all connected Users Status details.
  useEffect(() => {
    socket.on('getUsersStatus', (payload) => {
      const usersStatusList = []
      for (const [key, value] of Object.entries(payload)) {
        usersStatusList.push(value)
      }
      setConnectedUsersStatue(() => usersStatusList)
    })
  }, [socket])


  useEffect(() => {
    if (friend) {
      const currentFriend = connectedUsersStatue.filter((users) => {
        if (users.user === friend?.id) {
          return users
        }
      })
      setFriendStatue(() => currentFriend[0]?.statue)
    }
  }, [friend, connectedUsersStatue])

  return (
    <RoomContext.Provider
      value={{
        room,
        setRoom,
        friend,
        setFriend,
        matchedRooms,
        setMatchedRooms,
        setSwitchTab,
        friendStatue,
        connectedUsersStatue,
      }}
    >
      <div className='md:flex hidden justify-center gap-3 py-5 h-[83vh] border-y-2 border-purple-600/40'>
        <SidePanel />
        <ChatBox />
      </div>
      <div className='block md:hidden'>
        <MyTabs switchTab={switchTab} setSwitchTab={setSwitchTab} />
      </div>
    </RoomContext.Provider>
  )
}

export default ChatContainer

function MyTabs({ switchTab, setSwitchTab }) {
  const classNames = (...classes) => {
    return classes.filter(Boolean).join(' ')
  }
  return (
    <Tab.Group selectedIndex={switchTab}>
      <Tab.List className='flex w-full justify-evenly bg-purple-600/50 rounded-lg p-1'>
        <Tab
          onClick={() => setSwitchTab(0)}
          className={({ selected }) =>
            classNames(
              ' text-purple-700 font-bold text-sm ml-2 py-3 rounded-lg flex-1 transition-colors',
              selected
                ? 'bg-white'
                : 'text-black/50 dark:text-white/50  dark:hover:text-white hover:bg-purple-700 hover:text-white'
            )
          }
        >
          Rooms & Users
        </Tab>
        <Tab
          onClick={() => setSwitchTab(1)}
          className={({ selected }) =>
            classNames(
              ' text-purple-700 font-bold text-sm ml-2 py-3 rounded-lg flex-1 transition-colors',
              selected
                ? 'bg-white'
                : 'text-black/50 dark:text-white/50  dark:hover:text-white hover:bg-purple-700 hover:text-white'
            )
          }
        >
          Chat
        </Tab>
      </Tab.List>
      <Tab.Panels className='h-[70vh] flex flex-col'>
        <Tab.Panel className='flex justify-center mt-5 flex-1'>
          <SidePanel />
        </Tab.Panel>
        <Tab.Panel className='flex justify-center mt-5 flex-1'>
          <ChatBox />
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  )
}
