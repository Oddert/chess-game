module.exports = {
  users: {
    0: 'oddert',
    1: 'mrrobot',
    2: 'pnuk'
  },
  games: [
    {
      board: [
        [{type:"rook",team:0},{type:"knight",team:0},{type:"bishop",team:0},{type:"empty",team:null},{type:"king",team:0},{type:"empty",team:null},{type:"empty",team:null},{type:"rook",team:0}],
        [{type:"pawn",team:0},{type:"pawn",team:0},{type:"pawn",team:0},{type:"pawn",team:0},{type:"empty",team:null},{type:"pawn",team:0},{type:"pawn",team:0},{type:"pawn",team:0}],
        [{type:"empty",team:null},{type:"empty",team:null},{type:"empty",team:null},{type:"empty",team:null},{type:"empty",team:null},{type:"empty",team:null},{type:"empty",team:null},{type:"knight",team:0}],
        [{type:"empty",team:null},{type:"empty",team:null},{type:"empty",team:null},{type:"empty",team:null},{type:"pawn",team:0},{type:"empty",team:null},{type:"queen",team:0},{type:"empty",team:null}],
        [{type:"empty",team:null},{type:"empty",team:null},{type:"bishop",team:1},{type:"empty",team:null},{type:"pawn",team:1},{type:"empty",team:null},{type:"empty",team:null},{type:"pawn",team:1}],
        [{type:"bishop",team:0},{type:"empty",team:null},{type:"knight",team:1},{type:"empty",team:null},{type:"empty",team:null},{type:"empty",team:null},{type:"empty",team:null},{type:"rook",team:1}],
        [{type:"pawn",team:1},{type:"pawn",team:1},{type:"pawn",team:1},{type:"pawn",team:1},{type:"empty",team:null},{type:"pawn",team:1},{type:"pawn",team:1},{type:"empty",team:null}],
        [{type:"rook",team:1},{type:"empty",team:null},{type:"bishop",team:1},{type:"queen",team:1},{type:"king",team:1},{type:"empty",team:null},{type:"knight",team:1},{type:"empty",team:null}]
      ],
      turn: 0,
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
    {
      board: [
        [{type:"rook",team:0},{type:"empty",team:null},{type:"bishop",team:0},{type:"queen",team:0},{type:"empty",team:null},{type:"bishop",team:0},{type:"empty",team:null},{type:"empty",team:null}],
        [{type:"pawn",team:0},{type:"pawn",team:0},{type:"pawn",team:0},{type:"king",team:0},{type:"pawn",team:0},{type:"pawn",team:0},{type:"empty",team:null},{type:"empty",team:null}],
        [{type:"empty",team:null},{type:"empty",team:null},{type:"empty",team:null},{type:"empty",team:null},{type:"empty",team:null},{type:"knight",team:0},{type:"empty",team:null},{type:"pawn",team:0}],
        [{type:"empty",team:null},{type:"empty",team:null},{type:"empty",team:null},{type:"empty",team:null},{type:"empty",team:null},{type:"empty",team:null},{type:"empty",team:null},{type:"pawn",team:0}],
        [{type:"empty",team:null},{type:"empty",team:null},{type:"empty",team:null},{type:"pawn",team:1},{type:"empty",team:null},{type:"empty",team:null},{type:"empty",team:null},{type:"empty",team:null}],
        [{type:"empty",team:null},{type:"empty",team:null},{type:"empty",team:null},{type:"empty",team:null},{type:"empty",team:null},{type:"empty",team:null},{type:"empty",team:null},{type:"empty",team:null}],
        [{type:"pawn",team:1},{type:"pawn",team:1},{type:"pawn",team:1},{type:"empty",team:null},{type:"pawn",team:1},{type:"pawn",team:1},{type:"pawn",team:1},{type:"pawn",team:1}],
        [{type:"rook",team:1},{type:"knight",team:1},{type:"empty",team:null},{type:"empty",team:null},{type:"king",team:1},{type:"bishop",team:1},{type:"knight",team:1},{type:"rook",team:1}]
      ],
      turn: 1,
      players: {
        black: {
          score: 12,
          takenPieces: ["bishop","queen"]
        },
        white: {
          score: 9,
          takenPieces: ["rook","knight","pawn"]
        }
      }
    },
    {
      board: [
        [{type:"empty",team:null},{type:"rook",team:0},{type:"bishop",team:0},{type:"empty",team:null},{type:"empty",team:null},{type:"queen",team:1},{type:"knight",team:0},{type:"rook",team:0}],
        [{type:"pawn",team:0},{type:"bishop",team:1},{type:"pawn",team:0},{type:"empty",team:null},{type:"empty",team:null},{type:"empty",team:null},{type:"pawn",team:0},{type:"pawn",team:0}],
        [{type:"empty",team:null},{type:"empty",team:null},{type:"empty",team:null},{type:"empty",team:null},{type:"empty",team:null},{type:"empty",team:null},{type:"empty",team:null},{type:"empty",team:null}],
        [{type:"empty",team:null},{type:"empty",team:null},{type:"empty",team:null},{type:"empty",team:null},{type:"pawn",team:0},{type:"empty",team:null},{type:"empty",team:null},{type:"empty",team:null}],
        [{type:"empty",team:null},{type:"empty",team:null},{type:"empty",team:null},{type:"empty",team:null},{type:"empty",team:null},{type:"empty",team:null},{type:"empty",team:null},{type:"empty",team:null}],
        [{type:"empty",team:null},{type:"empty",team:null},{type:"knight",team:1},{type:"empty",team:null},{type:"pawn",team:0},{type:"empty",team:null},{type:"empty",team:null},{type:"empty",team:null}],
        [{type:"pawn",team:1},{type:"empty",team:null},{type:"knight",team:0},{type:"pawn",team:1},{type:"empty",team:null},{type:"pawn",team:1},{type:"pawn",team:1},{type:"pawn",team:1}],
        [{type:"rook",team:1},{type:"empty",team:null},{type:"bishop",team:1},{type:"empty",team:null},{type:"king",team:1},{type:"empty",team:null},{type:"knight",team:1},{type:"rook",team:1}]
      ],
      turn: 0,
      players: {
        black: {
          score: 3,
          takenPieces: ["pawn","pawn","pawn"]
        },
        white: {
          score: 15,
          takenPieces: ["pawn","king","pawn","queen","bishop"]
        }
      }
    }
  ]
}
