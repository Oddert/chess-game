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



export const addPublicGame = payload => ({
  type: types.ADD_PUBLIC_GAME,
  payload
})

export const addActiveGame = payload => ({
  type: types.ADD_ACTIVE_GAME,
  payload
})

export const refreshPublicGames = payload => ({
  type: types.REFRESH_PUBLIC_GAMES,
  payload
})

export const refreshActiveGames = payload => ({
  type: types.REFRESH_ACTIVE_GAMES,
  payload
})


export const addPublicReq = payload => ({
  type: types.ADD_PUBLIC_REQ,
  payload
})
export const refreshPublicReqs = payload => ({
  type: types.REFRESH_PUBLIC_REQS,
  payload
})

export const addOutboundReq = payload => ({
  type: types.ADD_OUTBOUND_REQ,
  payload
})
export const refreshOutboundReqs = payload => ({
  type: types.REFRESH_OUTBOUND_REQS,
  payload
})

export const addInboundReq = payload => ({
  type: types.ADD_INBOUND_REQ,
  payload
})
export const refreshInboundReqs = payload => ({
  type: types.REFRESH_INBOUND_REQS,
  payload
})

export const editRequest = payload => ({
  type: types.EDIT_REQ,
  payload
})

export const deleteRequest = payload => ({
  type: types.DELETE_REQ,
  payload
})

export const refreshNotifications = payload => ({
  type: types.REFRESH_NOTIFICATIONS,
  payload
})

export const addNotification = payload => ({
  type: types.ADD_NOTIFICATION,
  payload
})
