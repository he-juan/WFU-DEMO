import React, { Component } from 'react'
import { Button, Modal, message, Form, Progress } from 'antd'
import FormItem, { SelectItem } from '@/components/FormItem'
import API from '@/api'
import PropTypes from 'prop-types'
import { $t } from '@/Intl'

const fileTypeMap = {
  '1': '.xml',
  '2': '.vcf',
  '3': '.csv'
}

let times = 0
let TIMER = null
@Form.create()
class ExportModal extends Component {
  static propTypes = {
    visible: PropTypes.bool,
    onCancel: PropTypes.func
  }
  state = {
    exportPercent: -1
  }
  componentWillUnmount () {
    clearTimeout(TIMER)
    TIMER = null
  }
  handleExport = () => {
    const { fileEncoding, fileType } = this.props.form.getFieldsValue()
    API.putportphbk({
      flag: 0,
      opmode: 1,
      portType: fileType,
      portEncode: fileEncoding,
      portReplace: 0,
      portClear: 0
    })

    API.savephbk().then(() => {
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
          if (times < 60) {
            let percent = Math.floor((Number(phbkprogress) / Number(max)).toFixed(2) * 100)
            if (phbkresponse === '0' || phbkresponse === '1') {
              percent = 0
            }
            this.setState({
              exportPercent: percent
            })
            TIMER = setTimeout(() => this.phbkresponse(), 3000)
            times++
          } else {
            this.setState({
              exportPercent: -1
            })
            times = 0
            message.error($t('m_113'))
          }
          break
        case '3':
          const { fileType } = this.props.form.getFieldsValue()
          window.location.href = `/phonebook/phonebook${fileTypeMap[fileType]}?time=${new Date().getTime()}`
          message.success($t('m_112'))
          this.setState({
            exportPercent: -1
          })
          break
        case '4':
          let errorCode = phbkprogress
          let errorMessage = $t('m_113')
          if (errorCode === '3') {
            errorMessage = $t('m_114')
          } else {
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
  render () {
    const { onCancel, visible } = this.props
    const { getFieldDecorator: gfd } = this.props.form
    const { exportPercent } = this.state
    return (
      <>
        <Modal
          onCancel={onCancel}
          visible={visible}
          width={700}
          className='export-contacts-modal'
          footer={null}
          title={$t('c_229')}
        >
          <Form>
            <SelectItem
              lang='cal_005'
              gfd={gfd}
              name='fileEncoding'
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
            />
            <SelectItem
              lang='cal_006'
              name='fileType'
              gfd={gfd}
              gfdOptions={{
                initialValue: '1'
              }}
              selectOptions={[
                { v: '1', t: 'XML' },
                { v: '2', t: 'VCard' },
                { v: '3', t: 'CSV' }
              ]}
            />
            <FormItem>
              <Button icon='download' onClick={this.handleExport}>{$t('b_046')}</Button>
            </FormItem>
          </Form>
        </Modal>

        {/* 进度条 */}
        <Modal
          visible={exportPercent > -1}
          footer={null}
          closable={false}
          className='progress-tip-modal'
          centered={true}
          destroyOnClose
        >
          <p className='progress-percent'>{exportPercent} %</p>
          <p className='progress-txt'>{$t('m_111')}</p>
          <Progress percent={exportPercent} status='active' strokeColor='#3d77ff' showInfo={false}/>
        </Modal>
      </>
    )
  }
}

export default ExportModal
