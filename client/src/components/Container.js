import React from 'react'

import Board from './Board'

import Test from './Test'

class Container extends React.Component {
  render () {
    return (
      <div className='container'>
        <Board />
        <Test />
      </div>
    )
  }
}

export default Container
