import { CreateRoomModal } from './Modals/CreateRoomModal'
import { DiscloseRooms } from './Disclosure/DiscloseRooms'
import { DiscloseUsers } from './Disclosure/DiscloseUsers'

function SidePanel() {
  return (
    <div className=' w-64 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-50 scrollbar-track-primary-50 hover:scrollbar-thumb-slate-500  px-2 '>
      <div className=' cursor-pointer my-4 px-7'>
        <CreateRoomModal />
        <DiscloseRooms />
        <DiscloseUsers />
      </div>
    </div>
  )
}

export default SidePanel
