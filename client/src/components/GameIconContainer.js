import React from 'react'

import GameIcon from './GameIcon'

class GameIconContainer extends React.Component {
  render () {
    return (
      <div className='gameIcon-container'>
        <p>{this.props.title}</p>
        <div className='gameIcon-container-column'>
          {this.props.games.map((each, idx) =>
            <GameIcon key={idx} game={each} callback={this.props.callback} />
          )}
        </div>
      </div>
    )
  }
}

export default GameIconContainer
