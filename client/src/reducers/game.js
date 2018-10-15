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

const toPGN = (fPiece, fRow, fCol, tPiece, tRow, tCol, take) => {
  let fPieceLetter = fPiece.substring(0,1).toUpperCase()
  let tPieceLetter = tPiece.substring(0,1).toUpperCase()
  let fColLetter = "abcdefgh".substring(fCol, fCol+1)
  let tColLetter = "abcdefgh".substring(tCol, tCol+1)
  return {f: `${fPieceLetter + fColLetter + fRow}`, t: `${tPieceLetter + tColLetter + tRow}`, x: !!take}
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

      let takePGN = toPGN(action.payload.piece, action.payload.from.row, action.payload.from.col, action.payload.piece, action.payload.to.row, action.payload.to.col, true)

      if (action.payload.team === 0) {
        takePiece_State.moves[takePiece_State.moves.length-1].b = takePGN
      } else if (action.payload.team === 1) {
        takePiece_State.moves.push({ w: takePGN })
      }

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

      let movePGN = toPGN(action.payload.piece, action.payload.from.row, action.payload.from.col, action.payload.piece, action.payload.to.row, action.payload.to.col, false)
      let moveMoves = [...state.moves]

      if (action.payload.team === 0) {
        moveMoves[moveMoves.length-1].b = movePGN
      } else if (action.payload.team === 1) {
        moveMoves.push({ w: movePGN })
      }

      return Object.assign({}, state, { board: moveState, turn: action.payload.team === 0 ? 1 : 0, moves: moveMoves })
    case types.SELECT_GAME:
      console.log(state)
      console.log(action.payload)
      return Object.assign({}, state, {
        board: action.payload.board,
        turn: action.payload.lastMove,
        name: action.payload.name,
        thisClientPlayer: action.payload.thisClientPlayer,
        players: {
          black: action.payload.black,
          white: action.payload.white
        }
      })
    case types.PLAY_LOCAL:
      return initialState.game
    case types.UPDATE_TITLE:
      return Object.assign({}, state, {
        name: action.payload
      })
    case types.UPDATE_META:
      return Object.assign({}, state, action.payload)
    case 'DEV_TOGGLE_TEAM':
      return Object.assign({}, state, {
        thisClientPlayer: state.thisClientPlayer === 0 ? 1 : 0
      })
    case types.LOGIN:
      let thisClientPlayer = null
      if (state.players.black.id === action.payload._id) thisClientPlayer = 0
      if (state.players.white.id === action.payload._id) thisClientPlayer = 1
      return Object.assign({}, state, {
        thisClientPlayer
      })
    case types.LOGOUT:
    case types.DESELECT_GAME:
      return Object.assign({}, state, {
        thisClientPlayer: null
      })
    default:
      return state
  }
}

export default game
