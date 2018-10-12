// This is the last component in the tree. It is then mounted by <Provider /> in App.js
import React from 'react'
import { connect } from 'react-redux'

import Header from './Header'
import BoardWrapper from './BoardWrapper'
import OnlineContainer from './OnlineContainer'
import PreGame from './PreGame'

class Container extends React.Component {
  render () {
    return (
      <div className='container'>
        <Header />
        {this.props.app.localGame ? <div>You are playing locally</div> : <div>Online play</div>}
        {this.props.app.playing
          ? this.props.app.localGame
            ? <BoardWrapper />
            : <OnlineContainer />
          : <PreGame />
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  app: state.app
})

export default connect(mapStateToProps, null)(Container)
