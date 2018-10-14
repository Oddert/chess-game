import React from 'react'
import { connect } from 'react-redux'

import BoardWrapper from './BoardWrapper'
import GameIconContainer from './GameIconContainer'

// import TemporaryAuth from './TemporaryAuth'

import './styles/OnlineContainer.css'

class OnlineContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      publicGames: [],
      userGames: [],
      playing: false
    }
    this.getPublicGames = this.getPublicGames.bind(this)
    this.callback = this.callback.bind(this)
  }

  componentDidMount () {
    this.getPublicGames()
  }

  getPublicGames () {
    console.log(`### Getting Public Games`)
    fetch('/api/games/public', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    .then(res => res.json())
    .then(res => {
      if (res.err) console.log(res.err)
      else this.setState({ publicGames: res.games })
    })
    if (this.props.app.auth.isAuth) {
      console.log(`### Getting User Games`)

    }
  }

  callback () {
    this.setState({ playing: true })
  }

  render () {
    const auth = this.props.app.auth
    return (
      <div>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          {!this.state.playing ? <h2>Select Game</h2> : ''}
          {/* <TemporaryAuth /> */}
        </div>
        {this.state.playing
          ? <BoardWrapper />
          : <div className='onlineContainer-select'>
              <GameIconContainer games={this.state.publicGames} title='Public Games' callback={this.callback} />
              {auth.isAuth
                ? <GameIconContainer games={auth.user.activeGames} title='Your Games' callback={this.callback} />
                : ''
              }
            </div>
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  app: state.app
})

export default connect(mapStateToProps, null)(OnlineContainer)
