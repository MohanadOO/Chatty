import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './routes/Login'
import Signup from './routes/Signup'
import Chat from './routes/Chat'
import Home from './routes/Home'

import io from 'socket.io-client'
const socket = io.connect(import.meta.env.VITE_SERVER_URL, {
  withCredentials: true,
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' exact element={<Home socket={socket} />} />
        <Route path='/' element={<App socket={socket} />}>
          <Route path='login' element={<Login socket={socket} />} />
          <Route path='signup' element={<Signup socket={socket} />} />
          <Route path='chat' element={<Chat socket={socket} />} />
          <Route
            path='*'
            element={
              <h1 className='  absolute top-[50%] left-[50%] translate-x-[-50%]'>
                Wrong Page!
              </h1>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
