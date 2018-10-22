import React from 'react'
import { connect } from 'react-redux'

import socket from '../sockets'

import './styles/CreateRequest.css'

class CreateRequest extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,

      isOpenRequest: false,
      friendsOnly: true,

      publicOponents: [],
      friends: [],

      oponent: null,
      message: 'Hey! Want to play a game of Chess?'
    }
    this.toggleOpen = this.toggleOpen.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleOutOfBounds = this.handleOutOfBounds.bind(this)
    this.toggleOpenRequest = this.toggleOpenRequest.bind(this)
    this.toggleFriendsOnly = this.toggleFriendsOnly.bind(this)
    this.messageChange = this.messageChange.bind(this)
  }

  componentDidMount () {
    fetch('/api/users/public', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    .then(res => res.json())
    .then(res => {
      if (res.err) console.log(res.err)
      else this.setState(state => ({ publicOponents: [...state.publicOponents, ...res.users] }))
    })
    fetch('/api/users/friends', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    .then(res => res.json())
    .then(res => {
      console.log(res)
      if (res.err) console.log(res.err)
      else this.setState(state => ({ friends: [...state.friends, ...res.users] }))
    })
  }

  toggleOpen (e) {
    e.preventDefault()
    this.setState(state => ({ open: !state.open }))
  }

  selectOponent (oponent) {
    this.setState(state =>
      (state.oponent && state.oponent._id === oponent._id)
        ? ({ oponent: null })
        : ({ oponent })
    )
  }

  messageChange (e) {
    this.setState({ message: e.target.value })
  }

  toggleOpenRequest (e) {
    e.preventDefault()
    this.setState(state => ({ isOpenRequest: !state.isOpenRequest }))
  }

  toggleFriendsOnly (e) {
    e.preventDefault()
    this.setState(state => ({ friendsOnly: !state.friendsOnly }))
  }

  handleSubmit (e) {
    e.preventDefault()
    
    const payload = {
      targetUser: this.state.oponent ? this.state.oponent._id : null,
      user: this.props.app.auth.user._id,
      message: /\S/.test(this.state.message) ? this.state.message : null,
      openRequest: this.state.isOpenRequest
    }
    console.log(payload)
    socket.emit('new-request', payload)
    this.setState({ open: false })
  }

  handleOutOfBounds (e) {
    if (e.target.className === 'requestForm-container') {
      this.setState({ open: false })
    }
  }

  render () {
    const users = this.state.friendsOnly ? this.state.friends : this.state.publicOponents
    return (
      <div className='CreateRequest'>
        <button onClick={this.toggleOpen}>New Match Request +</button>
        {this.state.open
          ? <div className='requestForm-container' onClick={this.handleOutOfBounds}>
              <div className='requestForm'>
                <h2>Challenge someone to a new match!</h2>

                <div className='newRequestFlex'>
                  <div className='fill' />

                  <button className='toggleOpenRequest' onClick={this.toggleOpenRequest}>{this.state.isOpenRequest ? 'Challenge another player' : 'Make an open offer'}</button>

                  <div className='request-explination-container'>
                    <div className='request-explination' title='Open requests can be accepted by anyone.
Closed requests are a specific player only'>?</div>
                    <div className='fill'></div>
                  </div>

                </div>

                <form onSubmit={this.handleSubmit}>

                  <div className='form-flex'>

                    <div className='form-group user'>
                      <div className={this.state.isOpenRequest ? 'cover active' : 'cover'}></div>
                      <button
                        onClick={this.toggleFriendsOnly}
                        title={this.state.friendsOnly ? 'Showing your friends list' : 'Showing all users'}
                      >
                          Mode: {this.state.friendsOnly ? 'Friends Only' : 'All Users'}
                      </button><br />
                      <label htmlFor='userSelect'>Select a user to send to:</label>
                      <div className='userSelect' id='userSelect'>
                        {
                          users.map(each =>
                            each._id === this.props.app.auth.user._id
                            ? ''
                            : <div
                                key={each._id}
                                onClick={this.selectOponent.bind(this, each)}
                                className={(this.state.oponent && this.state.oponent._id === each._id) ? 'option selected' : 'option'}
                              >
                                <h3 className='username'>{each.username}</h3>
                                <h6 className='id'># {each._id}</h6>
                              </div>
                          )
                        }
                      </div>
                    </div>

                    <div className='form-group requestNote'>
                      <label htmlFor='message'>Attach a message:</label>
                      <textarea id='message' value={this.state.message} onChange={this.messageChange} />
                      <div className='submit'>
                        {(!this.state.isOpenRequest && !this.state.oponent) ? <button disabled title='Select another user or change to open request'>Create +</button> : <button>Create +</button>}
                      </div>
                    </div>

                  </div>

                </form>

              </div>
            </div>
          : ''
          }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  app: state.app
})

export default connect(mapStateToProps, null)(CreateRequest)

// const schema = {
//   author: 'auto provide',
//   target: 'User provied'
// }
