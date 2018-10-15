import React from 'react'
import { connect } from 'react-redux'

import { playLocal, playOnline } from '../actions'

import './styles/PreGame.css'

class PreGame extends React.Component {
  render () {
    return (
      <div>
        <h3>Select Game Mode</h3>
        <div className='modeSelector'>
          <button onClick={() => this.props.playLocal()}>Play Local</button>
          <button onClick={() => this.props.playOnline()}>Play Online</button>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  playLocal: () => dispatch(playLocal()),
  playOnline: () => dispatch(playOnline())
})

export default connect(null, mapDispatchToProps)(PreGame)
