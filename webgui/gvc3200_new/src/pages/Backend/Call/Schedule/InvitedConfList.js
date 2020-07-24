import React from 'react'
import { Button, Row, Col } from 'antd'
import { convertTimeInfo } from '@/components/ComponentsOfCall/ConfSetModal/ScheduleTools'
import { $t } from '@/Intl'

/**
 * schedules
 * handlePreviewConf
 * handleDelConf
 */

const InvitedConfList = (props, context) => {
  // 待定装填
  let googleStatus = {
    '0': $t('c_365'), // 未确定 改为 已接受
    '1': $t('c_365'), // 已接受
    '2': $t('c_366') // 已拒绝
  }
  let { schedules, handlePreviewConf, handleDelConf } = props

  return (
    <div className='preconflist'>
      {
        schedules.map((item, index) => {
          return (
            <div className='confbox' key={index} onClick={(e) => handlePreviewConf(item)}>
              <Row>
                <Col className='ellips' span={15}>
                  {+item['Recycle'] !== 0 && <i className='icons icon-repeat' />}
                  {item.Displayname}
                </Col>
                <Col className='conf-status' span={9}>
                  <span className={'statecolor' + (+item.GoogleStatus <= 1 ? '1' : item.GoogleStatus)}>{googleStatus[item.GoogleStatus]}</span>
                </Col>
              </Row>
              <Row>
                <Col span={3}>{$t('c_253')}：</Col>
                <Col className='conf-text ellips' span={21}>{convertTimeInfo(+item.Milliseconds, +item.Duration)}
                </Col>
              </Row>
              <Row>
                <Col span={3}>{$t('c_249')}：</Col>
                <Col className='conf-text ellips' span={9}>{item.Host}</Col>
                <Col className='conf-status' span={12}>
                  {/* 进行中 无功能按钮 */}
                  {
                    +item.GoogleStatus !== 3 && <Button type='primary' onClick={(e) => handleDelConf(e, item)}>{$t(+item.GoogleStatus === 2 ? 'b_066' /* 接受 */ : 'b_067' /* 拒绝 */)}</Button>
                  }
                </Col>
              </Row>
            </div>
          )
        })
      }
    </div>
  )
}

export default InvitedConfList
