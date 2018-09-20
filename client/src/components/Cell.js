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
          <td className='col' style={style}><Rook row={this.props.row} col={this.props.col} team={cell.team} /></td>
        )
      case 'knight':
        return (
          <td className='col' style={style}>♘ <p className='s'>{cell.type}</p></td>
        )
      case 'bishop':
        return (
          <td className='col' style={style}>♗ <p className='s'>{cell.type}</p></td>
        )
      case 'queen':
        return (
          <td className='col' style={style}>♕ <p className='s'>{cell.type}</p></td>
        )
      case 'king':
        return (
          <td className='col' style={style}>♔ <p className='s'>{cell.type}</p></td>
        )
      case 'pawn':
        return (
          <td className='col' style={style}>♙ <p className='s'>{cell.type}</p></td>
        )
      case 'empty':
        return (
          <td className='col' style={Object.assign({}, style, {boxShadow: 'inset -1px -1px 0px 0px black, inset 1px 1px 0px 0px black'})}> <p className='s'>{cell.type}</p></td>
        )
      default:
        return <div />
    }
  }
}

export default Cell
