import React from 'react'

import '../styles/Notification.css'

class Notification extends React.Component {
  render () {
    return (
      <div className={this.props.item.read ? 'Notification' : 'Notification unread'}>
        <p className='title'>{this.props.item.name}</p>
        <p className='message'>{this.props.item.message}</p>
        <p className='date'>{new Date(this.props.item.created).toLocaleString()}</p>
      </div>
    )
  }
}

export default Notification
