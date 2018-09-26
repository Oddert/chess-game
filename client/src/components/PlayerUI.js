import React from 'react'
import { connect } from 'react-redux'

import './styles/PlayerUI.css'

class PlayerUI extends React.Component {
  conv (e) {
    switch(e) {
      case 'pawn':
        return '♙ '
      case 'rook':
        return '♖ '
      case 'knight':
        return '♘ '
      case 'bishop':
        return '♗ '
      case 'queen':
        return '♕ '
      case 'king':
        return '♔ '
      default:
        return ''
    }
  }

  render () {
    const players = this.props.game.players
    return (
      <div className='playerUI'>
        <div className='takenPieces black'>
          <div className='scoreIndicator'>
            {players.black.score}
          </div>
          <div className='pieceIcons'>
            {players.black.takenPieces.length > 0
                ? players.black.takenPieces.map(e => this.conv(e))
                : <br />
            }
          </div>
        </div>
        <div className='takenPieces white'>
          <div className='scoreIndicator'>
            {players.white.score}
          </div>
          <div className='pieceIcons'>
            {players.white.takenPieces.length > 0
                ? players.white.takenPieces.map(e => this.conv(e))
                : <br />
            }
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  game: state.game
})

export default connect(mapStateToProps, null)(PlayerUI)
