import React, { createRef } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
const TabPane = ({ tab, thisKey, activeKey, onTabClick }) => {
  return (
    <span id={`tab-${thisKey}`} className={`link-tabs-tab ${activeKey === thisKey ? 'active' : ''}`} onClick={() => onTabClick(thisKey)}>
      {tab}
    </span>
  )
}

@connect(
  state => ({
    locale: state.locale
  })
)
class Tabs extends React.Component {
  static propTypes = {
    activeKey: PropTypes.any,
    onChange: PropTypes.any,
    children: PropTypes.any
  }

  tabBarRef = createRef()

  // 底部滑动的bar
  tabListRef = createRef()

  // tab 列表
  listLeft = 0

  // 列表左侧位置
  firstTabWidth = 0 // 第一个tab的宽度

  componentDidMount () {
    this.listLeft = this.tabListRef.current.offsetLeft
    this.firstTabWidth = this.tabListRef.current.firstChild.offsetWidth
    this.tabBarRef.current.style['width'] = this.firstTabWidth + 'px'
    this.clBarStyle(this.props.activeKey)
  }

  componentDidUpdate (prevProps) {
    // 切换语言导致长度变换
    if (this.props.locale !== prevProps.locale) {
      this.listLeft = this.tabListRef.current.offsetLeft
      this.firstTabWidth = this.tabListRef.current.firstChild.offsetWidth
      this.tabBarRef.current.style['width'] = this.firstTabWidth + 'px'
      this.clBarStyle(this.props.activeKey)
    }
    if (prevProps.activeKey !== this.props.activeKey) {
      this.clBarStyle(this.props.activeKey)
    }
  }

  handleTabClick = (key) => {
    this.clBarStyle(key)
    this.props.onChange(key)
  }

  clBarStyle = (key) => {
    let curTab = document.getElementById('tab-' + key)
    if (!curTab) return false
    const [left, width ] = [curTab.offsetLeft, curTab.offsetWidth]
    this.tabBarRef.current.style['transform'] = `translate3d(${left - this.listLeft - 25}px, 0px, 0px)  scaleX(${width / this.firstTabWidth})`
    // this.tabBarRef.current.style['borderRadius'] = `${this.firstTabWidth / width * 4}px`
  }

  render () {
    const { activeKey, children } = this.props
    return (
      <div className='link-tabs'>
        <div className='link-tabs-list' ref={this.tabListRef}>
          {
            React.Children.map(children, (child) => {
              return React.cloneElement(child, {
                activeKey,
                thisKey: child.key,
                onTabClick: this.handleTabClick
              })
            })
          }
          <div className='link-tabs-bar' ref={this.tabBarRef}></div>
        </div>
      </div>
    )
  }
}

Tabs.TabPane = TabPane

export { Tabs }
