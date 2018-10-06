import { combineReducers } from 'redux'

import game from './game'
import app from './app'

const rootReducer = combineReducers ({
  app,
  game
})

export default rootReducer
