import React from 'react'
import { connect } from 'react-redux'

import BoardWrapper from './BoardWrapper'
import GameIconContainer from './GameIconContainer'

import TemporaryAuth from './TemporaryAuth'

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
  }

  callback () {
    this.setState({ playing: true })
  }

  render () {
    return (
      <div>
        {!this.state.playing ? <h2>Select Game</h2> : ''}
        <TemporaryAuth /><br />
        {this.state.playing
          ? <BoardWrapper />
          : <GameIconContainer games={this.state.publicGames} callback={this.callback} />
        }
      </div>
    )
  }
}

export default connect(null, null)(OnlineContainer)
