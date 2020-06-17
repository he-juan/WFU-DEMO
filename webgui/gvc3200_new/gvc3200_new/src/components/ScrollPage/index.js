/**
 * 滚动加载， 处理大数据分页
 */
import React, { Component, createRef } from 'react'
import { throttleReactEvent } from '@/utils/tools'
import PropTypes from 'prop-types'

class ScrollPage extends Component {
  static propTypes = {
    onLoad: PropTypes.func.isRequired, // 滚动到底的回调
    wrapperHeight: PropTypes.number.isRequired, // 外层容器的高度
    noMore: PropTypes.bool.isRequired, // 数据是否加载完
    triggerHeight: PropTypes.number // 滚动到底时触发加载的高度
  }

  childRef = createRef()

  handleWrapperScroll = throttleReactEvent((e) => {
    const { onLoad, noMore, triggerHeight = 150 } = this.props
    const childHeight = (this.childRef && this.childRef.current.offsetHeight) || 0
    if ((childHeight - e.target.offsetHeight - e.target.scrollTop) > triggerHeight || noMore) return false
    onLoad()
  })

  render () {
    const { wrapperHeight, children } = this.props
    return (
      <div style={{ height: wrapperHeight || 300, overflow: 'auto' }} onScroll={this.handleWrapperScroll}>
        <div ref={this.childRef}>
          {children}
        </div>
      </div>
    )
  }
}

export default ScrollPage
