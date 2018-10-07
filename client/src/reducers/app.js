import types from '../actions/types'
import initialState from '../constants/initialState'

const app = (state = initialState.app, action) => {
  switch (action.type) {
    case types.PLAY_LOCAL:
      return Object.assign({}, state, { playing: true, localGame: true })
    case types.PLAY_ONLINE:
      return Object.assign({}, state, { playing: true, localGame: false })
    default:
      return state
  }
}

export default app
