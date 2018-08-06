import React from "react";
import ReactDOM from "react-dom";
import createStore from './redux/store/store'
import { Provider } from 'react-redux'
import App from './app'
import "../css/frame.css";
export var cookie = $.cookie
export var store = createStore()
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
 document.getElementById('container'));
