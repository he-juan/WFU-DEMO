/**
 * 顶部header
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import LocalSelect from '@/components/LocalSelect'
import RemoteControl2 from '@/components/RemoteControl' // 遥控器
// import RemoteControl from './RemoteControl'
import ScreenShare from './ScreenShare'
import ApplyBtn from './ApplyBtn'
import UserMenu from './UserMenu'
import DNDBtn from './DNDBtn'
import SearchBox from '@/components/SearchBox'
import './bakheader.less'
import { BROWSER } from '@/utils/tools'

const notSupport = BROWSER.name === 'ie' || BROWSER.name === 'edge'

@connect(
  (state) => ({
    productInfo: state.productInfo
  })
)
class BakHeader extends Component {
  render () {
    const { productInfo } = this.props
    return (
      <div className='bak-header'>
        <div className='bak-header-logo'>
          <i className='icons icon-logo' />{productInfo['Product']}
        </div>
        <UserMenu />
        <em className='border' />
        <LocalSelect />
        <em className='border' />
        {/* 遥控器 */}
        <RemoteControl2 productInfo={productInfo}/>
        <em className='border' />
        {/* <RemoteControl />
        <em className='border' /> */}
        {notSupport ? null : <ScreenShare />}
        {notSupport ? null : <em className='border' /> }
        <DNDBtn />
        <em className='border' />
        <SearchBox />
        <em className='border' />
        <ApplyBtn />
      </div>
    )
  }
}

export default BakHeader
