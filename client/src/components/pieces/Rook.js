import React from 'react'
import { connect } from 'react-redux'

import validateRook from '../move_functions/validateRook'

import '../styles/Virtual.css'

class Rook extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showVirtual: false
    }
    this.generateVirtualBoard = this.generateVirtualBoard.bind(this)
    this.handleMouseOver = this.handleMouseOver.bind(this)
    this.handleMouseOut = this.handleMouseOut.bind(this)
  }

  generateVirtualBoard () {
    var output = []
    for (var i=0; i<8; i++) {
      var col = []
      for (var j=0; j<8; j++) {
        col.push(
          <td className='virtual-row' key={i + '_' + j} />
        )
      }
      output.push(<tr className='virtual-col' key={i}>{col}</tr>)
    }
    return output
  }

  handleMouseOver () {
    // this.setState({ showVirtual: true })
  }

  handleMouseOut () {
    // this.setState({ showVirtual: false })
  }

  componentDidMount () {
    if (this.props.x === 0 && this.props.y === 0) {
      console.log(validateRook(0, 5, 0, 2, this.props.game.board))
    }
  }

  render () {
    const virtualStyle = {
      top: `${this.props.y * -50}px`,
      left: `${this.props.x * -50}px`
    }
    return (
      <div
        className='piece rook'
      >

        {this.state.showVirtual ?
          <div className='virtual-container' >
            <table className='virtual' style={virtualStyle}>
              <tbody>
                {this.generateVirtualBoard()}
              </tbody>
            </table>
          </div> : ''}

        <div className='piece'
              onMouseOver={this.handleMouseOver}
              onMouseOut={this.handleMouseOut}
        >♖ <h6>({this.props.x + ', ' + this.props.y})</h6></div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  game: state.game
})

export default connect(mapStateToProps, null)(Rook)
