import React from 'react'
import { connect } from 'react-redux'

import { updateTitle } from '../actions'
import socket from '../sockets'

import './styles/Title.css'

class Title extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      editing: false
    }
    this.toggleEdit = this.toggleEdit.bind(this)
    this.handleClickOutside = this.handleClickOutside.bind(this)
  }

  componentDidMount () {
    document.addEventListener('mousedown', this.handleClickOutside)
  }

  componentWillUnmount () {
    document.removeEventListener('mousedown', this.handleClickOutside)
  }

  handleClickOutside (e) {
    if (this.input && !this.input.contains(e.target)) {
      this.setState({ editing: false })
      socket.emit('change-meta', { name: this.props.game.name })
    }
  }

  toggleEdit () {
    this.setState({ editing: !this.state.editing })
  }

  render () {
    return (
      <div className='Title'>
        {!this.state.editing
          ? <h3 onClick={this.props.app.auth.isAuth ? this.toggleEdit : () => {}}>{this.props.game.name}</h3>
          : <input
              type='text'
              ref={e => this.input = e}
              value={this.props.game.name}
              onChange={() => this.props.updateTitle(this.input.value)}
            />
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
  updateTitle: payload => dispatch(updateTitle(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(Title)
