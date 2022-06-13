import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../../Firebase'
import { useEffect, useState } from 'react'
import { StageSpinner } from 'react-spinners-kit'

function UsersDetails({ users }) {
  const [usersInfo, setUsersInfo] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const usersLocalStorage = JSON.parse(localStorage.getItem('users_info'))

    if (usersLocalStorage === null) {
      const list = []
      users.map((user) => {
        const userInfo = getDoc(doc(db, 'users', user))
        userInfo.then((userDetails) => {
          list.push({ data: userDetails.data(), id: userDetails.id })
          localStorage.setItem('users_info', JSON.stringify(list))
          setUsersInfo(
            list.map((user) => {
              return user.data
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
          list.push(userLocalDataArr[indexOfData])
        } else {
          const userInfo = getDoc(doc(db, 'users', user))
          userInfo.then((userDetails) => {
            setUsersInfo((prevUsers) => [...prevUsers, userDetails.data()])
            localStorage.setItem(
              'users_info',
              JSON.stringify([
                ...usersLocalStorage,
                { data: userDetails.data(), id: userDetails.id },
              ])
            )
          })
        }
      })
      setUsersInfo(list)
      list = []
    }
    setLoading(false)
  }, [users])

  function handleImageError(e, name) {
    e.target.src = `https://ui-avatars.com/api/?name=${
      name.split(' ')[0]
    }&length=1`
  }

  const usersList = usersInfo?.map((user) => {
    return (
      <div className='relative cursor-pointer'>
        <img
          className='w-6 border-2 border-white dark:border-gray-800 md:w-9 rounded-lg'
          src={user?.profilePicture}
          onError={(e) => handleImageError(e, user.name)}
          alt='user_avatar'
          title='Online'
        />
        <span className='top-0 left-7 absolute w-3 h-3 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full'></span>
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
              class='flex items-center justify-center w-9 h-9 text-xs font-medium text-white bg-gray-700 border-2 border-white rounded-lg hover:bg-gray-600 dark:border-gray-800'
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
