import { combineReducers } from 'redux'

import game from './game'

const app = (state = {
  localGame: true,
  auth: {
    isAuth: false,
    user: {}
  }
}, action) => state

const rootReducer = combineReducers ({
  app,
  game
})

export default rootReducer
