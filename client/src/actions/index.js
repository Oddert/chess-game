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

export const chatMessage = payload => ({
  type: types.CHAT_MESSAGE,
  payload
})



export const addPublicGames = payload => ({
  type: types.ADD_PUBLIC_GAMES,
  payload
})

export const addActiveGames = payload => ({
  type: types.ADD_ACTIVE_GAMES,
  payload
})


export const addPublicReq = payload => ({
  type: types.ADD_PUBLIC_REQ,
  payload
})

export const addOutboundReq = payload => ({
  type: types.ADD_OUTBOUND_REQ,
  payload
})

export const addInboundReq = payload => ({
  type: types.ADD_INBOUND_REQ,
  payload
})

export const editRequest = payload => ({
  type: types.EDIT_REQ,
  payload
})
