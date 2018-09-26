import React from 'react'

import Board from './Board'
import PlayerUI from './PlayerUI'

class Container extends React.Component {
  render () {
    return (
      <div className='container'>
        <div />
        <Board />
        <PlayerUI />
      </div>
    )
  }
}

export default Container
