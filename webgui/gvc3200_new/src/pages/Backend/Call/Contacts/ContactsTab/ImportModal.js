import React, { Component } from 'react'
import { Button, Modal, message, Form, Upload, Progress } from 'antd'
import FormItem, { CheckboxItem, RadioGroupItem, SelectItem } from '@/components/FormItem'
import { history } from '@/App'
import PropTypes from 'prop-types'
import API from '@/api'
import { $t } from '@/Intl'

const fileTypeMap = {
  '1': '.xml',
  '2': '.vcf',
  '3': '.csv'
}

let TIMER = null

@Form.create()
class ImportModal extends Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    onCancel: PropTypes.func,
    contactsLength: PropTypes.number, // 当前联系人数量
    maxContactsCount: PropTypes.number,
    onImport: PropTypes.func
  }
  state = {
    importPercent: -1,
    isClearList: false,
    isReplaceItems: false,
    fileEncoding: 'UTF-8',
    fileType: '1'
  }
  componentWillUnmount () {
    clearTimeout(TIMER)
    TIMER = null
  }
  toggleClearList = (e) => {
    this.setState({
      isClearList: e.target.checked
    })
  }
  toggleReplaceItems = (e) => {
    this.setState({
      isReplaceItems: e.target.checked
    })
  }
  handleSelectFileEncode = (v) => {
    this.setState({
      fileEncoding: v
    })
  }
  handleSelectFileType = (v) => {
    this.setState({
      fileType: v
    })
  }

  uploadConfig = () => {
    const { fileType } = this.state
    const { contactsLength, maxContactsCount } = this.props
    const _this = this
    return {
      name: 'file',
      showUploadList: false,
      action: '/upload?type=phonebook&t=' + fileType,
      accept: fileTypeMap[fileType],
      beforeUpload: (file) => {
        if (contactsLength >= maxContactsCount) {
          message.error($t('m_109') + maxContactsCount)
          return false
        }
        return Promise.resolve(file)
      },
      onChange: (info) => {
        const { response, status } = info.file
        if (response && response.indexOf('Authentication Required') > -1) {
          history.push(`/login?redirect=${encodeURIComponent(history.location.pathname)}`)
          return false
        }
        if (status === 'uploading') {

        }
        if (status === 'done') {
          _this.handleUploadDone()
        } else if (status === 'error') {
          message.error($t('m_019'))
        }
      }

    }
  }
  handleUploadDone = () => {
    const { getFieldsValue } = this.props.form
    const { clearList, clearMode, replaceItems, replaceMode, fileEncoding, fileType } = getFieldsValue()
    API.putportphbk({
      flag: 1,
      opmode: 0,
      portType: fileType,
      portEncode: fileEncoding,
      portReplace: replaceItems ? replaceMode : '0',
      portClear: clearList ? clearMode : '0'
    }).then(msg => {
      if (msg.res === 'success') {
        this.phbkresponse()
      }
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
          if (phbkresponse === '0' || phbkresponse === '1') { // sb接口
            percent = 0
          }
          this.setState({
            importPercent: percent
          })
          TIMER = setTimeout(() => this.phbkresponse(), 1500)
          break
        case '3':
          message.success($t('m_105'))
          this.setState({
            importPercent: -1
          })
          setTimeout(() => this.props.onImport(), 2000)
          break
        case '4':
          let errorCode = parseInt(phbkprogress)
          let errorMessage = $t('m_106')
          if (errorCode === 4) errorMessage = $t('m_107')
          if (errorCode === 12) errorMessage = $t('m_108')
          if (errorCode === 13) errorMessage = $t('m_109') + this.props.maxContactsCount
          if (errorCode === 22) errorMessage = $t('m_110')
          message.error(errorMessage)
          this.setState({
            importPercent: -1
          })
          break
        default:
      }
    })
  }

  render () {
    const { getFieldDecorator: gfd } = this.props.form
    const { visible, onCancel } = this.props
    const { isClearList, isReplaceItems, importPercent } = this.state
    return (
      <>
        <Modal
          visible={visible}
          onCancel={onCancel}
          width={800}
          className='import-contacts-modal'
          footer={null}
          title={$t('c_224')}
        >
          <Form>
            {/* 清除旧列表 */}
            <CheckboxItem
              lang='cal_001'
              gfd={gfd}
              name='clearList'
              onChange={this.toggleClearList}
              gfdOptions={{
                initialValue: 0
              }}
            />
            {/* 清除旧记录模式 */}
            <RadioGroupItem
              lang='cal_002'
              gfd={gfd}
              name='clearMode'
              disabled={!isClearList}
              gfdOptions={{
                initialValue: '1'
              }}
              radioOptions={[
                { v: '1', t: $t('c_225') },
                { v: '2', t: $t('c_226') }
              ]}
            />
            {/* 替换重复的条目 */}
            <CheckboxItem
              lang='cal_003'
              gfd={gfd}
              name='replaceItems'
              onChange={this.toggleReplaceItems}
              gfdOptions={{
                initialValue: 0
              }}
            />
            {/* 替换重复条目模式 */}
            <RadioGroupItem
              lang='cal_004'
              gfd={gfd}
              name='replaceMode'
              disabled={!isReplaceItems}
              gfdOptions={{
                initialValue: '1'
              }}
              radioOptions={[
                { v: '1', t: $t('c_227') },
                { v: '2', t: $t('c_228') }
              ]}
            />
            {/* 文件编码 */}
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
              onChange={this.handleSelectFileEncode}
            />
            {/* 文件类型 */}
            <SelectItem
              lang='cal_006'
              gfd={gfd}
              name='fileType'
              gfdOptions={{
                initialValue: '1'
              }}
              selectOptions={[
                { v: '1', t: 'XML' },
                { v: '2', t: 'VCard' },
                { v: '3', t: 'CSV' }
              ]}
              onChange={this.handleSelectFileType}
            />
          </Form>
          <FormItem label=''>
            <Upload {...this.uploadConfig()}>
              <Button icon='upload'>{$t('b_045')}</Button>
            </Upload>
          </FormItem>
        </Modal>

        {/* 进度条 */}
        <Modal
          visible={importPercent > -1}
          footer={null}
          closable={false}
          className='progress-tip-modal'
          centered={true}
          destroyOnClose
        >
          <p className='progress-percent'>{importPercent} %</p>
          <p className='progress-txt'>{$t('m_104')}</p>
          <Progress percent={importPercent} status='active' strokeColor='#3d77ff' showInfo={false}/>
        </Modal>
      </>
    )
  }
}

export default ImportModal
