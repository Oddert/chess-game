import React from 'react'

import Rook from './pieces/Rook'

import './styles/Cell.css'

class Cell extends React.Component {
  render () {
    const cell = this.props.cell
    var style = cell.team === null
                  ? {backgroundColor: '#ecf0f1'}
                  : cell.team === 0 ? {backgroundColor: '#2d3e50', color:'#fff'} : {backgroundColor: '#bec3c7'}

    switch (cell.type) {
      case 'rook':
        return (
          <td className='col' style={style}><Rook x={this.props.col} y={this.props.row} /></td>
        )
      case 'knight':
        return (
          <td className='col' style={style}>♘</td>
        )
      case 'bishop':
        return (
          <td className='col' style={style}>♗</td>
        )
      case 'queen':
        return (
          <td className='col' style={style}>♕</td>
        )
      case 'king':
        return (
          <td className='col' style={style}>♔</td>
        )
      case 'pawn':
        return (
          <td className='col' style={style}>♙</td>
        )
      case 'empty':
        return (
          <td className='col' style={style}>O</td>
        )
      default:
        return <div />
    }
  }
}

export default Cell
