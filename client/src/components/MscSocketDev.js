import React from 'react'

import socket from '../sockets'

class MscSocketDev extends React.Component {
  handleTest () {
    let payload = Math.floor(Math.random() * 3000)
    console.log(`Test Value is: ${payload}`)
    socket.emit('tester', payload)
    console.log('ping sent...')
    socket.on('tester', res => {
      console.log(`...responce: ${res}`)
    })
  }

  render () {
    return (
      <button onClick={this.handleTest.bind(this)}>Ping Socket connection</button>
    )
  }
}

export default MscSocketDev
