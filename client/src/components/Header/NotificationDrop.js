import React from 'react'
import { connect } from 'react-redux'

class NotificationDrop extends React.Component {
  render () {
    return (
      <div className='NotificationDrop'>
        <p>notificaitons will hence be displayed to be goes here</p>
        {this.props.app.notifications.map(each => <div key={each._id}>{each.name}</div>)}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  app: state.app
})

export default connect(mapStateToProps, null)(NotificationDrop)
