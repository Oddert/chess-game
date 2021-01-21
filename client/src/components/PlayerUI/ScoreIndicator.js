import React from 'react'

class ScoreIndicator extends React.Component {
  render () {
    const { color, players } = this.props
    return (
      <div className='scoreIndicator'>
        <span className='scoreIndicator-username'>
          {
            players[color].username 
              ? `${players[color].username} (${color})`
              : `${color.substring(0,1).toUpperCase()}${color.substring(1)}`
          }
        </span>
        <span className='scoreIndicator-score'>
          { players[color].score }
        </span>
      </div>
    )
  }
}

export default ScoreIndicator