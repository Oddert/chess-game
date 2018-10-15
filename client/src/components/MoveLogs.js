import React from 'react'
import { connect } from 'react-redux'

class MoveLogs extends React.Component {
  sanitise (move, x) {
    if (!x) return move
    return move.slice(0,1) + 'x' + move.slice(1)
  }

  render () {
    return (
      <div className='MoveLogs'>
        <p>Moves</p>
        {this.props.game.moves.map((each, idx) =>
          <div key={idx}>
            {this.sanitise(each.w.t, each.w.x)} | {each.b && each.b.t ? this.sanitise(each.b.t, each.b.x) : ''}
          </div>
        )}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  game: state.game
})

export default connect(mapStateToProps, null)(MoveLogs)
