import React from 'react'
import { connect } from 'react-redux'

import { logout } from '../../actions'

class ProfileDrop extends React.Component {
  handleLogout () {
    fetch(`/api/auth/logout`, {
      method: `GET`,
      headers: { 'Content-Type': `application/json` },
      credentials: `include`
    })
    .then(res => res.json())
    .then(res => {
      console.log(res)
      if (res.err) {
        console.log(res.err)
      } else {
        console.log(`Successfully loged out`)
        this.props.logout()
        this.props.close()
      }
    })
  }

  render () {
    return (
      <div className='signIn'>
        <button onClick={this.handleLogout.bind(this)}>Logout</button>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout())
})

export default connect(null, mapDispatchToProps)(ProfileDrop)
