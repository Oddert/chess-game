import React from 'react'
import { connect } from 'react-redux'

import Cell from './Cell'

import './styles/Board.css'

class Board extends React.Component {
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
  game: state.game
})

export default connect(mapStateToProps, null)(Board)
