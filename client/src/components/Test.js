import React from 'react'

import validateRook from './move_functions/validateRook'

class Test extends React.Component {
  handleSubmit (e) {
    e.preventDefault()
    console.log(this.row.value, this.col.value)
    console.log(validateRook(0, 7, Number(this.row.value), Number(this.col.value), 1))
    this.row.value = ''
    this.col.value = ''
  }

  render () {
    return (
      <div>
        Test:
        <form onSubmit={this.handleSubmit.bind(this)}>
          <input type='text' ref={e => this.row = e} placeholder='Row' style={{width: '50px'}} />
          <input type='text' ref={e => this.col = e} placeholder='Col' style={{width: '50px'}} />
          <button>Test</button>
        </form>
      </div>
    )
  }
}

export default Test
