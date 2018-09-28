import React from 'react'
import { connect } from 'react-redux'

import Board from './Board'
import PlayerUI from './PlayerUI'

class Container extends React.Component {
  render () {
    return (
      <div className='container'>
        <div>It is {this.props.game.turn === 0 ? 'black' : 'white'}'s Turn'</div>
        <Board />
        <PlayerUI />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  game: state.game
})

export default connect(mapStateToProps, null)(Container)
