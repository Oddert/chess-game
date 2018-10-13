const mongoose = require('mongoose')
const Game = require('./models/Game')
const data = require('./client/src/constants/placeholder_users.js')

const matchKey = [
  {'black': 1, 'white': 0},
  {'black': 2, 'white': 0},
  {'black': 0, 'white': 1}
]

console.log('### Seed File Loaded...')
console.log(data)

Game.remove({}, err => console.log(err))

data.games.forEach((each, idx) => {
  let newGame = {
    lastMove: each.turn,
    board: each.board,
    white: {
      id: data.users[matchKey[idx].white],
      score: each.players.white.score,
      takenPieces: each.players.white.takenPieces
    },
    black: {
      id: data.users[matchKey[idx].black],
      score: each.players.black.score,
      takenPieces: each.players.black.takenPieces
    }
  }
  Game.create(newGame, (err, createdGame) => {
    if (err) console.log(err)
    else console.log(createdGame)
  })
})
