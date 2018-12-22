import React from 'react'
import { connect } from 'react-redux'

import { selectGame, editRequest, deleteRequest } from '../actions'
import socket from '../sockets'

import RequestDecline from './RequestDecline'

import './styles/Request.css'

class Request extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      editing: false,
      deleteing: false,
      responce: ''
    }
    this.toggleOpen = this.toggleOpen.bind(this)  // R
    this.toggleEdit = this.toggleEdit.bind(this)  // U
    this.toggleDelete = this.toggleDelete.bind(this) // D
    this.handleChange = this.handleChange.bind(this) // U
    this.handleSave = this.handleSave.bind(this)  // C
    this.handleDelete = this.handleDelete.bind(this) // D
    this.handleOutOfBounds = this.handleOutOfBounds.bind(this)
    this.handleAccept = this.handleAccept.bind(this) // C
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

  toggleDelete () {
    this.setState(state => ({ deleteing: !state.deleteing }))
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

  handleDelete () {
    console.log('deleting')
    socket.emit('delete-request', this.props.item._id)
    socket.on('delete-request', payload => {
      if (payload.err) console.error(payload.err)
      else this.props.deleteRequest(payload.id)
    })
    this.toggleDelete()
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
      if (payload.err) console.error(payload.err)
      else {
        this.props.selectGame(Object.assign({}, payload.game, { thisClientPlayer: 0 }))
        this.props.callback()
      }
    })
  }

  render () {
    const item = this.props.item
    const app = this.props.app
    const isAuthor = item.author.id === app.auth.user._id

    let style = {}
    if (item.accepted) style.border = '2px solid limegreen'
    if (item.deleted) style.background = 'tomato'

    return (
      <div className='Request'>

        <button className='req-icon' onClick={this.toggleOpen} title={item._id} style={style}>
          {isAuthor
            ? item.open ? <span>Your Public Request</span> : <span>Your request to <strong>{item.target.username}</strong></span>
            : <span>{item.open ? 'Public request by' : 'Request from'} <strong>{item.author.username}</strong></span>
          }
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
                    : <div>
                      <button onClick={this.toggleEdit}>Click to edit</button>
                      <div>
                        <button onClick={this.toggleDelete}>{this.state.deleteing ? 'Cancel' : 'Delete Request'}</button>
                        {this.state.deleteing ? <button onClick={this.handleDelete}>Confirm Delete</button> : ''}
                      </div>
                    </div>
                  : ''
                }
                {item.openRequest
                  ? <h5>Game request from {item.author.username} to {item.target.username}:</h5>
                  : <h5>Game request from {item.author.username}:</h5>
                }
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
                  ? <textarea className='responce' onChange={this.handleChange} value={this.state.responce} placeholder='Add a responce message here' />
                  : ''
                }
                <div className='accept-buttons'>
                  {item.open
                    ? ''
                    : <RequestDecline id={item._id} responce={this.state.responce} />
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
  editRequest: payload => dispatch(editRequest(payload)),
  deleteRequest: payload => dispatch(deleteRequest(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(Request)
