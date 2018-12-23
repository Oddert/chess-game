import React from 'react'

import socket from '../../sockets'

class RequestDecline extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      open: false
    }
    this.toggleOpen = this.toggleOpen.bind(this)
    this.handleDecline = this.handleDecline.bind(this)
  }

  toggleOpen () {
    this.setState(state => ({ open: !state.open }))
  }

  handleDecline () {
    socket.emit('decline-request', {
      id: this.props.id,
      responce: this.props.responce
    })
    socket.on('decline-request', payload => {
      console.log(payload)
      if (payload.err) console.log(payload.err)
      else this.props.cb()
    })
  }

  render () {
    return (
      <div>
        {!this.state.open
          ? <button className='decline' onClick={this.toggleOpen}>Decline Offer</button>
          : <div className="decline-confirm">
              <strong>Are you sure you want to decline this request? (This cannot be undone)</strong>
              <button className="decline-no" title="Click this to cancle" onClick={this.toggleOpen}>Go Back</button>
              <button className="decline-yes" title="Clicking this will decline the offer" onClick={this.handleDecline}>Confirm Decline</button>
            </div>
        }
      </div>
    )
  }
}

export default RequestDecline
