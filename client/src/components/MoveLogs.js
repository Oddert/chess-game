import React from 'react'
import { connect } from 'react-redux'

import './styles/MoveLogs.css'

// Reminder, for the sake of conveniance names have been shortened to single letters
// w = white,  b = black,  f = from,  t = to,  x = piece taken?
// It is assumed that white will always be present as white moves first hence no ternary
// Mongoose initialises b with b.x = false

class MoveLogs extends React.Component {
  sanitise (move, x) {
    if (!x) return move
    return move.slice(0,1) + 'x' + move.slice(1)
  }

  render () {
    return (
      <div className='MoveLogs'>
        <p>Moves</p>
        <div className='logs'>
          {this.props.game.moves.map((each, idx) =>
            <div key={idx} className='log-line'>
              <span>{this.sanitise(each.w.t, each.w.x)}</span>
              <span>|</span>
              <span>{each.b && each.b.t ? this.sanitise(each.b.t, each.b.x) : ' '}</span>
            </div>
          )}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  game: state.game
})

export default connect(mapStateToProps, null)(MoveLogs)
