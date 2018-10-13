import React from 'react'
import { connect } from 'react-redux'

import socket from '../../sockets'

import { takePiece, move } from '../../actions'

import validateBishop from '../move_functions/validateBishop'
import generateBishopClass from '../move_functions/generateBishopClass'

import '../styles/Piece.css'

class Bishop extends React.Component {
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
          const classIn = generateBishopClass(this.props.row, this.props.col, i, j, this.props.game.board, this.props.team)
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
    return output
  }

  handleClick () {
    this.setState({ showVirtual: !this.state.showVirtual })
  }

  confirmMove (e) {
    const row = Number(e.target.getAttribute('row'))
    const col = Number(e.target.getAttribute('col'))
    const valid = validateBishop(this.props.row, this.props.col, row, col, this.props.game.board, this.props.team)

    const moveObject = {
      from: {
        row: this.props.row,
        col: this.props.col
      },
      to: { row, col },
      piece: "bishop",
      team: this.props.team
    }

    console.log(`### Confirm Move`)

    if (valid.res && valid.takePiece) {
      console.log(`...with take piece`)
      if (this.props.app.localGame) {
        this.props.takePiece(moveObject)
        console.log(`... DISPATCHED`)
      } else {
        socket.emit(`move-piece`, Object.assign({}, moveObject, { takePiece: true }))
        console.log(`... SOCKET BROADCAST`)
      }
    }
    if (valid.res && !valid.takePiece) {
      console.log(`...no take`)
      if (this.props.app.localGame) {
        this.props.move(moveObject)
        console.log(`... DISPATCHED`)
      } else {
        socket.emit(`move-piece`, Object.assign({}, moveObject, { takePiece: false }))
        console.log(`... SOCKET BROADCAST`)
      }
    }
  }

  render () {
    const virtualStyle = {
      top: `${this.props.row * -50}px`,
      left: `${this.props.col * -50}px`
    }

    const validTeam = !this.props.app.localGame
                        ? this.props.game.turn === this.props.team && this.props.game.turn === this.props.game.thisClientPlayer
                        : this.props.game.turn === this.props.team

    const showVirtual = this.state.showVirtual && validTeam

    return (
      <div className='piece bishop'>

        {showVirtual
          ? <div className='virtual-container' >
              <table className='virtual' style={virtualStyle}>
                <tbody>
                  {this.generateVirtualBoard()}
                </tbody>
              </table>
            </div>
          : ''}

        <div className={showVirtual ? 'piece active' : 'piece'}>
          {validTeam
            ? <span onClick={this.handleClick}>♗</span>
            : <span>♗</span>
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

export default connect(mapStateToProps, mapDispatchToProps)(Bishop)
