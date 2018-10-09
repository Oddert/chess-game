import React from 'react'

import Rook from './pieces/Rook'
import Knight from './pieces/Knight'
import Bishop from './pieces/Bishop'
import Queen from './pieces/Queen'
import King from './pieces/King'
import Pawn from './pieces/Pawn'

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
          <td className='col' style={style}>
            <Rook row={this.props.row} col={this.props.col} team={cell.team} />
          </td>
        )
      case 'knight':
        return (
          <td className='col' style={style}>
            <Knight row={this.props.row} col={this.props.col} team={cell.team} />
          </td>
        )
      case 'bishop':
        return (
          <td className='col' style={style}>
            <Bishop row={this.props.row} col={this.props.col} team={cell.team} />
          </td>
        )
      case 'queen':
        return (
          <td className='col' style={style}>
            <Queen row={this.props.row} col={this.props.col} team={cell.team} />
          </td>
        )
      case 'king':
        return (
          <td className='col' style={style}>
            <King row={this.props.row} col={this.props.col} team={cell.team} />
          </td>
        )
      case 'pawn':
        return (
          <td className='col' style={style}>
            <Pawn row={this.props.row} col={this.props.col} team={cell.team} />
          </td>
        )
      case 'empty':
        return (
          <td className='col' style={Object.assign({}, style, {boxShadow: 'inset -1px -1px 0px 0px #95a5a5, inset 1px 1px 0px 0px #95a5a5'})}>{' '}</td>
        )
      default:
        return <div />
    }
  }
}

export default Cell
