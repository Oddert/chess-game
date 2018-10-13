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

      const takePiece_State = Object.assign({}, state)
      const takePiece_Player = action.payload.team === 0 ? 'black' : 'white'
      const takePiece_FromRow = action.payload.from.row
      const takePiece_FromCol = action.payload.from.col
      const takePiece_ToRow = action.payload.to.row
      const takePiece_ToCol = action.payload.to.col
      const takePiece_CellTarget = takePiece_State.board[takePiece_ToRow][takePiece_ToCol]

      takePiece_State.players[takePiece_Player].score += convertPoints(takePiece_CellTarget.type)
      takePiece_State.players[takePiece_Player].takenPieces.push(takePiece_CellTarget.type)

      takePiece_State.board[takePiece_FromRow][takePiece_FromCol] = {
        type: "empty",
        team: null
      }

      takePiece_State.board[takePiece_ToRow][takePiece_ToCol] = {
        type: action.payload.piece,
        team: action.payload.team
      }

      takePiece_State.turn = action.payload.team === 0 ? 1 : 0

      return takePiece_State

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
      console.log(state)
      console.log(action.payload)
      // let playerTeam
      // if (action.payload.black.id === )
      return Object.assign({}, state, {
        board: action.payload.board,
        turn: action.payload.lastMove,
        players: {
          black: action.payload.black,
          white: action.payload.white
        }
      })
    case 'DEV_TOGGLE_TEAM':
      return Object.assign({}, state, {
        thisClientPlayer: state.thisClientPlayer === 0 ? 1 : 0
      })
    default:
      return state
  }
}

export default game
