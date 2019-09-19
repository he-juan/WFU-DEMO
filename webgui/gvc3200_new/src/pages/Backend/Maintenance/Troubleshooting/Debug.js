import React from 'react'
import { Form, Button, Checkbox, message, Select, Switch, Spin } from 'antd'
import FormCommon from '@/components/FormCommon'
import FormItem from '@/components/FormItem'
import { getOptions } from '@/template'
import API from '@/api'
import './Debug.less'
import { $t } from '@/Intl'
import { rebootNotify } from '@/utils/tools'

@Form.create()
class Debug extends FormCommon {
  state = {
    isCatching: false, // 是否正在抓包
    isRecording: false,
    debugTraceList: [], // debug 信息列表
    coreDumpList: [], // 核心存储列表
    recordList: [], // 录音列表
    pageLoaded: false
  }
  options = getOptions('Maintenance.TroubleShooting.Debug')
  rebootOptions = {}
  componentDidMount () {
    Promise.all([
      API.getCaptureState(),
      API.getRecordState(),
      this.getTracelist(),
      this.getCoredumplist(),
      this.getRecordList()
    ]).then(res => {
      this.setState({
        isCatching: res[0].mode === 'on',
        isRecording: res[1].record_state === '1',
        pageLoaded: true
      })
    })
  }

  // 获取debug信息列表
  getTracelist = () => {
    API.getPvalues(['P29611']).then(data => {
      const { P29611 } = data
      this.rebootOptions = { P29611 }
      this.props.form.setFieldsValue({ P29611 })
    })
    return API.getTracelist().then(data => {
      this.setState({
        debugTraceList: data.Tracelist || []
      })
      this.props.form.setFieldsValue({ debugfile: data.Tracelist[0] || '' })
      return Promise.resolve()
    })
  }

  // 获取核心存储列表
  getCoredumplist = () => {
    return API.getCoredumplist().then(data => {
      let coreDumpList = []
      if (data.Response === 'Success') {
        coreDumpList = data.Coredumplist || []
      }
      this.setState({
        coreDumpList: coreDumpList
      })
      this.props.form.setFieldsValue({ coredumpfile: coreDumpList[0] || '' })
      return Promise.resolve()
    })
  }

  // 获取录音列表
  getRecordList = () => {
    return API.getRecordList().then(data => {
      this.setState({
        recordList: data.Records || []
      })
      this.props.form.setFieldsValue({ recordfile: data.Records[0] || '' })
      return Promise.resolve()
    })
  }

  checkDebugAll = (e) => {
    const { setFieldsValue } = this.props.form
    setFieldsValue(!e.target.checked ? {
      syslog: 0,
      logcat: 0,
      capture: 0
    } : {
      syslog: 1,
      logcat: 1,
      capture: 1
    })
  }
  checkDebugItem = () => {
    const { setFieldsValue, getFieldsValue } = this.props.form
    setTimeout(() => {
      let debugItems = getFieldsValue(['syslog', 'logcat', 'capture'])
      let isAllCheck = debugItems['syslog'] && debugItems['logcat'] && debugItems['capture']
      setFieldsValue({ debugAll: isAllCheck ? 1 : 0 })
    })
  }
  // 抓取debug信息
  handleDebug = () => {
    const { getFieldsValue } = this.props.form
    const { isCatching } = this.state // 是否在抓包
    const { syslog, logcat, capture } = getFieldsValue(['syslog', 'logcat', 'capture'])
    let _mode = capture === 0 ? 'none' : isCatching ? 'off' : 'on' // 如果未勾选抓包则mode为none; 如果勾选了但未开始抓包mode为on;如果勾选了并且正在抓包, mode为off;
    this.setState({
      isCatching: _mode === 'none' ? isCatching : !isCatching
    })
    API.onClickDebug({
      mode: _mode,
      syslog: syslog,
      logcat: logcat,
      capture: capture
    }).then(data => {
      if (_mode === 'on' && data.Response === 'Error') {
        this.setState({
          isCatching: false
        })
        message.error($t('m_068'))
      } else if (_mode === 'off' || _mode === 'none') {
        this.getTracelist()
      }
    })
  }

  // 删除debug信息
  delDebugFile = () => {
    const debugfile = this.props.form.getFieldValue('debugfile')
    if (!debugfile) return false
    API.deleteTrace(debugfile).then(m => {
      if (m.Response === 'Success') {
        message.success($t('m_013'))
        this.getTracelist()
      } else {
        message.error($t('m_014'))
      }
    })
  }

  // 切换生成核心存储时下发P值
  handleCoredump = (v) => {
    let values = { P29611: Number(v) }
    API.putPvalues(values).then(msgs => {
      // 判断是否 弹出 重启提示弹窗
      rebootNotify({ oldOptions: this.rebootOptions, newOptions: values }, () => {
        for (const key in this.rebootOptions) {
          this.rebootOptions[key] = values[key].toString()
        }
      })
    })
  }

  // 删除核心存储文件
  delCoredumpFile = () => {
    const coredumpfile = this.props.form.getFieldValue('coredumpfile')
    if (!coredumpfile) return false
    API.deleteCoredump(coredumpfile).then(m => {
      if (m.Response === 'Success') {
        message.success($t('m_013'))
        this.getCoredumplist()
      } else {
        message.error($t('m_014'))
      }
    })
  }

  // 开始录音
  handleRecord = () => {
    const { isRecording } = this.state
    if (!isRecording) {
      API.startRecording().then(m => {
        if (m.Response === 'Success') {
          this.setState({
            isRecording: true
          })
        }
      })
    } else {
      API.stopRecording().then(m => {
        if (m.Response === 'Success') {
          this.setState({
            isRecording: false
          })
          this.getRecordList()
        }
      })
    }
  }

  // 删除录音列表
  delRecordFile = () => {
    const recordfile = this.props.form.getFieldValue('recordfile')
    if (!recordfile) return false
    API.deleteRecord(recordfile).then(m => {
      if (m.Response === 'Success') {
        message.success($t('m_013'))
        this.getRecordList()
      } else {
        message.error($t('m_014'))
      }
    })
  }
  render () {
    const { getFieldDecorator: gfd, getFieldsValue } = this.props.form
    const { isCatching, debugTraceList, coreDumpList, recordList, isRecording, pageLoaded } = this.state
    const { syslog, logcat, capture } = getFieldsValue(['syslog', 'logcat', 'capture'])
    const options = this.options

    return (
      <Spin spinning={!pageLoaded} wrapperClassName='common-loading-spin'>
        <Form className='trouble-debug-page'>
          <h4 className='bak-sub-title'>{$t('c_071')}</h4>
          {/* 一键调试 */}
          <FormItem {...options['debugging']}>
            <Button type='primary' disabled={syslog === 0 && logcat === 0 && capture === 0} onClick={this.handleDebug}>
              { capture > 0 ? isCatching ? $t('b_026') : $t('b_025') : $t('b_028') }
            </Button>
          </FormItem>
          {/* 调试信息清单 */}
          <FormItem {...options['debugAll']} className='debug-item-list'>
            <Form.Item className='debug-item'>
              {
                gfd('debugAll', {
                  valuePropName: 'checked',
                  normalize: (value) => Number(value),
                  initialValue: 1
                })(
                  <Checkbox onChange={(e) => this.checkDebugAll(e)} disabled={isCatching}>{$t('c_055')}</Checkbox>
                )
              }
            </Form.Item>
            <hr />
            {/* 系统日志 */}
            <Form.Item className='debug-item'>
              {
                gfd('syslog', {
                  valuePropName: 'checked',
                  normalize: (value) => Number(value),
                  initialValue: 1
                })(
                  <Checkbox onChange={(e) => this.checkDebugItem(e)} disabled={isCatching}>{$t('c_074')}</Checkbox>
                )
              }
            </Form.Item>
            {/* 信息日志 */}
            <Form.Item className='debug-item'>
              {
                gfd('logcat', {
                  valuePropName: 'checked',
                  normalize: (value) => Number(value),
                  initialValue: 1
                })(
                  <Checkbox onChange={(e) => this.checkDebugItem(e)} disabled={isCatching}>{$t('c_075')}</Checkbox>
                )
              }
            </Form.Item>
            {/* 抓包 */}
            <Form.Item className='debug-item'>
              {
                gfd('capture', {
                  valuePropName: 'checked',
                  normalize: (value) => Number(value),
                  initialValue: 1
                })(
                  <Checkbox onChange={(e) => this.checkDebugItem(e)} disabled={isCatching}>{$t('c_076')}</Checkbox>
                )
              }
            </Form.Item>
          </FormItem>
          {/* 已有调试信息列表 */}
          <FormItem {...options['debugfile']}>
            {
              gfd('debugfile')(
                <Select className='debug-select-item'>
                  {
                    debugTraceList.map(i => <Select.Option value={i} key={i}>{i}</Select.Option>)
                  }
                </Select>
              )
            }
            <Button className='debug-del-btn' onClick={this.delDebugFile}>{$t('b_003')}</Button>
          </FormItem>
          {/* 查看已有调试信息 */}
          <FormItem {...options['debugInfo']}>
            <a href='/ppp/' target='__blank'>
              {$t('c_072')}
            </a>
          </FormItem>
          <h4 className='bak-sub-title'>{$t('c_073')}</h4>
          {/* 生成核心转储 */}
          <FormItem {...options['P29611']}>
            {
              gfd('P29611', {
                valuePropName: 'checked',
                normalize: (value) => !!Number(value)
              })(
                <Switch onChange={this.handleCoredump}/>
              )
            }
          </FormItem>
          {/* 已有核心转储列表 */}
          <FormItem {...options['coredumpfile']}>
            {
              gfd('coredumpfile')(
                <Select className='debug-select-item'>
                  {
                    coreDumpList.map(i => <Select.Option value={i} key={i}>{i}</Select.Option>)
                  }
                </Select>
              )
            }
            <Button className='debug-del-btn' onClick={this.delCoredumpFile}>{$t('b_003')}</Button>
          </FormItem>
          {/* 查看已有核心转储 */}
          <FormItem {...options['coreInfo']}>
            <a href='/coredump/' target='__blank'>
              {$t('c_072')}
            </a>
          </FormItem>
          <h4 className='bak-sub-title'>{$t('c_077')}</h4>
          {/* 录音 */}
          <FormItem {...options['record']}>
            <Button onClick={this.handleRecord} type='primary'>{$t(isRecording ? 'b_026' : 'b_025')}</Button>
          </FormItem>
          {/* 已有录音列表 */}
          <FormItem {...options['recordfile']}>
            {
              gfd('recordfile')(
                <Select className='debug-select-item'>
                  {
                    recordList.map(i => <Select.Option value={i} key={i}>{i}</Select.Option>)
                  }
                </Select>
              )
            }
            <Button className='debug-del-btn' onClick={this.delRecordFile}>{$t('b_003')}</Button>

          </FormItem>
          {/* 查看已有录音 */}
          <FormItem {...options['recordInfo']}>
            <a href='/recfile/' target='__blank'>
              {$t('c_072')}
            </a>
          </FormItem>
        </Form>
      </Spin>
    )
  }
}

export default Debug
