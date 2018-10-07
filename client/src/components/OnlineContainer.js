import React from 'react'

import GameIcon from './GameIcon'

import './styles/OnlineContainer.css'

class OnlineContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      publicGames: [],
      userGames: []
    }
    this.getPublicGames = this.getPublicGames.bind(this)
  }

  componentDidMount () {
    this.getPublicGames()
  }

  getPublicGames () {
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

  render () {
    return (
      <div>
        <h2>Select Game</h2>
        <button>Main Menu</button>
        <button onClick={this.getPublicGames}>Refresh Games</button>
        <div className='GameIcon-container'>
          {this.state.publicGames.map((each, idx) => <GameIcon key={idx} game={each} />)}
        </div>
      </div>
    )
  }
}

export default OnlineContainer
