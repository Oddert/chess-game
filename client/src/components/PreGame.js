import React from 'react'
import { connect } from 'react-redux'

import { playLocal, playOnline } from '../actions'

class PreGame extends React.Component {
  render () {
    return (
      <div>
        <h3>do u think this is a game</h3>
        <button onClick={() => this.props.playLocal()}>Play Local</button>
        <button onClick={() => this.props.playOnline()}>Play Online</button>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  playLocal: () => dispatch(playLocal()),
  playOnline: () => dispatch(playOnline())
})

export default connect(null, mapDispatchToProps)(PreGame)
