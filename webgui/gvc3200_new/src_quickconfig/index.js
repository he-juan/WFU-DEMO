import React from 'react'
import ReactDOM from 'react-dom'
import QuickConfigApp from './QuickConfigApp'
import FastClick from 'fastclick'

/**
 * rem init
 */
(function (doc, win) {
  let docEl = doc.documentElement
  let resizeEvent = 'orientationchange' in win ? 'orientationchange' : 'resize'
  let docWidth

  function setDocFontSize () {
    docWidth = win.innerWidth || docEl.clientWidth
    if (docWidth >= 750) {
      docEl.style.fontSize = '75px'
    } else {
      docEl.style.fontSize = docWidth / 10 + 'px'
    }
  }
  setDocFontSize()
  win.addEventListener(resizeEvent, setDocFontSize, false)
  doc.addEventListener('DOMContentLoaded', setDocFontSize, false)
})(document, window)

/**
 * fastclick
 **/
document.addEventListener('DOMContentLoaded', function () {
  FastClick.attach(document.body)
}, false)

ReactDOM.render(<QuickConfigApp />, document.getElementById('root'))