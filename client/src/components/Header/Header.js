import React from 'react'
import { connect } from 'react-redux'

import SignIn from './SignIn'
import ProfileDrop from './ProfileDrop'

import '../styles/Header.css'

class Header extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        open: false
    }
    this.handleClick = this.handleClick.bind(this)
    // this.handleTest = this.handleTest.bind(this)
  }

  handleClick () {
    this.setState({ open: !this.state.open })
  }

  // handleTest () {
  //   fetch(`/api/auth/ping`, {
  //     method: 'GET',
  //     headers: { 'Content-Type': 'application/json' },
  //     credentials: 'include'
  //   })
  //   .then(res => res.json())
  //   .then(res => console.log(res))
  // }

  render () {
    const auth = this.props.app.auth
    return (
      <header className='header'>
        {/* <button onClick={this.handleTest}>Ping auth</button> */}
        {auth.isAuth ? <p>Welcome, </p> : ''}
        <button onClick={this.handleClick}>{auth.isAuth ? auth.user.username : 'Sign In'}</button>
        {this.state.open
          ? auth.isAuth
            ? <ProfileDrop close={this.handleClick} />
            : <SignIn close={this.handleClick} />
          : ''
        }
      </header>
    )
  }
}

const mapStateToProps = state => ({
  app: state.app
})

export default connect(mapStateToProps, null)(Header)


// const upYes = {
//   localGame: true,
//   playing: false,
//   auth: {
//     isAuth: false,
//     thisClientPlayer: 0,
//     user: {}
//   }
// }
