import React from 'react'
import { connect } from 'react-redux'

class NotificationDrop extends React.Component {
  render () {
    return (
      <div className='NotificationDrop'>
        <p>notificaitons will hence be displayed to be goes here</p>
      </div>
    )
  }
}

export default connect(null, null)(NotificationDrop)
