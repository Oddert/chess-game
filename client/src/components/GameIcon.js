import React from 'react'
import { connect } from 'react-redux'

import { selectGame } from '../actions'

import './styles/GameIcon.css'

class GameIcon extends React.Component {
  convertTeamClass (e) {
    switch (e) {
      case null:
        return 'empty'
      case 0:
        return 'black'
      case 1:
        return 'white'
      default:
        return 'empty'
    }
  }

  convertTeamIcon (e) {
      switch(e) {
        case 'pawn':
          return '♙'
        case 'rook':
          return '♖'
        case 'knight':
          return '♘'
        case 'bishop':
          return '♗'
        case 'queen':
          return '♕'
        case 'king':
          return '♔'
        default:
          return ''
      }
  }

  genBoard () {
    var output = []
    this.props.game.board.forEach((row, rowIdx) => {
      var cells = []
      row.forEach((col, colIdx) => cells.push(
        <td key={rowIdx + '_' + colIdx} className={this.convertTeamClass(col.team)}>{this.convertTeamIcon(col.type)}</td>
      ))
      output.push(<tr className='row' key={rowIdx}>{cells}</tr>)
    })
    return output
  }

  selectGame () {
    console.log(this.props.game)
    this.props.selectGame(this.props.game)
    this.props.callback()
  }

  render () {
    return (
      <div className='GameIcon' onClick={this.selectGame.bind(this)}>
        <div className='board icon'>
          <table>
            <tbody>
              {this.genBoard()}
            </tbody>
          </table>
        </div>
        <p>{this.props.game._id}</p>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  selectGame: payload => dispatch(selectGame(payload))
})

export default connect(null, mapDispatchToProps)(GameIcon)
