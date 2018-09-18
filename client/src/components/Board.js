import React from 'react'
import { connect } from 'react-redux'

import Cell from './Cell'

class Board extends React.Component {
  genBoard () {
    var output = []
    this.props.game.board.forEach(row => {
      var cells = []
      row.forEach(col => cells.push(<Cell cell={col} />))
      output.push(<tr className='row'>{cells}</tr>)
    })
    return output
  }

  render () {
    return (
      <table>
        {this.genBoard()}
      </table>
    )
  }
}

const mapStateToProps = state => ({
  game: state.game
})

export default connect(mapStateToProps, null)(Board)
