import React from 'react'
import { Form, Button, Upload, Icon, Modal, message } from 'antd'
import { getOptions } from '@/template'
import FormCommon from '@/components/FormCommon'
import FormItem, { CheckboxItem, SelectItem, InputItem, PwInputItem } from '@/components/FormItem'
import { getImportconf, getSaveConf } from '@/api/api.maintenance'
import { $t } from '@/Intl'
import { rebootNotify } from '@/utils/tools'

let CONFPATH = ''
const GAPSPATH = 'fm.grandstream.com/gs'

// antd form.create
@Form.create()
class ConfigFile extends FormCommon {
  // constructor
  constructor (props) {
    super(props)

    this.options = getOptions('Maintenance.Upgrade.ConfigFile')
    this.state = {
      isShouldHide: false
    }
    this.isShouldReboot = false
  }

  // componentDidMount
  componentDidMount () {
    const { setFieldsValue } = this.props.form
    this.initFormValue(this.options).then(data => {
      // 处理 isShouldHide
      const { P237 } = data
      CONFPATH = P237 // 存起来 以后用
      this.setState({
        isShouldHide: P237 === GAPSPATH
      })
      data['usegsgap'] = P237 === GAPSPATH ? '1' : '0'
      setFieldsValue(data)
    })
  }

  // 改变 Grandstream GAPS
  handleChangeGapsitem = (e) => {
    const { setFieldsValue } = this.props.form
    let usegsgap = e.target.checked
    this.setState({
      isShouldHide: usegsgap
    })
    setFieldsValue({
      P237: usegsgap ? GAPSPATH : CONFPATH
    })
  }

  // 获取已保存的conf
  handleDownConf = () => {
    getSaveConf().then(data => {
      if (data.Response === 'Success') {
        window.location.href = '/config.txt?time=' + new Date().getTime()
      }
    })
  }

  // 获取 getImportconf
  handleGetImportconf = () => {
    getImportconf().then(data => {
      data.Response === 'Success' && (this.isShouldReboot = true)
      Modal.info({
        title: $t('c_042'),
        content: $t(data.Response === 'Success' ? 'm_018' : 'm_019'),
        okText: $t('b_002'),
        onOk () {}
      })
    })
  }

  // 提交数据
  handleSubmit = () => {
    const { validateFields } = this.props.form
    validateFields((err, values) => {
      if (!err) {
        let custviapre = ''
        switch (values['P6775']) {
          case '0':
            custviapre = 'TFTP://'
            break
          case '1':
            custviapre = 'HTTP://'
            break
          case '2':
            custviapre = 'HTTPS://'
            break
          default:
            break
        }
        if (values['P6774'].substring(0, custviapre.length).toUpperCase() === custviapre) {
          values['P6774'] = values['P6774'].substring(custviapre.length)
        } else if (values['P6774'].indexOf('://') !== -1) {
          return message.error($t('m_065'))
        }
        values['P6774'] = values['P6774'].trim()
        delete values.usegsgap
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
    const self = this
    const { getFieldDecorator: gfd } = this.props.form
    const { isShouldHide } = this.state
    const options = this.options

    const importcfgConf = {
      name: 'file',
      showUploadList: false,
      action: '/upload?type=importcfg',
      headers: {
        authorization: 'authorization-text'
      },
      onChange (info) {
        // if (info.file.status !== 'uploading') {
        //   console.log(info.file, info.fileList);
        // }
        if (info.file.status === 'done') {
          self.handleGetImportconf()
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`)
        }
      },
      onRemove () {
        message.destroy()
      }
    }

    return (
      <Form>
        {/* 配置文件 */}
        <div className='bak-sub-title'><s></s>{$t('c_040')}</div>
        {/* 使用Grandstream GAPS */}
        <CheckboxItem
          {...options['usegsgap']}
          gfd={gfd}
          onChange={this.handleChangeGapsitem}
        />
        {/* 配置文件升级方式 */}
        <SelectItem
          gfd={gfd}
          {...options['P212']}
          hide={isShouldHide}
          selectOptions={[
            { v: '0', t: 'TFTP' },
            { v: '1', t: 'HTTP' },
            { v: '2', t: 'HTTPS' }
          ]}
        />
        {/* 配置服务器路径 */}
        <InputItem
          gfd={gfd}
          name='P237'
          {...options['P237']}
          hide={isShouldHide}
          gfdOptions={{
            rules: [
              {
                max: 256,
                message: $t('m_050') + 256
              }
            ]
          }}
        />
        {/* 配置文件HTTP/HTTPS用户名称 */}
        <InputItem
          gfd={gfd}
          gfdOptions={{
            rules: [
              {
                max: 512,
                message: $t('m_050') + 512
              }
            ]
          }}
          {...options['P1360']}
        />
        {/* 配置文件HTTP/HTTPS密码 */}
        <PwInputItem
          gfd={gfd}
          {...options['P1361']}
        />
        {/* 总是发送HTTP基本认证信息 */}
        <CheckboxItem
          gfd={gfd}
          {...options['P20713']}
        />
        {/* 配置文件前缀 */}
        <InputItem
          gfd={gfd}
          {...options['P234']}
          gfdOptions={{
            rules: [
              {
                max: 128,
                message: $t('m_050') + 128
              }
            ]
          }}
        />
        {/* 配置文件后缀 */}
        <InputItem
          gfd={gfd}
          {...options['P235']}
          gfdOptions={{
            rules: [
              {
                max: 128,
                message: $t('m_050') + 128
              }
            ]
          }}
        />
        {/* 认证配置文件 */}
        <CheckboxItem
          gfd={gfd}
          {...options['P240']}
        />
        {/* XML配置文件密码 */}
        <PwInputItem
          gfd={gfd}
          {...options['P1359']}
        />
        {/* 下载当前配置 */}
        <FormItem {...options['downConf']}>
          <Button className='button' type='primary' onClick={this.handleDownConf}>{$t('b_021')}</Button>
        </FormItem>
        {/* 上传设备配置 */}
        <FormItem {...options['importcfg']}>
          {
            <span style={{ display: 'inline-block' }}>
              <Upload {...importcfgConf}>
                <Button>
                  <Icon type='upload' />
                  {$t('b_016')}
                </Button>
              </Upload>
            </span>
          }
        </FormItem>

        {/* 自定义文件 */}
        <div className='bak-sub-title'><s></s>{$t('c_041')}</div>
        {/* GUI自定义文件下载方式 */}
        <SelectItem
          gfd={gfd}
          {...options['P6775']}
          selectOptions={[
            { v: '0', t: 'TFTP' },
            { v: '1', t: 'HTTP' },
            { v: '2', t: 'HTTPS' }
          ]}
        />
        {/* GUI自定义文件URL */}
        <InputItem
          gfd={gfd}
          {...options['P6774']}
          gfdOptions={{
            rules: [
              {
                max: 256,
                message: $t('m_050') + 256
              }
            ]
          }}
        />
        {/* GUI自定义文件HTTP/HTTPS用户名 */}
        <InputItem
          gfd={gfd}
          {...options['P6776']}
          gfdOptions={{
            rules: [
              {
                max: 32,
                message: $t('m_050') + 32
              }
            ]
          }}
        />
        {/* GUI自定义文件HTTP/HTTPS密码 */}
        <PwInputItem
          gfd={gfd}
          {...options['P6777']}
          gfdOptions={{
            rules: [
              {
                max: 128,
                message: $t('m_050') + 128
              }
            ]
          }}
        />
        {/* 使用配置文件服务器相关配置 */}
        <CheckboxItem
          gfd={gfd}
          {...options['P6778']}
        />

        <FormItem label=''>
          <Button className='sub-btn' id='subBtn' onClick={this.handleSubmit}>{$t('b_001')}</Button>
        </FormItem>
      </Form>
    )
  }
}

export default ConfigFile
