import React, { memo } from 'react'
import { Icon } from 'antd-mobile'
import { $t } from '../../Intl'
import API from '../../api'

const Result = () => {
  API.quickconfdone()
  return (
    <div className='page result-page'>
      <p style={{
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        margin: 'auto',
        width: '100%',
        height: 100,
        textAlign: 'center',
        fontSize: 20
      }}>
        <Icon type='check-circle' color='#108ee9' size='lg' /> <br /><br />
        {$t('c_045')}
      </p>
    </div>
  )
}

export default memo(Result)
