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

export const playOnline = () => ({
  type: types.PLAY_ONLINE
})

export const preGame = () => ({
  type: types.PRE_GAME
})

export const selectGame = payload => ({
  type: types.SELECT_GAME,
  payload
})

export const login = payload => ({
  type: types.LOGIN,
  payload
})

export const logout = () => ({
  type: types.LOGOUT
})

export const deselectGame = () => ({
  type: types.DESELECT_GAME
})

export const updateTitle = payload => ({
  type: types.UPDATE_TITLE,
  payload
})

export const updateMeta = payload => ({
  type: types.UPDATE_META,
  payload
})
