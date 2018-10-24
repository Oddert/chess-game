import React from 'react'
import { connect } from 'react-redux'

import { addPublicReq, addInboundReq, addOutboundReq } from '../actions'

import Request from './Request'

import './styles/RequestIconContainer.css'

class RequestIconContainer extends React.Component {
  componentDidMount () {
    if (this.props.mode) {
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
              this.props.addPublicReq(res.requests)
              break;
            case 'inbound':
              this.props.addInboundReq(res.requests)
              break;
            case 'outbound':
              this.props.addOutboundReq(res.requests)
              break;
            default:
              console.log('ERROR Request.js')
              return
          }
        }
      })
    }
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
            return (auth.isAuth && each.author.id !== user._id)
            ? <Request item={each} key={each._id} />
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
  addPublicReq: payload => dispatch(addPublicReq(payload)),
  addInboundReq: payload => dispatch(addInboundReq(payload)),
  addOutboundReq: payload => dispatch(addOutboundReq(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(RequestIconContainer)
