import React from 'react'

import GameIcon from './GameIcon'
import BoardWrapper from './BoardWrapper'

import TemporaryAuth from './TemporaryAuth'

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
  }

  callback () {
    this.setState({ playing: true })
  }

  render () {
    return (
      <div>
        {!this.state.playing ? <h2>Select Game</h2> : ''}
        <TemporaryAuth /><br />
        <button>Main Menu</button>
        {this.state.playing
          ? <BoardWrapper />
          : <div>
              <button onClick={this.getPublicGames}>Refresh Games</button>
              <div className='GameIcon-container'>
                {this.state.publicGames.map((each, idx) => <GameIcon key={idx} game={each} callback={this.callback} />)}
              </div>
            </div>
        }
      </div>
    )
  }
}

export default OnlineContainer
