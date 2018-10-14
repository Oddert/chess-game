import React from 'react'
import { connect } from 'react-redux'

class TemporaryAuth extends React.Component {
  render () {
    return (
      <button onClick={() => this.props.devToggleTeam()}>
          {this.props.game.thisClientPlayer === null
            ? 'Spectating'
            : this.props.game.thisClientPlayer === 0 ? 'Playing as Black' : 'Playing as White'
          }
      </button>
    )
  }
}

const mapStateToProps = state => ({
  game: state.game
})

const mapDispatchToProps = dispatch => ({
  devToggleTeam: () => dispatch({ type: 'DEV_TOGGLE_TEAM' })
})

export default connect(mapStateToProps, mapDispatchToProps)(TemporaryAuth)
