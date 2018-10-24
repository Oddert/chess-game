import { combineReducers } from 'redux'

import game from './game'
import app from './app'
import onlineData from './onlineData'

const rootReducer = combineReducers ({
  app,
  game,
  onlineData
})

export default rootReducer
