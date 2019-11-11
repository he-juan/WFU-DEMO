/**
 * 顶部header
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import LocalSelect from '@/components/LocalSelect'
// import RemoteControl from '@/components/RemoteControl'
import RemoteControl from './RemoteControl'
import ScreenShare from './ScreenShare'
import ApplyBtn from './ApplyBtn'
import UserMenu from './UserMenu'
import DNDBtn from './DNDBtn'
import SearchBox from '@/components/SearchBox'
import './bakheader.less'

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
        {/* <RemoteControl productInfo={productInfo}/> 遥控器功能暂时移除 */}
        <RemoteControl />
        <em className='border' />
        <ScreenShare />
        <em className='border' />
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
