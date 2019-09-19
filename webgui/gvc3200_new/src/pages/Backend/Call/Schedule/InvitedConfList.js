import React from 'react'
import { Button, Row, Col } from 'antd'
import { convertTimeInfo } from '@/components/ComponentsOfCall/ConfSetModal/ScheduleTools'

/**
 * schedules
 * handlePreviewConf
 * handleDelConf
 */

const InvitedConfList = (props, context) => {
  // 待定装填
  let stateObj = {
    '3': '进行中',
    '2': '已接受',
    '1': '已拒接',
    '0': '已结束'
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
                  <span className={'statecolor' + item.Confstate}>{stateObj[item.Confstate]}</span>
                </Col>
              </Row>
              <Row>
                <Col span={3}>时间：</Col>
                <Col className='conf-text ellips' span={21}>{convertTimeInfo(+item.Milliseconds, +item.Duration)}
                </Col>
              </Row>
              <Row>
                <Col span={3}>发起人：</Col>
                <Col className='conf-text ellips' span={9}>{+item.Host}</Col>
                <Col className='conf-status' span={12}>
                  {/* 进行中 无功能按钮 */}
                  {
                    +item.Confstate !== 3 && <Button type='primary' onClick={(e) => handleDelConf(e, item)}>{+item.Confstate === 1 ? '接受' : '拒接'}</Button>
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
