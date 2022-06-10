import { Tab } from '@headlessui/react'
import SidePanel from './SidePanel'
import { RoomContext } from '../Context/RoomContext'
import { ChatContext } from '../Context/ChatContext'
import { useState, useEffect, useContext } from 'react'
import { getMatchedRooms } from '../Firebase'
import ChatBox from './ChatBox'

function ChatContainer() {
  const { userRooms, socket } = useContext(ChatContext)
  const [matchedRooms, setMatchedRooms] = useState([])
  const [switchTab, setSwitchTab] = useState(0)
  const [room, setRoom] = useState(undefined)
  const [friend, setFriend] = useState(undefined)

  useEffect(() => {
    //Get All the rooms details that the user is joined to {name, id, owners, users, avatar}
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
      }}
    >
      <div className='md:flex hidden justify-center gap-3 py-5 h-[83vh] border-y-2 border-primary-400/40'>
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
      <Tab.List className='flex w-full justify-evenly bg-primary-400/50 rounded-lg p-1'>
        <Tab
          onClick={() => setSwitchTab(0)}
          className={({ selected }) =>
            classNames(
              ' text-primary-500 font-bold text-sm ml-2 py-3 rounded-lg flex-1 transition-colors',
              selected
                ? 'bg-white'
                : 'text-black/50 hover:bg-primary-500 hover:text-white'
            )
          }
        >
          Rooms & Users
        </Tab>
        <Tab
          onClick={() => setSwitchTab(1)}
          className={({ selected }) =>
            classNames(
              ' text-primary-500 font-bold text-sm ml-2 py-3 rounded-lg flex-1 transition-colors',
              selected
                ? 'bg-white'
                : 'text-black/50 hover:bg-primary-500 hover:text-white'
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
