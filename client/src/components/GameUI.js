import React from 'react'
import { connect } from 'react-redux'

import MoveLogs from './MoveLogs'
import Chat from './Chat'

import './styles/GameUI.css'

class GameUI extends React.Component {
  render () {
    const { localGame } = this.props.app
    const blacksTurn = this.props.game.turn === 0
    return (
      <div className='GameUI'>
        <div>It is {blacksTurn ? 'black' : 'white'}'s turn</div>
        <div className={`messageFlex ${localGame && 'local'}`}>
          <MoveLogs />
          {!localGame && <Chat />}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  app: state.app,
  game: state.game
})

export default connect(mapStateToProps, null)(GameUI)
