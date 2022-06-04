// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from 'firebase/auth'
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
  doc,
  getDocs,
  serverTimestamp,
  Timestamp,
  query,
  where,
  setDoc,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { nanoid } from 'nanoid'
import toast from 'react-hot-toast'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECTID,
  storageBucket: import.meta.env.VITE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGEINSENDERID,
  appId: import.meta.env.VITE_APPID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
const provider = new GoogleAuthProvider()

//Provide Sign In With Google Pop Up!
export const signInWithGoogle = () => signInWithPopup(auth, provider)

//Check User Authentication state.
export function useAuth() {
  const [currentUser, setCurrentUser] = useState({})
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => setCurrentUser(user))
    return unsub
  }, [])
  return currentUser
}

//Get User Rooms if Exist.
export const getUserRooms = async (currentUser) => {
  try {
    const userDocument = await getDoc(doc(db, 'users', currentUser.uid))
    const roomsArr = userDocument.data().rooms

    if (roomsArr === undefined) {
      return []
    } else {
      return roomsArr
    }
  } catch (error) {
    return console.error(error)
  }
}

//Get Rooms details from room collection that matched the user rooms list.
export const getMatchedRooms = async (userRooms) => {
  try {
    const querySnapshot = await getDocs(collection(db, 'rooms'))
    const matchedRoom = []
    querySnapshot.forEach((doc) => {
      userRooms.forEach((room) => {
        if (room.id === doc.id) {
          matchedRoom.push({ ...doc.data(), id: doc.id })
        }
      })
    })
    return matchedRoom
  } catch (error) {
    return console.error(error)
  }
}

export const getAllRooms = async () => {
  try {
    const allRooms = []
    const querySnapshot = await getDocs(collection(db, 'rooms'))
    querySnapshot.forEach((doc) => {
      allRooms.push({ data: doc.data(), id: doc.id })
    })
    return allRooms
  } catch (error) {
    return console.error(error)
  }
}

export const getAllUsers = async (currentUser, friends) => {
  try {
    if (friends.length === 0) {
      const allUsers = []
      const querySnapshot = await getDocs(collection(db, 'users'))
      querySnapshot.forEach((doc) => {
        if (doc.id !== currentUser.uid)
          allUsers.push({ data: doc.data(), id: doc.id })
      })
      return allUsers
    } else {
      const allUsers = []
      const q = query(
        collection(db, 'users'),
        where('friends', 'not-in', friends)
      )
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        if (doc.id !== currentUser.uid)
          allUsers.push({ data: doc.data(), id: doc.id })
      })
      return allUsers
    }
  } catch (error) {
    console.error(error)
  }
}

export const getFriends = async (currentUser) => {
  try {
    const friends = await getDoc(doc(db, 'users', currentUser.uid))
    return friends.data().friends
  } catch (error) {
    console.error(error)
  }
}
//Get room Messages
export const getRoomMessages = async (roomId) => {
  try {
    const room = await getDoc(doc(db, 'rooms', roomId))
    return room.data().messages
  } catch (error) {
    console.error(error)
  }
}
export const getUsersConversation = async (currentUser, friendID) => {
  try {
    const currentUserRef = await getDoc(doc(db, 'users', currentUser.uid))
    const friendsRef = currentUserRef.data().friends

    const messageDocRef = friendsRef.filter((friend) => {
      if (friend.friendRef.id === friendID) return friend
    })
    const message = await getDoc(
      doc(db, 'messages', messageDocRef[0].messageRef)
    )
    return { messages: message.data().messages, id: message.id }
  } catch (error) {
    console.error(error)
  }
}
//Add Room to database
export const addRoomDB = async (currentUser, room) => {
  const roomAvatar = `https://avatars.dicebear.com/api/identicon/${nanoid(
    10
  )}.svg?radius=50`
  try {
    const docRef = await addDoc(collection(db, 'rooms'), {
      name: room,
      users: [currentUser.uid],
      owners: [currentUser.uid],
      messages: [],
      roomAvatar: roomAvatar,
    })

    await updateDoc(doc(db, 'users', currentUser.uid), {
      rooms: arrayUnion({ name: room, id: docRef.id }),
    })

    toast.success('Room Created 👍')
    return {
      name: room,
      id: docRef.id,
      owners: [currentUser.uid],
      roomAvatar: roomAvatar,
      users: [currentUser.uid],
    }
  } catch (error) {
    console.error(error)
  }
}

//Add Friends to database
export const addFriend = async (currentUser, friendID) => {
  const currentUserRef = doc(db, 'users', currentUser.uid)
  const friendRef = doc(db, 'users', friendID)

  try {
    addDoc(collection(db, 'messages'), {
      messages: [],
      users: [currentUser.uid, friendID],
    }).then((docRef) => {
      updateDoc(doc(db, 'users', currentUser.uid), {
        friends: arrayUnion({ friendRef: friendRef, messageRef: docRef.id }),
      })
      updateDoc(doc(db, 'users', friendID), {
        friends: arrayUnion({
          friendRef: currentUserRef,
          messageRef: docRef.id,
        }),
      })
      toast.success('Add Friend ✅')
    })
    return getDoc(doc(db, 'users', friendID))
  } catch (error) {
    toast.error('Error ❌')
    console.error(error)
  }
}

//Save Message
export const saveMessage = async (roomId, message) => {
  // const time = serverTimestamp()
  try {
    updateDoc(doc(db, 'rooms', roomId), {
      messages: arrayUnion(message),
    })
  } catch (error) {
    console.error(error)
  }
}

export const saveUserMessage = async (messageDocId, message) => {
  try {
    updateDoc(doc(db, 'messages', messageDocId), {
      messages: arrayUnion(message),
    })
  } catch (error) {
    console.error(error)
  }
}

export const JoinRoom = async (roomName, roomId, userId) => {
  try {
    await updateDoc(doc(db, 'rooms', roomId), {
      users: arrayUnion(userId),
    })

    await updateDoc(doc(db, 'users', userId), {
      rooms: arrayUnion({ name: roomName, id: roomId }),
    })

    const roomInfo = await getDoc(doc(db, 'rooms', roomId))
    toast.success('Joined Room ✅')
    return { ...roomInfo.data(), id: roomInfo.id }
  } catch (error) {
    console.error(error)
  }
}
