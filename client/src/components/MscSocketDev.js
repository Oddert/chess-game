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

  handleSecondTest () {
    socket.emit('mongoose', { id: '5bc125e803a3f4388c11224b' })
    socket.on('mongoose', mongoose_res => console.log({ mongoose_res }))
  }

  render () {
    return (
      <div>
        <button onClick={this.handleTest.bind(this)}>Ping Socket connection</button>
        <button onClick={this.handleSecondTest.bind(this)}>Test Dev Event</button>
      </div>
    )
  }
}

export default MscSocketDev
