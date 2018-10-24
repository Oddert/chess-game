import React from 'react'
import { connect } from 'react-redux'

import socket from '../sockets'

import './styles/Request.css'

class Request extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false
    }
    this.toggleOpen = this.toggleOpen.bind(this)
    this.handleOutOfBounds = this.handleOutOfBounds.bind(this)
    this.handleAccept = this.handleAccept.bind(this)
  }

  toggleOpen () {
    this.setState(state => ({ open: !state.open }))
  }

  handleOutOfBounds (e) {
    if (e.target.className === 'RequestOpen-container') {
      this.setState({ open: false })
    }
  }

  handleAccept () {
    socket.emit('accept-request', this.props.item._id)
    socket.on('accept-request', payload => console.log(payload))
  }

  render () {
    const item = this.props.item
    const app = this.props.app
    return (
      <div className='Request'>
        {!this.state.open
          ? <button className='req-icon' onClick={this.toggleOpen}>Public request by <strong>{item.author.username}</strong></button>
          : <div className='RequestOpen-container' onClick={this.handleOutOfBounds}>
              <div className='RequestOpen'>
                <h5>{item.author.username} says:</h5>
                <h4 className='message'>{item.message}</h4>
                {item.open ? '' : <textarea placeholder='Add a responce message here' />}
                <div className='accept-buttons'>
                  {item.open ? '' : <div><button className='decline'>Decline Offer</button></div>}
                  <div>
                    <button className='close' onClick={this.toggleOpen}>Close</button>
                    {app.auth.isAuth
                      ? <button className='accept' onClick={this.handleAccept}>Accept</button>
                      : <button className='accept disabled' disabled title='Login to accept this request'>Accept</button>
                    }
                  </div>
                </div>
              </div>
            </div>
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  app: state.app
})

export default connect(mapStateToProps, null)(Request)
