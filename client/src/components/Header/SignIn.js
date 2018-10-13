import React from 'react'
import { connect } from 'react-redux'

import { login } from '../../actions'

class SignIn extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      signUp: false,
      error: null
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.clearError = this.clearError.bind(this)
  }
  handleSubmit (e) {
    e.preventDefault()

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
          .then(res => {
            console.log(res)
            if (res.err) {
              this.setState({ error: res.err })
            } else {
              this.username.value = ''
              this.pasword.value = ''
              if (this.confirm_password) this.confirm_password.value = ''
              console.log('User sucessfully signed up!')
              const userToDispatch = res.user
              delete userToDispatch.hash
              delete userToDispatch.salt
              this.props.login(userToDispatch)
              this.props.close()
            }
          })
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
        .then(res => {
          console.log(res)
          if (res.err) {
            this.setState({ error: res.err })
          } else {
            this.username.value = ''
            this.password.value = ''
            if (this.confirm_password) this.confirm_password.value = ''
            console.log('User sucessfully logged in!')
            const userToDispatch = res.user
            delete userToDispatch.hash
            delete userToDispatch.salt
            this.props.login(userToDispatch)
            this.props.close()
          }
        })
      }
    }
  }

  clearError () {
    this.setState({ error: null })
  }

  render () {
    return (
      <div className='signIn'>
          {this.state.error ? <h3>Error: {this.state.error.name}</h3> : ''}
          <div className='toggleSignInMode'>
            <button
              className={this.state.signUp ? 'left' : 'left active'}
              onClick={() => this.setState({ signUp: false })}
            >
              Log In
            </button>
            <button
              className={this.state.signUp ? 'right active' : 'right'}
              onClick={() => this.setState({ signUp: true })}
            >
              Sign Up
            </button>
          </div>
          <form onSubmit={this.handleSubmit} onChange={this.clearError} className='signIn-form'>
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
            {this.state.signUp
              ? <button className='submitButton'>Sign Up</button>
              : <button className='submitButton'>Log In</button>}
          </form>
        </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  login: payload => dispatch(login(payload))
})

export default connect(null, mapDispatchToProps)(SignIn)
