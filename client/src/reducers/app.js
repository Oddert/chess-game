import types from '../actions/types'
import initialState from '../constants/initialState'

const app = (state = initialState.app, action) => {
  switch (action.type) {
    case types.PLAY_LOCAL:
      return Object.assign({}, state, { playing: true, localGame: true })
    case types.PLAY_ONLINE:
      return Object.assign({}, state, { playing: true, localGame: false })
    case types.PRE_GAME:
      return Object.assign({}, state, { playing: false })
    case types.LOGIN:
      console.log(action.payload)
      const loginStateAuth = Object.assign({}, state.auth)
      loginStateAuth.isAuth = true
      loginStateAuth.user = action.payload
      return Object.assign({}, state, {
        auth: Object.assign({}, state.auth, loginStateAuth)
      })
    case types.LOGOUT:
      return Object.assign({}, state, {
        auth: {
          isAuth: false,
          user: {},
          thisClientPlayer: null
        }
      })
    case types.REFRESH_NOTIFICATIONS:
      return Object.assign({}, state, {
        notifications: action.payload
      })
    case types.ADD_NOTIFICATION:
      return Object.assign({}, state, {
        notifications: [...state.notifications, action.payload]
      })
    default:
      return state
  }
}

export default app
