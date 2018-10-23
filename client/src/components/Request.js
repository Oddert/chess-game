import React from 'react'

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
    fetch('/api/requests/accept', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: this.props.item._id
      })
    })
    .then(res => res.json())
    .then(res => console.log(res))
  }

  render () {
    const item = this.props.item
    return (
      <div className='Request'>
        {!this.state.open
          ? <button className='req-icon' onClick={this.toggleOpen}>Match request by <strong>{item.author.username}</strong></button>
          : <div className='RequestOpen-container' onClick={this.handleOutOfBounds}>
              <div className='RequestOpen'>
                <h5>{item.author.username} says:</h5>
                <h4 className='message'>{item.message}</h4>
                {item.open ? '' : <textarea placeholder='Add a responce message here' />}
                <div className='accept-buttons'>
                  {item.open ? '' : <div><button className='decline'>Decline Offer</button></div>}
                  <div>
                    <button className='close' onClick={this.toggleOpen}>Close</button>
                    <button className='accept'>Accept</button>
                  </div>
                </div>
              </div>
            </div>
        }
      </div>
    )
  }
}

export default Request
