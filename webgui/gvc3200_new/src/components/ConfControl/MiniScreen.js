import React, { Component, createRef } from 'react'
import PropTypes from 'prop-types'
import './MiniScreen.less'
class MiniScreen extends Component {
  static propTypes = {
    onSwitchScreen: PropTypes.func
  }

  miniRef = createRef()

  mdStamp = 0

  // 鼠标mousedown 时间戳
  mdX = 0

  // 鼠标mousedown x位置
  mdY = 0

  // 鼠标mousedown y位置
  initRight = 2

  // 初始x位置
  initTop = 52

  // 初始y位置
  curRight = 0

  // 当前x位置
  curTop = 50

  // 当前y位置
  winWidth = window.innerWidth || document.documentElement.clientWidth

  winHeight = window.innerHeight || document.documentElement.clientHeight

  componentDidMount () {
    window.addEventListener('resize', this.calWinSize, false)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.calWinSize)
  }

  calWinSize = () => {
    this.winWidth = window.innerWidth || document.documentElement.clientWidth
    this.winHeight = window.innerHeight || document.documentElement.clientHeight
  }

  mouseDownHandler = (e) => {
    this.mdX = e.pageX
    this.mdY = e.pageY
    this.mdStamp = new Date().getTime()
    document.addEventListener('mousemove', this.dragHandler, false)
    document.addEventListener('mouseup', this.mouseupHandler, false)
  }

  dragHandler = (e) => {
    e.preventDefault()
    this.curRight = this.mdX - e.pageX + this.initRight
    this.curTop = e.pageY - this.mdY + this.initTop

    if (this.curRight < 0) this.curRight = 0
    if (this.curRight > this.winWidth - 260) this.curRight = this.winWidth - 260 // 260 miniRef 的宽度
    if (this.curTop < 0) this.curTop = 0
    if (this.curTop > this.winHeight - 146) this.curTop = this.winHeight - 146 // 146 miniRef 的高度

    this.miniRef.current.style['right'] = this.curRight + 'px'
    this.miniRef.current.style['top'] = this.curTop + 'px'
  }

  mouseupHandler = () => {
    this.initRight = this.curRight
    this.initTop = this.curTop
    document.removeEventListener('mousemove', this.dragHandler)
    document.removeEventListener('mouseup', this.mouseupHandler)
  }

  clickHandler = () => {
    if (new Date().getTime() - this.mdStamp < 150) {
      this.props.onSwitchScreen()
    }
  }

  render () {
    return (
      <div className='mini-screen' ref={this.miniRef} onMouseDown={this.mouseDownHandler} onClick={this.clickHandler}>
        mini-screen
      </div>
    )
  }
}

export default MiniScreen
