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
} from 'firebase/firestore'
import { useEffect, useState } from 'react'

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
export const getRooms = async (currentUser) => {
  try {
    const userDocument = await getDoc(doc(db, 'users', currentUser.uid))
    const roomsArr = await userDocument._document.data.value.mapValue.fields
      .rooms.arrayValue.values
    if (roomsArr === undefined) {
      return undefined
    } else {
      return roomsArr
    }
  } catch (error) {
    return console.error(error)
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
    })
    await updateDoc(doc(db, 'users', currentUser.uid), {
      rooms: arrayUnion(room),
    })
    console.log('Create Room')
  } catch (error) {
    console.error(error)
  }
}
