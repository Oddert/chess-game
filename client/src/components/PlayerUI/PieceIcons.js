import React from 'react'

class PieceIcons extends React.Component {
  getIcon (e) {
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
    const { players, color } = this.props
    return (
      <div className='pieceIcons'>
        {players[color].takenPieces.length > 0
            ? players[color].takenPieces.sort().map(e => this.getIcon(e))
            : <br />
        }
      </div>
    )
  }
}

export default PieceIcons