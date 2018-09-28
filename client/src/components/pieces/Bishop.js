import React from 'react'
import { connect } from 'react-redux'

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
    console.log('Generating Virtual')
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
    console.log(`Bishop in (${this.props.row}, ${this.props.col}) toggling wirtual to: ${!this.state.showVirtual}`)
    this.setState({ showVirtual: !this.state.showVirtual })
  }

  confirmMove (e) {
    const row = Number(e.target.getAttribute('row'))
    const col = Number(e.target.getAttribute('col'))
    const valid = validateBishop(this.props.row, this.props.col, row, col, this.props.game.board, this.props.team)
    if (valid.res && valid.takePiece) {
      this.props.takePiece({
        from: {
          row: this.props.row,
          col: this.props.col
        },
        to: { row, col },
        piece: "bishop",
        team: this.props.team
      })
    }
    if (valid.res && !valid.takePiece) {
      this.props.move({
        from: {
          row: this.props.row,
          col: this.props.col
        },
        to: { row, col },
        piece: "bishop",
        team: this.props.team
      })
    }
  }

  render () {
    const virtualStyle = {
      top: `${this.props.row * -50}px`,
      left: `${this.props.col * -50}px`
    }

    const validTeam = this.props.game.turn === this.props.team
    const showVirtual = this.state.showVirtual && validTeam
    console.log(`Bishop in (${this.props.row}, ${this.props.col}) showing virtual?: ${showVirtual}`)

    return (
      <div
        className='piece bishop'
      >

        {showVirtual ?
          <div className='virtual-container' >
            <table className='virtual' style={virtualStyle}>
              <tbody>
                {this.generateVirtualBoard()}
              </tbody>
            </table>
          </div> : ''}

        <div className={showVirtual ? 'piece active' : 'piece'} onClick={this.handleClick}>
          <span onClick={validTeam ? this.handleClick : ()=>{console.log('BLOCK')}}>♗</span>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  game: state.game
})

const mapDispatchToProps = dispatch => ({
  takePiece: payload => dispatch(takePiece(payload)),
  move: payload => dispatch(move(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(Bishop)
