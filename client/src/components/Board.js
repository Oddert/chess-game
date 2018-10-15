import React from 'react'
import { connect } from 'react-redux'

import { takePiece, move, deselectGame, updateMeta } from '../actions'
import socket from '../sockets'

import Cell from './Cell'

import './styles/Board.css'

class Board extends React.Component {
  componentDidMount () {
    console.log(`board mounting... localgame? ${this.props.app.localGame}`)
    if (this.props.app.localGame === false) {
      socket.on(`move-piece`, payload => {
        console.log(payload)
        if (payload.takePiece) {
          console.log(`# Board dispatching a take piece`)
          this.props.takePiece(payload)
        } else {
          console.log(`# Board dispatching a move`)
          this.props.move(payload)
        }
      })
      socket.on('change-meta', payload => {
        console.log('Updating meta...')
        console.log(payload)
        this.props.updateMeta(payload)
      })
    }
  }

  componentWillUnmount () {
    console.log('### BOARD unmounting...')
    this.props.deselectGame()
  }

  genBoard () {
    var output = []
    this.props.game.board.forEach((row, rowIdx) => {
      var cells = []
      row.forEach((col, colIdx) => cells.push(
        <Cell cell={col} row={rowIdx} col={colIdx} key={rowIdx + '_' + colIdx} />
      ))
      output.push(<tr className='row' key={rowIdx}>{cells}</tr>)
    })
    return output
  }

  render () {
    return (
      <div className='board'>
        <table>
          <tbody>
            {this.genBoard()}
          </tbody>
        </table>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  game: state.game,
  app: state.app
})

const mapDispatchToProps = dispatch => ({
  takePiece: payload => dispatch(takePiece(payload)),
  move: payload => dispatch(move(payload)),
  deselectGame: () => dispatch(deselectGame()),
  updateMeta: payload => dispatch(updateMeta(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(Board)
