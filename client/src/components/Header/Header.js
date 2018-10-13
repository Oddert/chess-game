import React from 'react'
import { connect } from 'react-redux'

import SignIn from './SignIn'
import ProfileDrop from './ProfileDrop'
import MainMenu from './MainMenu'

import '../styles/Header.css'

class Header extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        open: false
    }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    this.setState({ open: !this.state.open })
  }

  render () {
    const auth = this.props.app.auth
    return (
      <header className='header'>
        <MainMenu />
        <div>
          {auth.isAuth ? <p>Welcome, </p> : ''}
          <button
            onClick={this.handleClick}
            className='profileButton'
          >
            {auth.isAuth ? auth.user.username : 'Sign In'}
          </button>
        </div>
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
