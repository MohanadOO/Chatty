import { doc, getDoc } from 'firebase/firestore'
import { db } from '../Firebase'
import { useEffect, useState } from 'react'
import { StageSpinner } from 'react-spinners-kit'

function UsersDetails({ users }) {
  const [Users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const list = []
    users.map((user) => {
      const userInfo = getDoc(doc(db, 'users', user))
      userInfo.then((userDetails) => {
        list.push(userDetails.data())
      })
    })
    setUsers(list)
    setLoading(false)
  }, [users])

  const usersList = Users?.map((user) => {
    return (
      <div className='flex items-center justify-center cursor-pointer'>
        <img
          className='w-9 rounded-lg'
          src={user.profilePicture}
          alt='user_avatar'
        />
      </div>
    )
  })

  return (
    <div className='flex gap-2'>
      {loading ? (
        <StageSpinner />
      ) : (
        <>
          {usersList[0]}
          {usersList[1]}
          {usersList[2]}
          {usersList.length > 3 ? (
            <div className='w-8 h-8 bg-black/50 flex justify-center items-center rounded-lg cursor-pointer text-white'>
              {usersList.length - 3}
            </div>
          ) : (
            ''
          )}
        </>
      )}
    </div>
  )
}

export default UsersDetails
