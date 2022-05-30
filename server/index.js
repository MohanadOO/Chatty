const app = require('express')()
const server = require('http').createServer(app)

const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`)

  socket.on('join_room', (data) => {
    console.log(`User Joined room: ${data}`)
    socket.join(data)
    console.log(`User Joined: ${socket.id}`)
  })

  socket.on('send_message', (data) => {
    console.log(data)
    socket.to(data.room.id).emit('receive_message', data)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected')
  })
})

server.listen(3001, () => {
  console.log('Server is running on port 3001')
})
