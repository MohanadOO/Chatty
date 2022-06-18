import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../../Firebase'
import { useEffect, useState, useContext } from 'react'
import { StageSpinner } from 'react-spinners-kit'
import { RoomContext } from '../../../../Context/RoomContext'

function UsersDetails({ users }) {
  const { connectedUsersStatue } = useContext(RoomContext)

  const [usersInfo, setUsersInfo] = useState([])
  const [usersStatueInfo, setUsersStatueInfo] = useState([])

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const usersLocalStorage = JSON.parse(localStorage.getItem('users_info'))

    if (usersLocalStorage === null) {
      const list = []
      users.map((user) => {
        const userInfo = getDoc(doc(db, 'users', user))
        userInfo.then((userDetails) => {
          list.push({ data: userDetails.data(), id: user })
          localStorage.setItem('users_info', JSON.stringify(list))
          setUsersInfo(
            list.map((user) => {
              return { data: user.data, id: user }
            })
          )
        })
      })
    } else {
      let list = []
      users.forEach((user) => {
        const userLocalIdArr = usersLocalStorage.map(
          (userLocal) => userLocal.id
        )
        const userLocalDataArr = usersLocalStorage.map(
          (userLocal) => userLocal.data
        )

        if (userLocalIdArr.includes(user)) {
          const indexOfData = userLocalIdArr.indexOf(user)
          list.push({
            data: userLocalDataArr[indexOfData],
            id: userLocalIdArr[indexOfData],
          })
        } else {
          const userInfo = getDoc(doc(db, 'users', user))
          userInfo.then((userDetails) => {
            setUsersInfo((prevUsers) => [
              ...prevUsers,
              { data: userDetails.data(), id: user },
            ])
            localStorage.setItem(
              'users_info',
              JSON.stringify([
                ...usersLocalStorage,
                { data: userDetails.data(), id: user },
              ])
            )
          })
        }
      })
      setUsersInfo(list)
      list = []
    }
  }, [users])

  useEffect(() => {
    if (usersInfo) {
      let userStatue
      const usersStateInfo = usersInfo.map((friend) => {
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
      setUsersStatueInfo(() => usersStateInfo)
      setLoading(false)
    }
  }, [connectedUsersStatue, usersInfo])


  function handleImageError(e, name) {
    e.target.src = `https://ui-avatars.com/api/?name=${
      name.split(' ')[0]
    }&length=1`
  }

  const usersList = usersStatueInfo?.map((user) => {
    return (
      <div className='relative cursor-pointer'>
        <img
          className={`${
            user?.statue === 'online' ? 'ring-green-400 ' : 'ring-gray-400 '
          } w-6 ring-2 md:w-9 rounded-lg`}
          src={user?.data.profilePicture}
          onError={(e) => handleImageError(e, user.data.name)}
          alt='user_avatar'
          title={`${user?.statue === 'online' ? 'Online' : 'Offline'}`}
        />
      </div>
    )
  })

  return (
    <div className='flex gap-2'>
      {loading ? (
        <StageSpinner />
      ) : (
        <div className='flex -space-x-2'>
          {usersList[0]}
          {usersList[1]}
          {usersList[2]}
          {usersList.length > 3 ? (
            <a
              className='flex items-center justify-center w-6 h-6 md:w-9 md:h-9 text-xs font-medium text-white bg-gray-700 ring-2 ring-white rounded-lg hover:bg-gray-600 dark:ring-gray-800'
              href='#'
            >
              {usersList.length - 3}
            </a>
          ) : (
            ''
          )}
        </div>
      )}
    </div>
  )
}

export default UsersDetails
