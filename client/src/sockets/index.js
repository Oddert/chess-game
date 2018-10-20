import openSocket from 'socket.io-client'

const targetCookie = 'connect.sid'

console.log(document.cookie)

function findCookie (input_name) {
  let name = `${input_name}=`
  let decodeSplit = decodeURIComponent(document.cookie).split(';')
  // console.log(decodeSplit)
  for (var i=0; i<decodeSplit.length; i++) {
    var rawCookie = decodeSplit[i]
    // console.log(rawCookie)
    while (rawCookie.charAt(0) === ' ') {
      rawCookie = rawCookie.substring(1)
    }
    if (rawCookie.indexOf(name) === 0) {
      return rawCookie.substring(name.length, rawCookie.length)
    }
  }
}

console.log('AAAaaannndd the cookie is.........')
console.log(findCookie(targetCookie))


const query = { token: 'session_id=' + findCookie(targetCookie) + ';' }
console.log(query)

console.log(`Socket loading: provess.env.NODE_ENV = ${process.env.NODE_ENV}`)
const socket = process.env.NODE_ENV === 'development'
  ? openSocket(`http://localhost:5000/`, {
  // ? openSocket(`//${window.location.host}`, {
    query
  })
  : openSocket()

export default socket
