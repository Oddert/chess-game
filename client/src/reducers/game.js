import types from '../actions/types'
import initialState from '../constants/initialState'

const convertPoints = str => {
  switch(str) {
    case 'pawn':
      return 1;
    case 'knight':
      return 3;
    case 'bishop':
      return 3;
    case 'rook':
      return 5;
    case 'queen':
      return 9;
    default:
      console.log('Check please, switch game reducer ln: 4')
      console.log(str)
      return 1;
  }
}

const game = (state = initialState.game, action) => {
  switch (action.type) {
    case types.TAKE_PIECE:

      const takePieceState = Object.assign({}, state)
      const tpPlayer = action.payload.team === 0 ? 'black' : 'white'
      const tpFromRow = action.payload.from.row
      const tpFromCol = action.payload.from.col
      const tpToRow = action.payload.to.row
      const tpToCol = action.payload.to.col
      const tpCellTarget = takePieceState.board[tpToRow][tpToCol]

      takePieceState.players[tpPlayer].score += convertPoints(tpCellTarget.type)
      takePieceState.players[tpPlayer].takenPieces.push(tpCellTarget.type)

      takePieceState.board[tpFromRow][tpFromCol] = {
        type: "empty",
        team: null
      }

      takePieceState.board[tpToRow][tpToCol] = {
        type: action.payload.piece,
        team: action.payload.team
      }

      takePieceState.turn = action.payload.team === 0 ? 1 : 0

      return takePieceState
    case types.MOVE:
      const moveState = [...state.board]

      moveState[action.payload.from.row][action.payload.from.col] = {
        type: "empty",
        team: null
      }

      moveState[action.payload.to.row][action.payload.to.col] = {
        type: action.payload.piece,
        team: action.payload.team
      }

      return Object.assign({}, state, { board: moveState, turn: action.payload.team === 0 ? 1 : 0 })
    case types.SELECT_GAME:
      return Object.assign({}, state, {
        board: action.payload.board,
        turn: action.payload.lastMove,
        players: {
          black: action.payload.black,
          white: action.payload.white
        }
      })
    default:
      return state
  }
}

export default game
