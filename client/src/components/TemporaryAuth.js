import React from 'react'
import { connect } from 'react-redux'

class TemporaryAuth extends React.Component {
  render () {
    return (
      <button onClick={() => this.props.devToggleTeam()}>
        Playing as:
        <span>
          {this.props.app.auth.thisClientPlayer === 0 ? ' BLACK' : ' WHITE'}
        </span>
      </button>
    )
  }
}

const mapStateToProps = state => ({
  app: state.app
})

const mapDispatchToProps = dispatch => ({
  devToggleTeam: () => dispatch({ type: 'DEV_TOGGLE_TEAM' })
})

export default connect(mapStateToProps, mapDispatchToProps)(TemporaryAuth)
