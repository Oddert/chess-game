import React from 'react'
import { connect } from 'react-redux'

import MoveLogs from './MoveLogs'
import Chat from './Chat'

import './styles/GameUI.css'

class GameUI extends React.Component {
  render () {
    return (
      <div className='GameUI'>
        <div>It is {this.props.game.turn === 0 ? 'black' : 'white'}'s Turn</div>
        <div className='messageFlex'>
          <MoveLogs />
          {!this.props.app.localGame ? <Chat /> : ''}
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
