import React from 'react'
import { connect } from 'react-redux'

import { addPublicGames, addActiveGames } from '../actions'

import GameIcon from './GameIcon'

class GameIconContainer extends React.Component {
  componentDidMount () {
    console.log(`### Getting ${this.props.type} Games`)
    fetch(`/api/games/${this.props.type}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    .then(res => res.json())
    .then(res => {
      if (res.err) console.log(res.err)
      else {
        if (this.props.type === 'public') this.props.addPublicGames(res.games)
        else this.props.addActiveGames(res.games)
      }
    })
  }

  render () {
    let item = this.props.type === 'public'
      ? this.props.onlineData.games.public
      : this.props.onlineData.games.active

    return (
      <div className='gameIcon-container'>
        <p>{this.props.type === 'public' ? 'Public Games' : 'Your Games'}</p>
        <div className='gameIcon-container-column'>
          {item.data.map(each =>
            <GameIcon key={each._id} game={each} callback={this.props.callback} />
          )}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  onlineData: state.onlineData
})

const mapDispatchToProps = dispatch => ({
  addPublicGames: payload => dispatch(addPublicGames(payload)),
  addActiveGames: payload => dispatch(addActiveGames(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(GameIconContainer)
