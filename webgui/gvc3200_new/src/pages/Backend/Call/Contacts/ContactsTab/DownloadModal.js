import React from 'react'
import { Button, Modal, message, Form, Progress } from 'antd'
import { debounceReactEvent } from '@/utils/tools'
import FormCommon from '@/components/FormCommon'
import FormItem, { CheckboxItem, RadioGroupItem, SelectItem, InputItem, PwInputItem } from '@/components/FormItem'
import API from '@/api'
import PropTypes from 'prop-types'
import { $t } from '@/Intl'

let TIMER = null

@Form.create()
class DownloadModal extends FormCommon {
  static propTypes = {
    visible: PropTypes.bool,
    onCancel: PropTypes.func,
    contactsLength: PropTypes.number, // 当前联系人数量
    maxContactsCount: PropTypes.number, // 最大联系人数量
    onDownload: PropTypes.func
  }
  state = {
    downloadPercent: -1
  }
  componentDidUpdate (preProps) {
    const { setFieldsValue } = this.props.form
    if (preProps.visible !== this.props.visible && this.props.visible === true) {
      API.getPvalues(['P1435', 'P1436', 'P330', 'P1681', 'P331', 'P6713', 'P6714', 'P332']).then((data) => {
        const { P1435, P1436 } = data
        data.clearMode = Number(P1435) === 0 ? '1' : P1435 // 别扭的处理方式
        data.replaceMode = Number(P1436) === 0 ? '1' : P1436
        setFieldsValue(data)
      })
    }
  }
  componentWillUnmount () {
    clearTimeout(TIMER)
    TIMER = null
  }

  submitConfig = (values) => {
    const { P1435, P1436, clearMode, replaceMode, ...other } = values
    other.P1435 = P1435 === 0 ? 0 : clearMode
    other.P1436 = P1436 === 0 ? 0 : replaceMode
    return API.putPvalues(other)
  }
  saveDownloadConfig = () => {
    const { validateFields } = this.props.form
    validateFields((err, values) => {
      if (!err) {
        this.submitConfig(values).then((msg) => {
          if (msg.Response === 'Success') {
            message.success($t('m_001'))
          } else {
            message.success($t('m_002'))
          }
          API.sendphbknotify()
        })
      }
    })
  }

  handleDownload = () => {
    const { contactsLength, maxContactsCount } = this.props
    const { validateFields } = this.props.form
    if (contactsLength >= maxContactsCount) {
      message.error($t('m_108'))
      return false
    }
    validateFields((err, values) => {
      if (!err) {
        const { P331 } = values
        if (P331.trim().length === 0) {
          message.error($t('m_116'))
          return false
        }
        this.submitConfig(values).then(() => { // 先下发p值 //再调下载接口
          this.putdownphbk(values)
        })
      }
    })
  }

  // 下载接口
  putdownphbk = (values) => {
    const { P1435, P1436, clearMode, replaceMode, P330, P331, P332, P1681, P6713, P6714 } = values
    values.P1435 = P1435 === 0 ? 0 : clearMode
    values.P1436 = P1436 === 0 ? 0 : replaceMode
    API.putdownphbk({
      flag: '1',
      downMode: P330 || '0',
      downUrl: P331,
      downReplace: P1436 === 0 ? '0' : replaceMode,
      downClear: P1435 === 0 ? '0' : clearMode,
      downInterval: P332 || '0',
      downType: '0',
      downEncode: P1681,
      Username: P6713,
      passWord: P6714
    }).then(msg => {
      this.phbkresponse()
    })
  }
  phbkresponse = () => {
    API.phbkresponse().then(data => {
      let { phbkresponse, max, phbkprogress } = data
      if (this.props.visible) {
        this.props.onCancel()
      }
      switch (phbkresponse) {
        case '0':
        case '1':
        case '2':
          let percent = Math.floor((Number(phbkprogress) / Number(max)).toFixed(2) * 100)
          if (phbkresponse === '0' || phbkresponse === '1') {
            percent = 0
          }
          this.setState({
            downloadPercent: percent
          })
          TIMER = setTimeout(() => this.phbkresponse(), 3000)
          break
        case '3':
          message.success($t('m_117'))
          this.setState({
            downloadPercent: -1
          })
          setTimeout(() => this.props.onDownload(), 2000)
          break
        case '4':
          let errorCode = phbkprogress
          let errorMessage = $t('m_118')
          if (errorCode === '4') {
            errorMessage = $t('m_107')
          } else if (errorCode === '15') {
            errorMessage = $t('m_115')
          } else if (errorCode === '22') {
            errorMessage = $t('m_110')
          }
          message.error(errorMessage)

          this.setState({
            downloadPercent: -1
          })
          break
        default:
      }
    })
  }

  handleUrlChange = debounceReactEvent((e) => {
    const { setFieldsValue } = this.props.form
    let text = e.target.value.trim()
    if (text.length > 4) {
      let pre = text.match(/^[^:]+:/)[0].toLowerCase()
      if (pre === 'tftp:') {
        setFieldsValue({ 'P330': '1' })
      } else if (pre === 'http:') {
        setFieldsValue({ 'P330': '2' })
      } else {
        if (pre === 'https:') {
          setFieldsValue({ 'P330': '3' })
        }
      }
    }
  }, 300)
  render () {
    const { getFieldDecorator: gfd, getFieldsValue } = this.props.form
    const { visible, onCancel } = this.props
    const { downloadPercent } = this.state
    const { P1435, P1436, P330 } = getFieldsValue()
    return (
      <>
        <Modal
          className='download-contacts-modal'
          visible={visible}
          onCancel={onCancel}
          title={$t('c_230')}
          width={800}
          footer={<div><Button type='primary' onClick={this.saveDownloadConfig}>{$t('b_001')}</Button></div>}
        >
          <Form>
            <CheckboxItem
              lang='cal_001'
              name='P1435'
              gfd={gfd}
            />
            <RadioGroupItem
              lang='cal_002'
              name='clearMode'
              gfd={gfd}
              disabled={!Number(P1435) }
              radioOptions={[
                { v: '1', t: $t('c_225') },
                { v: '2', t: $t('c_226') }
              ]}
            />
            <CheckboxItem
              lang='cal_003'
              name='P1436'
              gfd={gfd}
              gfdOptions={{
                initialValue: 0
              }}
            />
            <RadioGroupItem
              lang='cal_004'
              name='replaceMode'
              gfd={gfd}
              disabled={!Number(P1436)}
              radioOptions={[
                { v: '1', t: $t('c_227') },
                { v: '2', t: $t('c_226') }
              ]}
            />
            <RadioGroupItem
              lang='cal_007'
              name='P330'
              gfd={gfd}
              gfdOptions={{
                initialValue: '1'
              }}
              radioOptions={[
                { v: '0', t: $t('c_070') },
                { v: '1', t: 'TFTP' },
                { v: '2', t: 'HTTP' },
                { v: '3', t: 'HTTPS' }
              ]}
            />
            <SelectItem
              lang='cal_005'
              gfd={gfd}
              name='P1681'
              gfdOptions={{
                initialValue: 'UTF-8'
              }}
              selectOptions={[
                { v: 'UTF-8', t: 'UTF-8' },
                { v: 'GBK', t: 'GBK' },
                { v: 'UTF-16', t: 'UTF-16' },
                { v: 'UTF-32', t: 'UTF-32' },
                { v: 'Big5', t: 'Big5' },
                { v: 'Big5-HKSCS', t: 'Big5-HKSCS' },
                { v: 'Shift-JIS', t: 'Shift-JIS' },
                { v: 'ISO8859-1', t: 'ISO8859-1' },
                { v: 'ISO8859-15', t: 'ISO8859-15' },
                { v: 'Windows-1251', t: 'Windows-1251' },
                { v: 'EUC-KR', t: 'EUC-KR' }
              ]}
              onChange={this.handleSelectFileEncode}
            />
            <InputItem
              lang='cal_008'
              gfd={gfd}
              name='P331'
              onChange={this.handleUrlChange}
              gfdOptions={{
                rules: [
                  this.maxLen(64),
                  this.checkaddressPath()
                ]
              }}
            />
            <InputItem
              lang='cal_009'
              gfd={gfd}
              name='P6713'
              hide={P330 === '1'}
              gfdOptions={{
                rules: [
                  this.maxLen(64)
                ]
              }}
            />
            <PwInputItem
              lang='cal_010'
              gfd={gfd}
              name='P6714'
              hide={P330 === '1'}
              gfdOptions={{
                rules: [
                  this.maxLen(64)
                ]
              }}
            />
            <SelectItem
              lang='cal_011'
              gfd={gfd}
              name='P332'
              gfdOptions={{
                initialValue: '0'
              }}
              selectOptions={[
                { v: '0', t: $t('c_065') },
                { v: '120', t: '2' + $t('c_089') },
                { v: '240', t: '4' + $t('c_089') },
                { v: '360', t: '6' + $t('c_089') },
                { v: '480', t: '8' + $t('c_089') },
                { v: '720', t: '12' + $t('c_089') }
              ]}
            />
            <FormItem lang='cal_012'>
              <Button icon='download' disabled={P330 === '0'} onClick={this.handleDownload}>{$t('b_021')}</Button>
            </FormItem>
          </Form>
        </Modal>

        {/* 进度条 */}
        <Modal
          visible={downloadPercent > -1}
          footer={null}
          closable={false}
          className='progress-tip-modal'
          centered={true}
          destroyOnClose
        >
          <p className='progress-percent'>{downloadPercent} %</p>
          <p className='progress-txt'>正在下载中...</p>
          <Progress percent={downloadPercent} status='active' strokeColor='#3d77ff' showInfo={false}/>
        </Modal>
      </>
    )
  }
}

export default DownloadModal
