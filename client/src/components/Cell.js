import React from 'react'

class Cell extends React.Component {
  render () {
    var style = this.props.cell.team === null
                  ? {backgroundColor: '#ecf0f1'}
                  : this.props.cell.team === 0 ? {backgroundColor: '#2d3e50'} : {backgroundColor: '#bec3c7'}
    return (
      <td className='col' style={style}>{this.props.cell.type}</td>
    )
  }
}

export default Cell
