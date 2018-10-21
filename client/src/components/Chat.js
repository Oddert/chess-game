import React from 'react'
import { connect } from 'react-redux'

import socket from '../sockets'
import { chatMessage } from '../actions'

import './styles/Chat.css'

class Chat extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      autoScroll: true
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleScroll = this.handleScroll.bind(this)
    this.scrollMax = this.scrollMax.bind(this)
  }

  componentDidMount () {
    this.scrollMax()
    socket.on('chat-message', payload => {
      this.props.chatMessage(payload)
      if (this.state.autoScroll) this.scrollMax()
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

  scrollMax () {
    this.messages.scrollTop = this.messages.scrollHeight
  }

  handleScroll () {
    if (this.messages) {
      if (this.messages.scrollHeight - this.messages.scrollTop === this.messages.clientHeight) {
        if (!this.state.autoScroll) this.setState({ autoScroll: true })
      } else {
        if (this.state.autoScroll) this.setState({ autoScroll: false })
      }
    }
  }

  render () {
    const black = this.props.game.players.black.id
    return (
      <div className='Chat'>
        <p>Chat</p>
        <div className='messages' onScroll={this.handleScroll} ref={e => this.messages = e}>
          {this.props.game.chat.map((each, idx) =>
            <div key={idx} className={each.author.id === black ? 'message black' : 'message'}>
              <div className='message-inner'>
                <span className='username'>{each.author.username}</span>: {each.text}
              </div>
              {/* <div className='date'>test date</div> */}
            </div>
          )}
        </div>
        {/* <button className='scrollmax'>auto scroll</button> */}
        {this.props.app.auth.isAuth
          ? <form onSubmit={this.handleSubmit} className='input'>
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

export default connect(mapStateToProps, mapDispatchToProps)(Chat)
