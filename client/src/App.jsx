import Nav from './components/Nav'
import { useState } from 'react'
import { UserContext } from './Context/UserContext'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(
    JSON.parse(localStorage.getItem('loggedIn')) || false
  )

  return (
    <UserContext.Provider value={{ userLoggedIn, setUserLoggedIn }}>
      <Toaster />
      <Nav />
      <Outlet />
    </UserContext.Provider>
  )
}

export default App
