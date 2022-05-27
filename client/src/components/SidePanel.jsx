import { MyModal } from './DialogModal'
import { DiscloseRooms } from './DiscloseRooms'
import { DiscloseUsers } from './DiscloseUsers'

function SidePanel() {
  return (
    <div className=' w-64 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-50 scrollbar-track-primary-50 hover:scrollbar-thumb-slate-500  px-2 '>
      <div className=' cursor-pointer my-4 px-7'>
        <MyModal />
        <DiscloseRooms />
        <DiscloseUsers />
      </div>
    </div>
  )
}

export default SidePanel
