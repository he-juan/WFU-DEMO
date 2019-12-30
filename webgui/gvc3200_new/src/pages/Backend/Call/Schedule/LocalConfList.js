import React, { Fragment } from 'react'
import { Button, Row, Col, Popconfirm, Popover } from 'antd'
import { convertTimeInfo } from '@/components/ComponentsOfCall/ConfSetModal/ScheduleTools'
import { $t } from '@/Intl'

/**
 * schedules
 * handleSetConf
 * handleStartConf
 * handleCancelConf
 * cancelPop
 */

const LocalConfList = (props) => {
  let stateObj = {
    '3': $t('c_245'), // 进行中
    '2': $t('c_246'), // 待主持
    '1': $t('c_247'), // 未开始
    '0': $t('c_248') // 已结束
  }
  let { schedules, handleSetConf, handleStartConf, handleCancelConf, cancelPop } = props

  return (
    <div className='preconflist'>
      {
        schedules.map((item, index) => {
          return (
            <div className='confbox' key={index} onClick={(e) => handleSetConf('preview', e, item)}>
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
                <Col span={3}>{$t('c_253')}：</Col>
                <Col className='conf-text ellips' span={21}>{convertTimeInfo(+item.Milliseconds, +item.Duration)}
                </Col>
              </Row>
              <Row>
                <Col span={3}>{$t('c_249')}：</Col>
                <Col className='conf-text ellips' span={9}>{+item.Host === 1 ? $t('c_251') : item.Host}</Col>
                <Col className='conf-status' span={12}>
                  {/* Confstate 3 进行中 0 已结束 */}
                  {
                    +item.Confstate === 3 ? null : +item.Confstate === 0 ? <Fragment>
                      <Button type='primary' onClick={(e) => handleSetConf('add', e, item)}>{$t('b_049')}</Button>
                      <Popconfirm placement='top' title={$t('m_124')} okText={$t('b_002')} cancelText={$t('b_005')} onCancel={e => cancelPop(e)} onConfirm={(e) => handleCancelConf(e, item.Id)}>
                        <Button type='default' onClick={(e) => cancelPop(e)}>{$t('b_050')}</Button>
                      </Popconfirm>
                    </Fragment> : <Fragment>
                      <Button type='primary' style={{ background: '#4bd66a', borderColor: '#4bd66a' }} onClick={(e) => handleStartConf(e, item)}>{$t('b_051')}</Button>
                      <Button type='primary' onClick={(e) => handleSetConf('edit', e, item)}>{$t('b_052')}</Button>
                      {/* Recycle 为0 非重复会议 */}
                      {
                        +item['Recycle'] === 0 ? <Popconfirm placement='top' title={$t('m_125')} okText={$t('b_002')} cancelText={$t('b_005')} onCancel={e => cancelPop(e)} onConfirm={(e) => handleCancelConf(e, item.Id)}>
                          <Button type='default' onClick={(e) => cancelPop(e)}>{$t('b_053')}</Button>
                        </Popconfirm> : <Popover title={$t('c_250')} content={
                          <Fragment>
                            <p style={{ cursor: 'pointer' }} onClick={(e) => handleCancelConf(e, item.Id, 1)}>{$t('b_054')}</p>
                            <p style={{ cursor: 'pointer' }} onClick={(e) => handleCancelConf(e, item.Id)}>{$t('b_055')}</p>
                          </Fragment>
                        } trigger='click'>
                          <Button type='default' onClick={(e) => cancelPop(e)}>{$t('b_053')}</Button>
                        </Popover>
                      }
                    </Fragment>
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

export default LocalConfList
