import React from 'react'

import GameUI from './GameUI'
import Board from './Board'
import PlayerUI from './PlayerUI'

class BoardWrapper extends React.Component {
  render () {
    return (
      <div className='board-container'>
        <GameUI />
        <Board />
        <PlayerUI />
      </div>
    )
  }
}



export default BoardWrapper
