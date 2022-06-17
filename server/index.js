const app = require('express')()
const server = require('http').createServer(app)

const PORT = process.env.PORT || 3001

const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})

//List of all connected users
const users = {}

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`)
  socket.to(socket.id).emit('userStatus', users)

  socket.on('join_room', (data) => {
    console.log('Join Room: ' + data)
    socket.join(data)
  })

  socket.on('leave_room', (prevRoom) => {
    console.log('Leave Room: ' + prevRoom)
    socket.leave(prevRoom)
  })

  socket.on('send_message', (data) => {
    socket.to(data.room.id).emit('receive_message', data)
  })

  socket.on('send_user_message', (data) => {
    socket.to(data.messageRef).emit('receive_message', data)
  })

  socket.on('user_typing_user', (roomRef, currentUserName) => {
    socket.to(roomRef).emit('user_typing_to_user', currentUserName)
  })

  socket.on('user_typing_room', (roomRef, currentUserName) => {
    socket.to(roomRef).emit('user_typing_to_room', { roomRef, currentUserName })
  })

  socket.on('login', (data) => {
    console.log('User Logged In: ' + data)
    users[socket.id] = { user: data, statue: 'online' }
    io.emit('getUsersStatus', users)
  })

  socket.on('logout', () => {
    console.log('User Logged Out')
    delete users[socket.id]
    io.emit('getUsersStatus', users)
    console.log(users)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected')
    delete users[socket.id]
    io.emit('getUsersStatus', users)
  })
})



server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
