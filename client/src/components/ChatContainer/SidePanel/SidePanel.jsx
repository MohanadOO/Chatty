import { CreateRoomModal } from '../../Modals/CreateRoomModal'
import { DiscloseRooms } from './DiscloseRooms'
import { DiscloseUsers } from './DiscloseUsers'

function SidePanel() {
  return (
    <div className='scrollbar-thin scrollbar-thumb-purple-700 active:scrollbar-thumb-purple-400 scrollbar-track-slate-100 dark:scrollbar-track-zinc-900 dark:scrollbar-thumb-purple-900 scroll-smooth md:w-64 w-full overflow-y-auto dark:bg-zinc-900 scrollbar-default px-2'>
      <div className='my-4 px-7'>
        <CreateRoomModal />
        <DiscloseRooms />
        <DiscloseUsers />
      </div>
    </div>
  )
}

export default SidePanel
