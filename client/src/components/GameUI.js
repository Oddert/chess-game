import React from 'react'
import { connect } from 'react-redux'

import MoveLogs from './MoveLogs'

class GameUI extends React.Component {
  render () {
    return (
      <div className='GameUI' style={{flex: '1'}}>
        <div>It is {this.props.game.turn === 0 ? 'black' : 'white'}'s Turn</div>
        <MoveLogs />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  game: state.game
})

export default connect(mapStateToProps, null)(GameUI)
