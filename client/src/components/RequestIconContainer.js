import React from 'react'

import './styles/RequestIconContainer.css'

class RequestIconContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: []
    }
  }

  componentDidMount () {
    if (this.props.mode) {
      console.log(`/api/requests/${this.props.mode}`)
      fetch(`/api/requests/${this.props.mode}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      .then(res => res.json())
      .then(res => {
        console.log(res)
        if (res.err) console.log(res.err)
        else {
          this.setState({ data: res.requests })
        }
      })
    }
  }

  render () {
    let mode = this.props.mode
    return (
      <div className='RequestIconContainer'>
        <p>
          {mode.substring(0,1).toUpperCase() + mode.substring(1)}
          {' Requests'}
        </p>
        <div>
          {this.state.data.map(each =>
            <div key={each._id}>{each._id}</div>
          )}
        </div>
      </div>
    )
  }
}

export default RequestIconContainer
