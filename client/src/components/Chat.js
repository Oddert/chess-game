import React from 'react'
import { connect } from 'react-redux'

import socket from '../sockets'
import { chatMessage } from '../actions'

import './styles/Chat.css'

class MoveLogs extends React.Component {
  componentDidMount () {
    socket.on('chat-message', payload => {
      this.props.chatMessage(payload)
    })
  }

  handleSubmit (e) {
    e.preventDefault()
    console.log(this.input.value)
    socket.emit('chat-message', {
      text: this.input.value,
      time: new Date().toString(),
      author: {
        id: this.props.app.auth.user._id,
        username: this.props.app.auth.user.username
      }
    })
    this.input.value = ''
  }

  render () {
    return (
      <div className='Chat'>
        <p>Chat</p>
        <div className='messages'>
          {this.props.game.chat.map((each, idx) =>
            <div key={idx}>
              {each.author.username}: {each.text}
            </div>
          )}
        </div>
        {this.props.app.auth.isAuth
          ? <form onSubmit={this.handleSubmit.bind(this)} className='input'>
              <input type='text' ref={e => this.input = e} />
              <button>Send</button>
            </form>
          : <div />
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  app: state.app,
  game: state.game
})

const mapDispatchToProps = dispatch => ({
  chatMessage: payload => dispatch(chatMessage(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(MoveLogs)
