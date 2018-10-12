import React from 'react'
import { connect } from 'react-redux'

import './styles/Header.css'

class Header extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      signUp: false
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit (e) {
    e.preventDefault()

    console.log(this.username.value)
    console.log(this.password.value)
    console.log(this.confirm_password ? this.confirm_password.value : '')

    if (/\S/.test(this.username.value) && /\S/.test(this.password.value)) {
      if (this.state.signUp) {
        if (this.password.value === this.confirm_password.value) {
          fetch(`/api/auth/local/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              username: this.username.value,
              password: this.password.value
            })
          })
          .then(res => res.json())
          .then(res => console.log(res))
        } else {
          alert('ERROR: Passwords need to match')
        }
      } else {
        fetch(`/api/auth/local/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            username: this.username.value,
            password: this.password.value
          })
        })
        .then(res => res.json())
        .then(res => console.log(res))
      }
    }
  }

  handleClick () {
    this.setState({ open: !this.state.open })
  }

  handleTest () {
    fetch(`/api/auth/ping`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    })
    .then(res => res.json())
    .then(res => console.log(res))
  }

  render () {
    return (
      <header className='header'>
        <button onClick={this.handleTest.bind(this)}>Ping auth</button>
        <p>User is {this.props.app.auth.isAuth ? 'Logged In' : 'Not Logged In'}</p>
        <button onClick={this.handleClick}>Toggle Menu</button>
        {this.state.open
          ? <div className='signIn'>
              <button
                style={this.state.signUp ? {} : {color: 'red'}}
                onClick={() => this.setState({ signUp: false })}
              >
                Log In
              </button>
              <button
                style={this.state.signUp ? {color: 'red'} : {}}
                onClick={() => this.setState({ signUp: true })}
              >
                Sign Up
              </button>
              <form onSubmit={this.handleSubmit}>
                <input
                  type='text'
                  name='username'
                  placeholder='Username'
                  ref={e => this.username = e}
                  required
                />
                <br />
                <input
                  type='password'
                  name='password'
                  placeholder='Password'
                  ref={e => this.password = e}
                  required
                />
                <br />
                {this.state.signUp
                  ? <div>
                      <input
                        type='password'
                        name='confirm_password'
                        placeholder='Confirm Password'
                        ref={e => this.confirm_password = e}
                        required />
                      <br />
                    </div>
                  : ''
                }
                {this.state.signUp ? <button>Sign Up</button> : <button>Log In</button>}
              </form>
            </div>
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


const upYes = {
  localGame: true,
  playing: false,
  auth: {
    isAuth: false,
    thisClientPlayer: 0,
    user: {}
  }
}
