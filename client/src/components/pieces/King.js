import React from 'react'
import { connect } from 'react-redux'

import { takePiece, move } from '../../actions'

import validateKing from '../move_functions/validateKing'
import generateKingClass from '../move_functions/generateKingClass'

import '../styles/Piece.css'

class King extends React.Component {
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
          col.push(
            <td className='virtual-row' key={i + '_' + j}>
              <div
                className={generateKingClass(this.props.row, this.props.col, i, j, this.props.game.board, this.props.team)}
                row={i}
                col={j}
                onClick={this.confirmMove}
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
    const valid = validateKing(this.props.row, this.props.col, row, col, this.props.game.board, this.props.team)
    if (valid.res && valid.takePiece) {
      this.props.takePiece({
        from: {
          row: this.props.row,
          col: this.props.col
        },
        to: { row, col },
        piece: "king",
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
        piece: "king",
        team: this.props.team
      })
    }
  }

  render () {
    const virtualStyle = {
      top: `${this.props.row * -50}px`,
      left: `${this.props.col * -50}px`
    }

    return (
      <div
        className='piece king'
      >

        {this.state.showVirtual ?
          <div className='virtual-container' >
            <table className='virtual' style={virtualStyle}>
              <tbody>
                {this.generateVirtualBoard()}
              </tbody>
            </table>
          </div> : ''}

        <div className='piece' onClick={this.handleClick}>
          ♔
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

export default connect(mapStateToProps, mapDispatchToProps)(King)
