import React from 'react'
import { connect } from 'react-redux'

import { takePiece, move } from '../../actions'

import validateRook from '../move_functions/validateRook'
import generateRookClass from '../move_functions/generateRookClass'

import '../styles/Piece.css'

class Rook extends React.Component {
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
          const classIn = generateRookClass(this.props.row, this.props.col, i, j, this.props.game.board, this.props.team)
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
              >
                {/* {i + ', ' + j} */}
              </div>
            </td>
          )
        }

      }
      output.push(<tr className='virtual-col' key={i}>{col}</tr>)
    }
    return output
  }

  // componentDidMount () {
  //   if (this.props.row === 0 && this.props.col === 0) {
  //     console.log('### I am self running 0,0: ')
  //     console.log(validateRook(5, 2, 1, 2, this.props.game.board, 1))
  //   }
  // }

  handleClick () {
    this.setState({ showVirtual: !this.state.showVirtual })
  }

  confirmMove (e) {
    const row = Number(e.target.getAttribute('row'))
    const col = Number(e.target.getAttribute('col'))
    const valid = validateRook(this.props.row, this.props.col, row, col, this.props.game.board, this.props.team)
    // console.log('Target row/col: ')
    // console.log(row, col)
    // console.log(valid)
    if (valid.res && valid.takePiece) {
      // console.log('Going to dispatch a take piece move')
      this.props.takePiece({
        from: {
          row: this.props.row,
          col: this.props.col
        },
        to: { row, col },
        piece: "rook",
        team: this.props.team
      })
    }
    if (valid.res && !valid.takePiece) {
      // console.log('Going to dispatch a move (no take)')
      this.props.move({
        from: {
          row: this.props.row,
          col: this.props.col
        },
        to: { row, col },
        piece: "rook",
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
    const showVirtual = this.state.showVirtual && this.props.game.turn === this.props.team

    return (
      <div
        className='piece rook'
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
            ? <span onClick={this.handleClick}>♖</span>
            : <span>♖</span>
          }
          {/* <p className='s'>rook</p> */}
          {/* <h6>({this.props.row + ', ' + this.props.col}) t:{this.props.team}</h6> */}

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

export default connect(mapStateToProps, mapDispatchToProps)(Rook)
