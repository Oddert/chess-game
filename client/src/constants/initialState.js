

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

  return output
}

// 0 = white
// 1 = black --board is upside down, use:

// 0 = BLACK
// 1 = WHITE
const initialState = {
  app: {
    localGame: true,
    playing: false,
    notifications: [],
    auth: {
      isAuth: false,
      user: {}
    }
  },
  game: {
    board: generateBoard(),
    turn: 1,
    thisClientPlayer: null,
    moves: [],
    chat: [],
    attacking: {
      white: {
        '3_7': [
          { piece: 'rook', x: 5, y: 3 },
          { piece: 'bishop', x: 8, y: 4 },
        ]
      },
      black: {},
    },
    players: {
      black: {
        score: 0,
        takenPieces: []
      },
      white: {
        score: 0,
        takenPieces: []
      }
    }
  },
  onlineData: {
    games: {
      public: {
        lastUpdated: Date.now(),
        data: []
      },
      active: {
        lastUpdated: Date.now(),
        data: []
      }
    },
    requests: {
      public: {
        lastUpdated: Date.now(),
        data: []
      },
      outbound: {
        lastUpdated: Date.now(),
        data: []
      },
      inbound: {
        lastUpdated: Date.now(),
        data: []
      }
    }
  }
}

export default initialState
