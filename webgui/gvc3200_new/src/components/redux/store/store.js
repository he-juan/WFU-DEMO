'use strict'

import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import rootReducer from '../reducers/index'

export default function configureStore(initialState) {
    const reducer = applyMiddleware(

    )(rootReducer, initialState)

    const createPersistentStore = applyMiddleware(
        thunkMiddleware
    )(createStore)

    const store = createPersistentStore(reducer)
    if (module.hot) {
            //Enable Webpack hot module replacement for reducers
            module.hot.accept('../reducers', () => {
            const nextReducer = require('../reducers').default
            store.replaceReducer(nextReducer)
        })
    }
    return store
}
