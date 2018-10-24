import types from '../actions/types'
import initialState from '../constants/initialState'

const onlineData = (state = initialState.onlineData, action) => {
  switch(action.type) {
    case types.ADD_PUBLIC_GAMES:
      return Object.assign({}, state, {
        games: Object.assign({}, state.games, {
          public: {
            lastUpdated: Date.now(),
            data: [...state.games.public.data, ...action.payload]
          }
        })
      })
    case types.ADD_ACTIVE_GAMES:
      return Object.assign({}, state, {
        games: Object.assign({}, state.games, {
          active: {
            lastUpdated: Date.now(),
            data: [...state.games.active.data, ...action.payload]
          }
        })
      })
    case types.ADD_PUBLIC_REQ:
      return Object.assign({}, state, {
        requests: Object.assign({}, state.requests, {
          public: {
            lastUpdated: Date.now(),
            data: [...state.requests.public.data, ...action.payload]
          }
        })
      })
    case types.ADD_OUTBOUND_REQ:
      return Object.assign({}, state, {
        requests: Object.assign({}, state.requests, {
          outbound: {
            lastUpdated: Date.now(),
            data: [...state.requests.outbound.data, ...action.payload]
          }
        })
      })
    case types.ADD_INBOUND_REQ:
      return Object.assign({}, state, {
        requests: Object.assign({}, state.requests, {
          inbound: {
            lastUpdated: Date.now(),
            data: [...state.requests.inbound.data, ...action.payload]
          }
        })
      })
    default:
      return state
  }
}

export default onlineData
