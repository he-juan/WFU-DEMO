/**
 * 顶部header
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import LocalSelect from '@/components/LocalSelect'
import RemoteControl from '@/components/RemoteControl'
import ApplyBtn from './ApplyBtn'
import UserMenu from './UserMenu'
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
        <RemoteControl productInfo={productInfo}/>
        <em className='border' style={{ marginRight: 8 }} />
        <SearchBox />
        <em className='border' />
        <ApplyBtn />
      </div>
    )
  }
}

export default BakHeader
