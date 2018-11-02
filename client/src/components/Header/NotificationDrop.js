import React from 'react'
import { connect } from 'react-redux'

import Notification from './Notification'

class NotificationDrop extends React.Component {
  render () {
    return (
      <div className='NotificationDrop'>
        <p className='NotificationDrop-title'>Notifications</p>
        <div className='Notificaiton-container'>
          {this.props.app.notifications.map(each =>
            <Notification item={each} key={each._id} />
          )}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  app: state.app
})

export default connect(mapStateToProps, null)(NotificationDrop)
