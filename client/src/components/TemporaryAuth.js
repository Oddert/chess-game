import React from 'react'
import { connect } from 'react-redux'

class TemporaryAuth extends React.Component {
  render () {
    return (
      <button onClick={() => this.props.devToggleTeam()}>
        Playing as:
        <span>
          {this.props.game.thisClientPlayer === 0 ? ' BLACK' : ' WHITE'}
          {this.props.app.auth.user._id ? `: ${this.props.app.auth.user._id}` : ''}
        </span>
      </button>
    )
  }
}

const mapStateToProps = state => ({
  app: state.app,
  game: state.game
})

const mapDispatchToProps = dispatch => ({
  devToggleTeam: () => dispatch({ type: 'DEV_TOGGLE_TEAM' })
})

export default connect(mapStateToProps, mapDispatchToProps)(TemporaryAuth)
