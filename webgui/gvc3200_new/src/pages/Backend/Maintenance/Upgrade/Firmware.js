/*******
 * 暂未添加升级websocket 返回
 *
 */
import React from 'react'
import { Form, Button, Upload, Icon, message } from 'antd'
import FormCommon from '@/components/FormCommon'
import FormItem, { CheckboxItem, SelectItem, InputItem, PwInputItem } from '@/components/FormItem'
import { getOptions } from '@/template'
import { setWholeLoading } from '@/store/actions'
import { history } from '@/App'
import { connect } from 'react-redux'
import API from '@/api'
import { $t } from '@/Intl'
import { rebootNotify } from '@/utils/tools'

function errorMsg (r) {
  const uploadErrMsgMap = {
    '1': $t('m_051'),
    '2': $t('m_052'),
    '3': $t('m_053'),
    '4': $t('m_054'),
    '5': $t('m_055'),
    '6': $t('m_056'),
    '7': $t('m_057'),
    '8': $t('m_058'),
    '9': $t('m_059'),
    '10': $t('m_060'),
    '15': $t('m_061')
  }
  return uploadErrMsgMap[r] || $t('m_061')
}

@connect(
  () => ({}),
  (dispatch) => ({
    setWholeLoading: (isLoad, tip) => dispatch(setWholeLoading(isLoad, tip))
  })
)
@Form.create()
class Firmware extends FormCommon {
  constructor () {
    super()
    this.options = getOptions('Maintenance.Upgrade.Firmware')
    this.isShouldReboot = false
    this.state = {
      fileList: []
    }

    const _this = this
    this.uploadFirmwareConfig = {
      name: 'file',
      showUploadList: false,
      action: '/upload?type=upgradefile',
      accept: '.bin', // 只支持 .bin 格式文件
      onChange (info) {
        const { response, status, percent } = info.file
        let fileList = info.fileList.slice(-1) // 最后一个

        if (response && response.indexOf('Authentication Required') > -1) {
          history.push(`/login?redirect=${encodeURIComponent(history.location.pathname)}`)
          return false
        }
        // 上传中
        if (status === 'uploading') {
          _this.props.setWholeLoading(true, percent < 100 ? $t('m_062') + `(${percent.toFixed(2)}%)` : $t('m_063'))
        }
        // 上传完成
        if (status === 'done') {
          _this.props.setWholeLoading(false, '')
          let upgradeall = _this.props.form.getFieldValue('Pupgradeall')
          if (response.indexOf('Response=Success') !== -1) {
            API.upgradeNow().then(m => {
              _this.handleUploadComplete(m, upgradeall)
            })
          } else if (response.indexOf('Message=Not enough space') !== -1) {
            message.error($t('m_019') + ' ' + $t('m_060'))
          } else {
            message.error($t('m_019'))
          }
        }
        // 上传失败
        if (status === 'error') {
          _this.props.setWholeLoading(false, '')
          if (+info.file.error.status === 413) {
            message.error($t('m_019') + ' ' + $t('m_060'))
          } else {
            message.error($t('m_019'))
          }
        }
        _this.setState({ fileList: [...fileList] })
      },

      beforeUpload (file) {
        let fileName = file.name
        let dotLastIndex = fileName.lastIndexOf('.')
        if (fileName.substr(dotLastIndex + 1).toLocaleLowerCase() !== 'bin') {
          message.error($t('m_130'))
          return false
        }

        // 固件上传前指定是否完全升级
        return new Promise((resolve, reject) => {
          let upgradeall = _this.props.form.getFieldValue('Pupgradeall')
          API.provisionInit(upgradeall).then(m => {
            if (m === '0') {
              message.error($t('m_064'))
              reject(Error('err'))
            } else {
              resolve(file)
            }
          })
        })
      }

    }
  }

  handleUploadComplete = (m, upgradeall) => {
    let result = m.result
    if (upgradeall && m.Response !== 'Success') {
      result = result !== '2' ? '3' : '2'
    }
    let msg = errorMsg(result)
    if (result !== '0') {
      message.error(msg)
    } else {
      this.isShouldReboot = true
    }
  }

  componentDidMount () {
    API.initupstatus()
    const { setFieldsValue } = this.props.form
    this.initFormValue(this.options).then(data => {
      setFieldsValue(data)
    })
  }

  handleSubmit = () => {
    const { validateFields } = this.props.form
    validateFields((err, values) => {
      if (!err) {
        const { P6767, P192 } = values
        // 判断是否是固件升级方式的协议头
        let arr = ['TFTP://', 'HTTP://', 'HTTPS://']
        if (P192.substring(0, arr[+P6767].length).toUpperCase() === arr[+P6767]) {
          values.P192 = P192.substring(arr[+P6767].length).trim()
        } else if (P192.indexOf('://') !== -1) {
          return message.error($t('m_207'))
        }

        this.submitFormValue(values).then(msgs => {
          if (msgs.Response === 'Success') {
            // 判断是否 弹出 重启提示弹窗
            rebootNotify({ immediate: this.isShouldReboot }, () => {
              this.isShouldReboot = false
            })
          }
        })
      }
    })
  }
  render () {
    const { getFieldDecorator: gfd } = this.props.form
    const options = this.options

    return (
      <Form>
        {/* 完全升级 */}
        <CheckboxItem
          {...options['Pupgradeall']}
          gfd={gfd}
        />
        {/* 上传固件文件更新 */}
        <FormItem {...options['upgradefile']}>
          <Upload className='upload-btn' {...this.uploadFirmwareConfig} fileList={this.state.fileList}>
            <Button>
              <Icon type='upload' /> {$t('b_004')}
            </Button>
          </Upload>
        </FormItem>
        {/* 固件升级方式 */}
        <SelectItem
          gfd={gfd}
          {...options['P6767']}
          selectOptions={[
            { v: '0', t: 'TFTP' },
            { v: '1', t: 'HTTP' },
            { v: '2', t: 'HTTPS' }
          ]}
        />
        {/* 固件服务器路径 */}
        <InputItem
          gfd={gfd}
          {...options['P192']}
          gfdOptions={{
            rules: [
              this.maxLen(256)
            ]
          }}
        />
        {/* HTTP/HTTPS用户名称 */}
        <InputItem
          gfd={gfd}
          gfdOptions={{
            rules: [
              this.maxLen(512)
            ]
          }}
          {...options['P6768']}
        />
        {/* HTTP/HTTPS密码 */}
        <PwInputItem
          gfd={gfd}
          {...options['P6769']}
        />
        {/* 固件文件前缀 */}
        <InputItem
          gfd={gfd}
          {...options['P232']}
          gfdOptions={{
            rules: [
              this.maxLen(128)
            ]
          }}
        />
        {/* 固件文件后缀 */}
        <InputItem
          gfd={gfd}
          {...options['P233']}
          gfdOptions={{
            rules: [
              this.maxLen(128)
            ]
          }}
        />
        <FormItem>
          <Button className='sub-btn' id='subBtn' onClick={this.handleSubmit}>{$t('b_001')}</Button>
        </FormItem>
      </Form>
    )
  }
}

export default Firmware
