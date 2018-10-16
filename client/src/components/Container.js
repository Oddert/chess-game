// This is the last component in the tree. It is then mounted by <Provider /> in App.js
import React from 'react'
import { connect } from 'react-redux'

import Header from './Header/Header'
import BoardWrapper from './BoardWrapper'
import OnlineContainer from './OnlineContainer'
import PreGame from './PreGame'

class Container extends React.Component {
  componentDidMount () {
    fetch('/api/auth/ping', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    .then(res => res.json())
    .then(res => {
      if (!res.err) {
        if (!this.props.app.auth.isAuth === res.isAuth) {
          if (res.isAuth) this.props.login(res.user)
          else this.props.logout()
        }
      }
    })
  }

  render () {
    return (
      <div className='container'>
        <Header />
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
