import React from 'react'
import { connect } from 'react-redux'

import BoardWrapper from './BoardWrapper'

class Container extends React.Component {
  render () {
    return (
      <div className='container'>
        {this.props.app.localGame ? <div>You are playing locally</div> : <div>Online play</div>}
        <BoardWrapper />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  app: state.app
})

export default connect(mapStateToProps, null)(Container)
