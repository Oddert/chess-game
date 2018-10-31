import React from 'react'
import { connect } from 'react-redux'

import { refreshNotifications } from '../../actions'

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
  }

  toggleOpen () {
    this.setState(state => ({ open: !state.open }))
  }

  render () {
    return (
      <div className='NotificationMenu'>
        <button onClick={this.toggleOpen}>?</button>
        {this.state.open ? <NotificationDrop /> : ''}
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  refreshNotifications: payload => dispatch(refreshNotifications(payload))
})

export default connect(null, mapDispatchToProps)(NotificationMenu)
