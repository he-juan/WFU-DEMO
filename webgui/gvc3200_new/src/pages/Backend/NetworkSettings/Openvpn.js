import React from 'react'
import FormCommon from '@/components/FormCommon'
import { Form, Button, Upload, Icon, Input, message, Spin } from 'antd'
import FormItem, { SelectItem, CheckboxItem, InputItem, RadioGroupItem, PwInputItem } from '@/components/FormItem'
import { getOptions } from '@/template'
import { history } from '@/App'
import API from '@/api'
import './Openvpn.less'
import { $t } from '@/Intl'

@Form.create()
class OpenVPN extends FormCommon {
  constructor (props) {
    super(props)

    this.options = getOptions('Network.OpenVPN')
    this.state = {
      delCA: false,
      delCert: false,
      delKey: false,
      loadingData: true,
      done9902: false,
      done9903: false,
      done9904: false
    }

    this.uploadConfigs = {
      name: 'file',
      multiple: false,
      showUploadList: false,
      action: '/upload?type=vericert'
    }

    this.uploadOpenVPNFiles = {
      name: 'file',
      multiple: false,
      showUploadList: false,
      action: '/upload?type=openvpnfile',
      accept: '.zip',
      onChange: (info) => {
        const { response, status } = info.file
        if (response && response.indexOf('Authentication Required') > -1) {
          history.push(`/login?redirect=${encodeURIComponent(history.location.pathname)}`)
          return false
        }
        if (status === 'done') {
          API.unzipOpenVPNFile().then(m => {
            if (m.result === 0) {
              message.success($t('m_018'))
              this.isShouldReboot = true
            }
          })
        } else if (status === 'error') {
          message.error($t('m_019'))
        }
      },
      beforeUpload: (file) => {
        return new Promise((resolve, reject) => {
          let ext = file.name.split('.').pop()
          if (!(ext && (/^(zip)$/.test(ext)))) {
            message.error($t('b_029'))
            reject(Error(''))
          } else {
            resolve(file)
          }
        })
      }
    }

    this.isShouldReboot = false
  }

  componentDidMount () {
    const { setFieldsValue } = this.props.form
    this.initFormValue(this.options).then(data => {
      setFieldsValue(data)
      this.setState({
        loadingData: false
      })
    })
    this.handleGetDelBtnState()
  }

  handleGetDelBtnState = () => {
    API.getPvalues(['P9902', 'P9903', 'P9904']).then(data => {
      const { P9902, P9903, P9904 } = data
      this.setState({
        delCA: !!P9902,
        delCert: !!P9903,
        delKey: !!P9904
      })
    })
  }

  handleDels = (p) => {
    API.putPvalues({ [p]: '' }).then(res => {
      if (res.Response === 'Success') {
        this.setState({
          [`done${p.substr(1)}`]: false
        })
        message.success($t('m_013')) // 删除成功
      } else {
        message.success($t('m_014')) // 删除失败
      }
      this.handleGetDelBtnState()
    })
  }

  handleUploads = (info, pvalue) => {
    const { response, status } = info.file
    if (response && response.indexOf('Authentication Required') > -1) {
      history.push(`/login?redirect=${encodeURIComponent(history.location.pathname)}`)
      return false
    }
    if (status === 'done') {
      API.setOpenVPNCert(pvalue).then(m => {
        if (m.Response === 'Success') {
          message.success($t('m_085'))
          this.setState({
            [`done${pvalue}`]: true
          })
          this.handleGetDelBtnState()
        }
      })
    } else if (status === 'error') {
      message.error($t('m_019'))
    }
  }

  // 提交表单
  handleSubmit = () => {
    const { validateFields } = this.props.form
    validateFields((err, values) => {
      if (!err) {
        let { P22292, P7050 } = values
        if (P22292 === '1') {
          values = {
            P22292, P7050
          }
          this.ShouldReboot = this.isShouldReboot // 把当前组件的 是否需要重启弹窗的 状态 传递出去
        }
        this.submitFormValue(values)
      }
    })
  }

  render () {
    const { getFieldDecorator: gfd, getFieldValue } = this.props.form
    const { delCA, delCert, delKey, loadingData, done9902, done9903, done9904 } = this.state
    const options = this.options
    const isSimpleMode = getFieldValue('P22292') === '0'

    return (
      <Spin spinning={loadingData} wrapperClassName='common-loading-spin'>
        <Form className='openvpn-form' hideRequiredMark>
          {/* 开启OpenVPN® */}
          <CheckboxItem
            {...options['P7050']}
            gfd={gfd}
          />
          {/* OpenVPN® 模式 */}
          <SelectItem
            {...options['P22292']}
            gfd={gfd}
            selectOptions={[
              { v: '0', t: $t('c_177') },
              { v: '1', t: $t('c_178') }
            ]}
          />
          {/* 上传OpenVPN®配置 */}
          <FormItem {...options['uploadOpenVPNFiles']} hide={isSimpleMode} >
            <Upload className='uploads-item' {...this.uploadOpenVPNFiles}>
              <Button><Icon type='upload' />{$t('b_029')}</Button>
            </Upload>
          </FormItem>
          {/* 开启OpenVPN®压缩算法 */}
          <CheckboxItem
            {...options['P8508']}
            gfd={gfd}
            hide={!isSimpleMode}
          />
          {/* OpenVPN®服务器地址 */}
          <InputItem
            {...options['P7051']}
            gfd={gfd}
            hide={!isSimpleMode}
            gfdOptions={{
              rules: [
                this.checkaddressPath()
              ]
            }}
          />
          {/* OpenVPN®端口 */}
          <InputItem
            {...options['P7052']}
            gfd={gfd}
            hide={!isSimpleMode}
            gfdOptions={{
              rules: [
                this.required(),
                this.digits(),
                this.range(0, 65535)
              ]
            }}
          />
          {/* OpenVPN®传输方式 */}
          <RadioGroupItem
            {...options['P2912']}
            gfd={gfd}
            hide={!isSimpleMode}
            radioOptions={[
              { v: '0', t: 'UDP' },
              { v: '1', t: 'TCP' }
            ]}
          />
          {/* OpenVPN® CA */}
          <FormItem {...options['delCA']} hide={!isSimpleMode}>
          <>
            <Upload className='uploads-item' {...this.uploadConfigs} accept='.crt' onChange={(info) => this.handleUploads(info, '9902')}>
              <Button type='primary'><Icon type='upload' />{$t('b_004')}</Button>
            </Upload>
            <Button disabled={done9902 ? !done9902 : !delCA} className='uploads-delete' onClick={() => this.handleDels('P9902')}>{$t('b_003')}</Button>
          </>
          </FormItem>
          {/* OpenVPN®客户证书 */}
          <FormItem {...options['delCert']} hide={!isSimpleMode}>
          <>
            <Upload className='uploads-item' {...this.uploadConfigs} accept='.crt' onChange={(info) => this.handleUploads(info, '9903')}>
              <Button type='primary'><Icon type='upload' />{$t('b_004')}</Button>
            </Upload>
            <Button disabled={done9903 ? !done9903 : !delCert} className='uploads-delete' onClick={() => this.handleDels('P9903')}>{$t('b_003')}</Button>
          </>
          </FormItem>
          {/* OpenVPN®客户端秘钥 */}
          <FormItem {...options['delKey']} hide={!isSimpleMode}>
          <>
            <Upload className='uploads-item' {...this.uploadConfigs} accept='.key' onChange={(info) => this.handleUploads(info, '9904')}>
              <Button type='primary'><Icon type='upload' />{$t('b_004')}</Button>
            </Upload>
            <Button disabled={done9904 ? !done9904 : !delKey} className='uploads-delete' onClick={() => this.handleDels('P9904')}>{$t('b_003')}</Button>
          </>
          </FormItem>
          {/* OpenVPN®加密方式 */}
          <SelectItem
            {...options['P8396']}
            gfd={gfd}
            hide={!isSimpleMode}
            selectOptions={[
              { v: '0', t: 'Blowfish' },
              { v: '1', t: 'AES-128' },
              { v: '2', t: 'AES-256' },
              { v: '3', t: 'Triple-DES' }
            ]}
          />
          {/* OpenVPN®用户名 */}
          <FormItem {...options['P8394']} hide={!isSimpleMode}>
            {
              gfd('P8394')(
                <Input autoComplete='username'/>
              )
            }
          </FormItem>
          {/* OpenVPN®密码 */}
          <PwInputItem
            {...options['P8395']}
            hide={!isSimpleMode}
            gfd={gfd}
          />
          <FormItem>
            <Button className='sub-btn' id='subBtn' onClick={this.handleSubmit}>{$t('b_001')}</Button>
          </FormItem>
        </Form>
      </Spin>
    )
  }
}

export default OpenVPN
