import React from 'react'
import { connect } from 'react-redux'

import socket from '../sockets'
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
    // emit 'join game' and await 'join-game-confirmed'
    socket.emit('join-game', this.props.game._id)
    socket.on(`join-game-confirm`, payload => {
      if (!payload) {
        console.error(`ERROR JOINING ROOM`)
      }
      console.log(`Server confirms game joined`)
      let thisClientPlayer = null
      if (this.props.app.auth.isAuth) {
        if (this.props.game.black.id === this.props.app.auth.user._id) thisClientPlayer = 0
        if (this.props.game.white.id === this.props.app.auth.user._id) thisClientPlayer = 1
      }
      // console.log(`This client is player: ${thisClientPlayer}`)
      this.props.selectGame(Object.assign({}, this.props.game, { thisClientPlayer }))
      this.props.callback()
    })
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
        <p className='GameIcon-title'>{this.props.game.name}</p>
        <p>
          <strong>
            {this.props.game.white.username}
          </strong> vs <strong>
            {this.props.game.black.username}
          </strong>
        </p>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  app: state.app,
  stateGame: state.game
})

const mapDispatchToProps = dispatch => ({
  selectGame: payload => dispatch(selectGame(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(GameIcon)
