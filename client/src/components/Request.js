import React from 'react'
import { connect } from 'react-redux'

import { selectGame, editRequest } from '../actions'
import socket from '../sockets'

import './styles/Request.css'

class Request extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      editing: false
    }
    this.toggleOpen = this.toggleOpen.bind(this)
    this.toggleEdit = this.toggleEdit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.handleOutOfBounds = this.handleOutOfBounds.bind(this)
    this.handleAccept = this.handleAccept.bind(this)
  }

  toggleOpen () {
    this.setState(state => ({ open: !state.open }))
  }

  toggleEdit () {
    this.setState((state, props) =>
      state.editing
        ? ({ editing: !state.editing })
        : ({ editing: !state.editing, message: props.item.message })
      )
  }

  handleChange (e) {
    this.setState({ [e.target.className]: e.target.value })
  }

  handleSave () {
    this.toggleEdit()
    socket.emit('edit-request', {
      id: this.props.item._id,
      data: {
        message: this.state.message
      }
    })
    socket.on('edit-request', payload => this.props.editRequest(payload))
  }

  handleOutOfBounds (e) {
    if (e.target.className === 'RequestOpen-container') {
      this.setState({ open: false })
    }
  }

  handleAccept () {
    socket.emit('accept-request', this.props.item._id)
    socket.on('accept-request', payload => {
      console.log(payload)
      this.props.selectGame(Object.assign({}, payload.game, { thisClientPlayer: 0 }))
      this.props.callback()
    })
  }

  render () {
    const item = this.props.item
    const app = this.props.app
    const isAuthor = item.author.id === app.auth.user._id

    return (
      <div className='Request'>

        <button className='req-icon' onClick={this.toggleOpen}>
          {item.open ? 'Public request by' : 'Request from'} <strong>{item.author.username}</strong>
        </button>

        {this.state.open
          ? <div className='RequestOpen-container' onClick={this.handleOutOfBounds}>
              <div className='RequestOpen'>
                {isAuthor
                  ? this.state.editing
                    ? <div>
                        <button onClick={this.handleSave}>Save</button>
                        <button onClick={this.toggleEdit}>Close without saving</button>
                      </div>
                    : <button onClick={this.toggleEdit}>Click to edit</button>
                  : ''
                }
                <h5>{item.author.username} says:</h5>
                {this.state.editing
                  ? <textarea className='message' value={this.state.message} onChange={this.handleChange} />
                  : <h4 className='message'>{item.message}</h4>
                }
                <h6 className='date'>
                  {item.updated
                    ? `Updated ${new Date(item.updated).toString()}`
                    : `Created ${new Date(item.created).toString()}`
                  }
                </h6>
                {!item.open
                  ? <textarea placeholder='Add a responce message here' />
                  : ''
                }
                <div className='accept-buttons'>
                  {item.open
                    ? ''
                    : <div>
                        <button className='decline'>Decline Offer</button>
                      </div>
                  }
                  <div>
                    <button className='close' onClick={this.toggleOpen}>Close</button>
                    {!isAuthor
                      ? app.auth.isAuth
                        ? <button className='accept' onClick={this.handleAccept}>Accept</button>
                        : <button className='accept disabled' disabled title='Login to accept this request'>Accept</button>
                      : ''
                    }
                  </div>
                </div>
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

const mapDispatchToProps = dispatch => ({
  selectGame: payload => dispatch(selectGame(payload)),
  editRequest: payload => dispatch(editRequest(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(Request)
