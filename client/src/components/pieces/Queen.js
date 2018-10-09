import React from 'react'
import { connect } from 'react-redux'

import socket from '../../sockets'

import { takePiece, move } from '../../actions'

import validateQueen from '../move_functions/validateQueen'
import generateQueenClass from '../move_functions/generateQueenClass'

import validateRook from '../move_functions/validateRook'
import validateBishop from '../move_functions/validateBishop'

import '../styles/Piece.css'

class Queen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showVirtual: false
    }
    this.generateVirtualBoard = this.generateVirtualBoard.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.confirmMove = this.confirmMove.bind(this)
  }

  generateVirtualBoard () {
    var output = []
    const testArrOne = []
    const testArrTwo = []
    for (var i=0; i<8; i++) {
      var col = []
      for (var j=0; j<8; j++) {

        if (this.props.row === i && this.props.col === j) {
          col.push(
            <td key={i + '_' + j} onClick={this.handleClick}>
              <div />
            </td>
          )
        } else {
          const classIn = generateQueenClass(this.props.row, this.props.col, i, j, this.props.game.board, this.props.team)
          testArrOne.push(validateRook(this.props.row, this.props.col, i, j, this.props.game.board, this.props.team))
          testArrTwo.push(validateBishop(this.props.row, this.props.col, i, j, this.props.game.board, this.props.team))
          col.push(
            <td className='virtual-row' key={i + '_' + j}>
              <div
                className={classIn}
                row={i}
                col={j}
                onClick={
                  classIn === 'virtual-row-square s' || classIn === 'virtual-row-square s enemy'
                    ? this.confirmMove
                    : this.handleClick }
              />
            </td>
          )
        }

      }
      output.push(<tr className='virtual-col' key={i}>{col}</tr>)
    }
    console.log(testArrOne)
    console.log(testArrTwo)
    return output
  }

  handleClick () {
    this.setState({ showVirtual: !this.state.showVirtual })
  }

  confirmMove (e) {
    const row = Number(e.target.getAttribute('row'))
    const col = Number(e.target.getAttribute('col'))
    const valid = validateQueen(this.props.row, this.props.col, row, col, this.props.game.board, this.props.team)

    const moveObject = {
      from: {
        row: this.props.row,
        col: this.props.col
      },
      to: { row, col },
      piece: "queen",
      team: this.props.team
    }

    if (valid.res && valid.takePiece) {
      if (this.props.app.localGame) {
        this.props.takePiece(moveObject)
      } else {
        socket.emit(`move-piece`, Object.assign({}, moveObject, { takePiece: true }))
      }
    }
    if (valid.res && !valid.takePiece) {
      if (this.props.app.localGame) {
        this.props.move(moveObject)
      } else {
        socket.emit(`move-piece`, Object.assign({}, moveObject, { takePiece: false }))
      }
    }
  }

  render () {
    const virtualStyle = {
      top: `${this.props.row * -50}px`,
      left: `${this.props.col * -50}px`
    }

    const validTeam = !this.props.app.localGame
                        ? this.props.game.turn === this.props.team && this.props.game.turn === this.props.app.auth.thisClientPlayer
                        : this.props.game.turn === this.props.team

    const showVirtual = this.state.showVirtual && validTeam

    return (
      <div
        className='piece queen'
      >

        {showVirtual ?
          <div className='virtual-container' >
            <table className='virtual' style={virtualStyle}>
              <tbody>
                {this.generateVirtualBoard()}
              </tbody>
            </table>
          </div> : ''}

          <div className={showVirtual ? 'piece active' : 'piece'}>
            {validTeam
              ? <span onClick={this.handleClick}>♕</span>
              : <span>♕</span>
            }
          </div>
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
  move: payload => dispatch(move(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(Queen)
