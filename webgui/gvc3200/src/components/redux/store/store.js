'use strict'

import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import rootReducer from '../reducers/index'

export default function configureStore() {

    let initialState = {
        curLocale:"en",
        TabactiveKey:"0",
        userType:"admin"
    }
    const createPersistentStore = applyMiddleware(
        thunkMiddleware
    )(createStore)

    const store = createPersistentStore(rootReducer,initialState)
    if (module.hot) {
        //Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers', () => {
            const nextReducer = require('../reducers').default
            store.replaceReducer(nextReducer)
        })
    }
    return store
}
