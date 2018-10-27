import React from 'react'
import { connect } from 'react-redux'

import { login, logout } from '../actions'

import CreateRequest from './CreateRequest'
import BoardWrapper from './BoardWrapper'
import GameIconContainer from './GameIconContainer'
import RequestIconContainer from './RequestIconContainer'

import './styles/OnlineContainer.css'

class OnlineContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      playing: false
    }
    this.callback = this.callback.bind(this)
  }

  componentDidMount () {
    fetch('/api/auth/ping', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    .then(res => res.json())
    .then(res => {
      console.log(res)
      if (res.err) {
        console.log(res.err)
      } else {
        if (!this.props.app.auth.isAuth === res.isAuth) {
          if (res.isAuth) this.props.login(res.user)
          else this.props.logout()
        } else {console.log('Auth in sync.')}
      }
    })
  }

  callback () {
    this.setState({ playing: true })
  }

  render () {
    const auth = this.props.app.auth
    return (
      <div>
        <div className='OnlineContainer-title'>
          {!this.state.playing ? <h2>Select Game</h2> : ''}
        </div>
        {(!this.state.playing && this.props.app.auth.isAuth) ? <CreateRequest /> : ''}
        {this.state.playing
          ? <BoardWrapper />
          : <div>
              <div className='OnlineContainer-select'>
                <GameIconContainer type='public' callback={this.callback} />
                {auth.isAuth
                  ? <GameIconContainer type='user' callback={this.callback} />
                  : ''
                }
              </div>
              <div className='OnlineContainer-select'>
                <RequestIconContainer mode='public' callback={this.callback} />
                <RequestIconContainer mode='inbound' callback={this.callback} />
                <RequestIconContainer mode='outbound' callback={this.callback} />
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

const mapDispatchToProps = dispatch => ({
  login: payload => dispatch(login(payload)),
  logout: () => dispatch(logout())
})

export default connect(mapStateToProps, mapDispatchToProps)(OnlineContainer)


// w=white, b=black, f=from, t=to, x=take
// const sampleGameNotation = [
//   {
//     w: {f: 'Ba3', t: 'Bb2', x: false},
//     b: {f: 'Pd7', t: 'Pd5', x: false}
//   },
//   {
//     w: {f: 'Rh1', t: 'Rh4', x: true},
//     b: {f: 'Pe2', t: 'Pe4', x: false}
//   }
// ]

// displays as '
//  1. Bcb2  Pd5
//  2. Rxh4 Pe4'

// a second letter after capital indicates the 'from' col
// x indicates a take
// this json used for full accuracy
// e8=Q indicates a pawn promotion on e8 to a queen (I will use Pe8=Q)
