import { createStore, compose, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import rootReducer from '../reducers'
import initialState from './initialState'

const middleware = [thunk]

console.log('Devtools present?', !!window.__REDUX_DEVTOOLS_EXTENSION__)
const enhancer = !!window.__REDUX_DEVTOOLS_EXTENSION__
    ? compose(
        applyMiddleware(...middleware)
      , window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
      )
    : compose(
        applyMiddleware(...middleware)
      )

const store = createStore(
  rootReducer,
  initialState,
  enhancer
)

export default store
