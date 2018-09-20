import types from '../actions/types'
import initialState from '../constants/initialState'

const game = (state = initialState.game, action) => {
  switch (action.type) {
    case types.TAKE_PIECE:
      console.log(action)
      console.log(action.payload)
      const takePieceState = [...state.board]

      takePieceState[action.payload.from.row][action.payload.from.col] = {
        type: "empty",
        team: null
      }

      takePieceState[action.payload.to.row][action.payload.to.col] = {
        type: action.payload.piece,
        team: action.payload.team
      }

      return Object.assign({}, state, { board: takePieceState })
    case types.MOVE:
      console.log(action)
      console.log(action.payload)
      const moveState = [...state.board]

      moveState[action.payload.from.row][action.payload.from.col] = {
        type: "empty",
        team: null
      }

      moveState[action.payload.to.row][action.payload.to.col] = {
        type: action.payload.piece,
        team: action.payload.team
      }

      return Object.assign({}, state, { board: moveState })
    default:
      return state
  }
}

export default game
