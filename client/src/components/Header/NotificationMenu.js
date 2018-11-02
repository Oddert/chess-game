import React from 'react'
import { connect } from 'react-redux'

import socket from '../../sockets'
import { refreshNotifications, addNotification } from '../../actions'

import NotificationDrop from './NotificationDrop'

import '../styles/NotificationMenu.css'

class NotificationMenu extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false
    }
    this.toggleOpen = this.toggleOpen.bind(this)
  }

  componentDidMount () {
    fetch('/api/notifications', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    .then(res => res.json())
    .then(res => {
      console.log(res)
      if (res.err) console.log(res.err)
      else this.props.refreshNotifications(res.notifications)
    })
    socket.on('notification', payload => {
      console.log('# New notification!')
      console.log(payload)
      this.props.addNotification(payload)
    })
  }

  toggleOpen () {
    this.setState(state => ({ open: !state.open }))
  }

  render () {
    let number = this.props.app.notifications.filter(each => !each.read).length.toString()
    return (
      <div className='NotificationMenu'>
        <button onClick={this.toggleOpen}>{number}</button>
        {this.state.open ? <NotificationDrop /> : ''}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  app: state.app
})

const mapDispatchToProps = dispatch => ({
  refreshNotifications: payload => dispatch(refreshNotifications(payload)),
  addNotification: payload => dispatch(addNotification(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(NotificationMenu)
