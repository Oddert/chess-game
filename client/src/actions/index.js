import types from './types'

export const testFunc = () => ({ type: types.TEST })

export const takePiece = payload => ({
  type: types.TAKE_PIECE,
  payload
})

export const move = payload => ({
  type: types.MOVE,
  payload
})
