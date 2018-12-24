import React from 'react'
import { connect } from 'react-redux'

import { refreshPublicReqs, refreshInboundReqs, refreshOutboundReqs } from '../../actions'

import Request from './Index'

import '../styles/RequestIconContainer.css'

class RequestIconContainer extends React.Component {
  componentDidMount () {
    if (!this.props.mode) return
      // console.log(`/api/requests/${this.props.mode}`)
    fetch(`/api/requests/${this.props.mode}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    .then(res => res.json())
    .then(res => {
      if (res.err) console.log(res.err)
      else {
        switch(this.props.mode) {
          case 'public':
            this.props.refreshPublicReqs(res.requests)
            break;
          case 'inbound':
            this.props.refreshInboundReqs(res.requests)
            break;
          case 'outbound':
            this.props.refreshOutboundReqs(res.requests)
            break;
          default:
            console.log('ERROR Request.js')
            return
        }
      }
    })
    .catch(err => {
      console.log({ err })
    })

  }

  render () {
    let mode = this.props.mode
    let auth = this.props.app.auth
    let user = auth.isAuth ? auth.user : {}

    let data

    switch(this.props.mode) {
      case 'public':
        data = this.props.onlineData.requests.public.data
        break
      case 'inbound':
        data = this.props.onlineData.requests.inbound.data
        break
      case 'outbound':
        data = this.props.onlineData.requests.outbound.data
        break
      default:
        break
    }

    return (
      <div className='RequestIconContainer'>
        <p>
          {mode.substring(0,1).toUpperCase() + mode.substring(1)}
          {' Requests'}
        </p>
        <div>
          {data.map(each => {
            return (mode === 'outbound' ? true : each.author.id !== user._id)
            ? <Request item={each} key={each._id} callback={this.props.callback} />
            : ''
          })}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  app: state.app,
  onlineData: state.onlineData
})

const mapDispatchToProps = dispatch => ({
  refreshPublicReqs: payload => dispatch(refreshPublicReqs(payload)),
  refreshInboundReqs: payload => dispatch(refreshInboundReqs(payload)),
  refreshOutboundReqs: payload => dispatch(refreshOutboundReqs(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(RequestIconContainer)
