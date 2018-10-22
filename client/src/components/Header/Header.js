import React from 'react'

import socket from '../../sockets'

import MainMenu from './MainMenu'
import TemporaryAuth from '../TemporaryAuth'
import Hamburger from './Hamburger'

import '../styles/Header.css'

class Header extends React.Component {
  componentDidMount () {
    socket.on('dev', payload => console.log('# Socket dev: ', payload))
  }

  render () {
    return (
      <header className='header'>
        <MainMenu />
        <TemporaryAuth />
        <Hamburger />
      </header>
    )
  }
}

export default Header
