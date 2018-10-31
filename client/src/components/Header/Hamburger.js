import React from 'react'
import { connect } from 'react-redux'

import NotificationMenu from './NotificationMenu'
import SignIn from './SignIn'
import ProfileDrop from './ProfileDrop'

class Hamburger extends React.Component {
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
      <div className='Hamburger'>
        {auth.isAuth ? <NotificationMenu /> : ''}
        <div className='profileButton-container'>
          {auth.isAuth ? <p>Welcome, </p> : ''}
          <button
            onClick={this.handleClick}
            className='profileButton'
          >
            {auth.isAuth ? auth.user.username : 'Sign In'}
            {' '}<i className={this.state.open ? 'fa fa-angle-up'  :'fa fa-angle-down'}></i>
          </button>
        </div>
        {this.state.open
          ? auth.isAuth
            ? <ProfileDrop close={this.handleClick} />
            : <SignIn close={this.handleClick} />
          : ''
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  app: state.app
})

export default connect(mapStateToProps, null)(Hamburger)
