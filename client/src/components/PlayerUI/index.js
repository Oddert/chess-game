import React from 'react'
import { connect } from 'react-redux'
import PieceIcons from './PieceIcons'
import ScoreIndicator from './ScoreIndicator'

import '../styles/PlayerUI.css'

class PlayerUI extends React.Component {
  render () {
    const { players, thisClientPlayer } = this.props.game
    const clientIsBlack = thisClientPlayer === 0
    return (
      <div className='playerUI'>
        <div 
          className={`takenPieces black ${clientIsBlack ? 'client' : ''}`}
        >
          <ScoreIndicator 
            players={players} 
            color={'black'} 
          />
          <PieceIcons 
            players={players} 
            color={'black'} 
          />
        </div>
        <div
          className={`takenPieces white ${!clientIsBlack ? 'client' : ''}`}
        >
        <ScoreIndicator 
          players={players} 
          color={'white'} 
        />
        <PieceIcons 
          players={players} 
          color={'white'} 
        />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  // app: state.app,
  game: state.game
})

export default connect(mapStateToProps, null)(PlayerUI)
