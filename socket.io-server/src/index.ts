import { Server } from 'socket.io'
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from 'unique-names-generator'

const io = new Server({
  cors: {
    origin: '*',
  },
})

const generateUsername = () => {
  return uniqueNamesGenerator({
    dictionaries: [adjectives, colors, animals],
    length: 2,
    separator: '',
    style: 'capital',
  })
}

io.on('connection', (socket) => {
  const username = generateUsername()

  socket.emit('user joined', username)

  socket.on('join room', (room) => {
    socket.join(room)

    io.to(room).emit('chat message', {
      username: 'System',
      message: `${username} has joined the room.`,
    })
  })

  socket.on('chat message', ({ username, room, message }) => {
    io.to(room).emit('chat message', { username, message })
  })

  socket.on('disconnect', () => {
    console.log('A user disconnected!')
  })
})
io.listen(4000)
