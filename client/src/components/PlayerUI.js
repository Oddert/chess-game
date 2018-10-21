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
        <div className={this.props.game.thisClientPlayer === 0 ? 'takenPieces black client' :'takenPieces black'}>
          <div className='scoreIndicator'>
            {players.black.username}: {players.black.score}
          </div>
          <div className='pieceIcons'>
            {players.black.takenPieces.length > 0
                ? players.black.takenPieces.sort().map(e => this.conv(e))
                : <br />
            }
          </div>
        </div>
        <div className={this.props.game.thisClientPlayer === 1 ? 'takenPieces white client' :'takenPieces white'}>
          <div className='scoreIndicator'>
            {players.white.username}: {players.white.score}
          </div>
          <div className='pieceIcons'>
            {players.white.takenPieces.length > 0
                ? players.white.takenPieces.sort().map(e => this.conv(e))
                : <br />
            }
          </div>
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
