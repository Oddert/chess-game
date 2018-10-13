import React from 'react'
import { connect } from 'react-redux'

import { preGame } from '../../actions'

class MainMenu extends React.Component {
  render () {
    return (
      <button onClick={() => this.props.preGame()} className='mainMenu'>Main Menu</button>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  preGame: () => dispatch(preGame())
})

export default connect(null, mapDispatchToProps)(MainMenu)
