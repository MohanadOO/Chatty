//Send Messages through the socket
export function sendMessageSocket(socket, messageDetails, chat, room) {
  if (chat?.length > 0) {
    socket.emit('send_message', {
      chat: [...chat, messageDetails],
      room,
    })
  } else {
    socket.emit('send_message', {
      chat: [messageDetails],
      room,
    })
  }
}

//Send User Messages through the socket
export function sendUserMessageSocket(
  socket,
  messageDetails,
  chat,
  messageRef
) {
  if (chat?.length > 0) {
    socket.emit('send_user_message', {
      chat: [...chat, messageDetails],
      messageRef,
    })
  } else {
    socket.emit('send_user_message', {
      chat: [messageDetails],
      messageRef,
    })
  }
}
