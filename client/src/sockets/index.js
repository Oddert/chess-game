import openSocket from 'socket.io-client'

console.log(`Socket loading: provess.env.NODE_ENV = ${process.env.NODE_ENV}`)
const socket = process.env.NODE_ENV === 'development' ? openSocket(`http://localhost:5000/`) : openSocket()

export default socket
