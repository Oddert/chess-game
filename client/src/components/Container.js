import React from 'react'
import { connect } from 'react-redux'

import Board from './Board'
import PlayerUI from './PlayerUI'

class Container extends React.Component {
  render () {
    return (
      <div className='container'>
        {this.props.app.localGame ? <div>You are playing locally</div> : <div>Online play</div>}
        <div className='board-container'>
          <div>It is {this.props.game.turn === 0 ? 'black' : 'white'}'s Turn</div>
          <Board />
          <PlayerUI />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  game: state.game,
  app: state.app
})

export default connect(mapStateToProps, null)(Container)
