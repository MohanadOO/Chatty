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
    const roomsArr = userDocument.data()

    if (roomsArr === undefined) {
      return undefined
    } else {
      return roomsArr
    }
  } catch (error) {
    return console.error(error)
  }
}

//Get Rooms details
export const getRooms = async (userRooms) => {
  try {
    const querySnapshot = await getDocs(collection(db, 'rooms'))
    const matchedRoom = []
    querySnapshot.forEach((doc) => {
      userRooms.rooms.forEach((room) => {
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
export const getAllUsers = async () => {
  try {
    const allUsers = []
    const querySnapshot = await getDocs(collection(db, 'users'))
    querySnapshot.forEach((doc) => {
      allUsers.push(doc.data())
    })
    return allUsers
  } catch (error) {
    console.error(error)
  }
}
//Add Room to database
export const addRoomDB = async (currentUser, room) => {
  try {
    await addDoc(collection(db, 'rooms'), {
      name: room,
      users: [currentUser.uid],
      owners: [currentUser.uid],
      messages: [],
      roomAvatar: `https://avatars.dicebear.com/api/identicon/${nanoid(
        10
      )}.svg?radius=50`,
    }).then((docRef) => {
      updateDoc(doc(db, 'users', currentUser.uid), {
        rooms: arrayUnion({ name: room, id: docRef.id }),
      })
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
