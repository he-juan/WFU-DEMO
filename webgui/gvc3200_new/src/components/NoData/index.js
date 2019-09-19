/**
 * 空数据占位
 */
import React from 'react'
import './NoData.less'
import { $t } from '@/Intl'

const NoData = ({ tip }) => {
  return (
    <div className='no-data'>
      <i className='icons icon-no-data'></i>
      <br />
      <span>
        {
          tip || $t('c_039')
        }
      </span>
    </div>
  )
}

export default NoData
