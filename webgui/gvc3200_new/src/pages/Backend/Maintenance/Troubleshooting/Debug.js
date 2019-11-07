import React, { forwardRef } from 'react'
import { Form, Button, Checkbox, message, Select, Switch, Spin } from 'antd'
import FormCommon from '@/components/FormCommon'
import FormItem from '@/components/FormItem'
import { getOptions } from '@/template'
import API from '@/api'
import './Debug.less'
import { $t } from '@/Intl'
import { rebootNotify } from '@/utils/tools'
let checklogitems = ['syslog', 'logcat', 'capture']

// 需要 forwardRef 解决 新api  暴露的问题
let CSelect = (props, ref) => {
  let { width, options, ...othter } = props
  return (
    <Select ref={ref} style={{ width }} {...othter} getPopupContainer={triggerNode => triggerNode}>
      {
        options.map(item => (
          <Select.Option value={item.v} key={item.v}>{item.t}</Select.Option>
        ))
      }
    </Select>
  )
}
CSelect = forwardRef(CSelect)

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
      let tmpValues = {}
      let len = 0
      checklogitems.forEach(key => {
        let v = +res[0][key] // 0 或 1
        tmpValues[key] = v || 0
        len += v
      })
      this.props.form.setFieldsValue({ debugAll: len === checklogitems.length ? 1 : 0, ...tmpValues })
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
      if (data['Response'] === 'Success') {
        this.setState({
          debugTraceList: data.Tracelist || []
        }, () => {
          this.props.form.setFieldsValue({ debugfile: data.Tracelist[0] || '' })
        })
      }
      return Promise.resolve()
    })
  }

  // 获取核心存储列表
  getCoredumplist = () => {
    return API.getCoredumplist().then(data => {
      if (data['Response'] === 'Success') {
        this.setState({
          coreDumpList: data.Coredumplist || []
        }, () => {
          this.props.form.setFieldsValue({ coredumpfile: data.Coredumplist[0] || '' })
        })
      }
      return Promise.resolve()
    })
  }

  // 获取录音列表
  getRecordList = () => {
    return API.getRecordList().then(data => {
      if (data['Response'] === 'Success') {
        this.setState({
          recordList: data.Records || []
        }, () => {
          this.props.form.setFieldsValue({ recordfile: data.Records[0] || '' })
        })
      }
      return Promise.resolve()
    })
  }

  // 调试信息清单 checkbox 单个事件
  checkDebugItem = () => {
    const { setFieldsValue, getFieldsValue } = this.props.form
    setTimeout(() => {
      let debugItems = getFieldsValue(checklogitems)
      let len = 0
      for (const key in debugItems) {
        len += +debugItems[key]
      }

      setFieldsValue({ debugAll: len === checklogitems.length ? 1 : 0 })
    })
  }

  // 全选/全不选
  checkDebugAll = (e) => {
    const { setFieldsValue } = this.props.form
    let _checklogitems = {}
    checklogitems.forEach(item => {
      _checklogitems[item] = e.target.checked ? 1 : 0
    })
    setFieldsValue(_checklogitems)
  }

  // 抓取debug信息
  handleDebug = () => {
    const { getFieldsValue } = this.props.form
    const { isCatching } = this.state // 是否在抓包
    const items = getFieldsValue(checklogitems)
    let _mode = items.capture === 0 ? 'none' : isCatching ? 'off' : 'on' // 如果未勾选抓包则mode为none; 如果勾选了但未开始抓包mode为on;如果勾选了并且正在抓包, mode为off;
    this.setState({
      isCatching: _mode === 'none' ? isCatching : !isCatching
    })
    API.onClickDebug({
      mode: _mode,
      ...items
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
    API.debugDeleteRecord(recordfile).then(m => {
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
    const debugItems = getFieldsValue(checklogitems)
    const options = this.options
    // 处理 一键调试 的 disable的的状态
    let unlen = 0
    for (const key in debugItems) {
      unlen += debugItems[key]
    }

    return (
      <Spin spinning={!pageLoaded} wrapperClassName='common-loading-spin'>
        <Form className='trouble-debug-page'>
          <h4 className='bak-sub-title'>{$t('c_071')}</h4>
          {/* 一键调试 */}
          <FormItem {...options['debugging']}>
            <Button type='primary' disabled={unlen === 0} onClick={this.handleDebug}>
              { debugItems['capture'] > 0 ? isCatching ? $t('b_026') : $t('b_025') : $t('b_028') }
            </Button>
          </FormItem>
          {/* 调试信息清单 */}
          <FormItem {...options['debugAll']} className='debug-item-list'>
            <Form.Item className='debug-item'>
              {
                gfd('debugAll', {
                  valuePropName: 'checked',
                  normalize: (value) => Number(value)
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
                  normalize: (value) => Number(value)
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
                  normalize: (value) => Number(value)
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
                  normalize: (value) => Number(value)
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
                <CSelect className='debug-select-item' options={
                  debugTraceList.map(i => ({ v: i, t: i }))
                } />
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
                <CSelect className='debug-select-item' options={
                  coreDumpList.map(i => ({ v: i, t: i }))
                } />
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
                <CSelect className='debug-select-item' options={
                  recordList.map(i => ({ v: i, t: i }))
                } />
              )
            }
            <Button className='debug-del-btn' onClick={this.delRecordFile}>{$t('b_003')}</Button>

          </FormItem>
          {/* 查看已有录音 */}
          <FormItem {...options['recordInfo']}>
            <a href='/recfiles/' target='__blank'>
              {$t('c_072')}
            </a>
          </FormItem>
        </Form>
      </Spin>
    )
  }
}

export default Debug
