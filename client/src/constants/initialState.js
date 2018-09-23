

const generateBoard = () => {
  var output = []
  const main = [
    {type: 'rook', team: 0},
    {type: 'knight', team: 0},
    {type: 'bishop', team: 0},
    {type: 'queen', team: 0},
    {type: 'king', team: 0},
    {type: 'bishop', team: 0},
    {type: 'knight', team: 0},
    {type: 'rook', team: 0}
  ]
  const pawn = []
  for (var j=0; j<8; j++) { pawn.push({type: 'pawn', team:0}) }

  output.push(main)
  output.push(pawn)

  for (var i=0; i<4; i++) {
    var row = []
    for (var r=0; r<8; r++) {
      row.push({type: 'empty', team: null})
    }
    output.push(row)
  }

  output.push(pawn.map(e => ({type: e.type, team:1})))
  output.push(main.map(e => ({type: e.type, team:1})))

  output[5][3].secret = 'hello'
  output[3][5].secret = 'world'

  return output
}

// 0 = white
// 1 = black --board is upside down, use:

// 0 = BLACK
// 1 = WHITE
const initialState = {
  app: {
    localGame: true,
    auth: {
      isAuth: false,
      user: {}
    }
  },
  game: {
    board: generateBoard(),
    playing: false,
    turn: 0
  }
}

export default initialState
