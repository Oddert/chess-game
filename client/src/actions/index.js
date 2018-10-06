import types from './types'

export const takePiece = payload => ({
  type: types.TAKE_PIECE,
  payload
})

export const move = payload => ({
  type: types.MOVE,
  payload
})

export const playLocal = () => ({
  type: types.PLAY_LOCAL
})
