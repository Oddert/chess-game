import React from 'react'

import Title from './Title'
import GameUI from './GameUI'
import Board from './Board'
import PlayerUI from './PlayerUI'

class BoardWrapper extends React.Component {
  render () {
    return (
      <div>
        <Title />
        <div className='board-container'>
          <GameUI />
          <Board />
          <PlayerUI />
        </div>
      </div>
    )
  }
}



export default BoardWrapper
