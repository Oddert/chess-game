import React from 'react'

import GameIcon from './GameIcon'

import './styles/OnlineContainer.css'

class GameIconContainer extends React.Component {
  render () {
    return (
      <div className='GameIcon-container'>
        {this.props.games.map((each, idx) =>
          <GameIcon key={idx} game={each} callback={this.props.callback} />
        )}
      </div>
    )
  }
}

export default GameIconContainer
