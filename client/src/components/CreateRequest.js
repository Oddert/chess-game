import React from 'react'

import './styles/CreateRequest.css'

class CreateRequest extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      isOpenRequest: false,
      publicOponents: [],
      oponent: null
    }
    this.toggleOpen = this.toggleOpen.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleOutOfBounds = this.handleOutOfBounds.bind(this)
  }

  componentDidMount () {
    if (this.inputMessage) this.inputMessage = 'Hey! Want to play a game of Chess?'
    fetch('/api/users/public', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    .then(res => res.json())
    .then(res => {
      console.log(res)
      if (res.err) console.log(res.err)
      else this.setState(state => ({ publicOponents: [...state.publicOponents, ...res.users] }))
    })
  }

  toggleOpen () {
    this.setState(state => ({ open: !state.open }))
  }

  selectOponent (oponent) {
    this.setState({ oponent })
  }

  handleSubmit (e) {
    e.preventDefault()
  }

  handleOutOfBounds (e) {
    if (e.target.className === 'requestForm-container') {
      this.setState({ open: false })
    }
  }

  render () {
    return (
      <div className='CreateRequest'>
        <button onClick={this.toggleOpen}>New Match Request +</button>
        {this.state.open
          ? <div className='requestForm-container' onClick={this.handleOutOfBounds}>
              <div className='requestForm'>
                <h2>Challenge a user to a new match!</h2>
                <button>{this.state.isOpenRequest ? 'Challenge another player' : 'Make this an open request'}</button>
                <span>?</span>
                <form onSubmit={this.handleSubmit}>
                  <div className='form-group'>
                    <label htmlFor='userSelect'>Select a user to send to:</label>
                    <div className='userSelect' id='userSelect'>
                      {this.state.publicOponents.map(each =>
                        <div
                          key={each._id}
                          onClick={this.selectOponent.bind(this, each._id)}
                          className={this.state.oponent === each._id ? 'option selected' : 'option'}
                          >
                            <h3 className='username'>{each.username}</h3>
                            <h6 className='id'># {each._id}</h6>
                          </div>
                      )}
                    </div>
                  </div>
                  <div className='form-group requestNote'>
                    <textarea ref={e => this.inputMessage = e} />
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

export default CreateRequest

// const schema = {
//   author: 'auto provide',
//   target: 'User provied'
// }
