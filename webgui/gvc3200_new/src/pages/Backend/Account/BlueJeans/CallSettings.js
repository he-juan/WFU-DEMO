import React from 'react'
import { Form, Button, Icon, Upload, Modal, message } from 'antd'
import FormCommon from '@/components/FormCommon'
import { getOptions } from '@/template'
import FormItem, { CheckboxItem, SelectItem } from '@/components/FormItem'
import { connect } from 'react-redux'
import { history } from '@/App'
import API from '@/api'
import { $t } from '@/Intl'
import { setWholeLoading } from '@/store/actions'

@connect(
  state => ({}),
  dispatch => ({
    setWholeLoading: (isLoad, tip) => dispatch(setWholeLoading(isLoad, tip))
  })
)
@Form.create()
class CallSettings extends FormCommon {
  constructor (props) {
    super(props)

    this.options = getOptions('Account.BlueJeans.Call')
  }
  componentDidMount () {
    const { setFieldsValue } = this.props.form
    // 表单初始化
    this.initFormValue(this.options).then(data => {
      setFieldsValue(data)
    })
  }

  // 提交表单
  handleSubmit = () => {
    const { validateFields } = this.props.form
    validateFields((err, values) => {
      if (!err) {
        this.submitFormValue(values, 1)
      }
    })
  }

  render () {
    const { getFieldDecorator: gfd } = this.props.form
    const options = this.options

    const _this = this
    // 上传MOH
    const MOHUploadProps = {
      name: 'file',
      showUploadList: false,
      action: '/upload?type=audiofile&acct=3',
      accept: '.wav,.mp3',
      onChange (info) {
        if (info.file.response && info.file.response.indexOf('Authentication Required') > -1) {
          history.push(`/login?redirect=${encodeURIComponent(history.location.pathname)}`)
          return false
        }
        if (info.file.status === 'uploading') {
          _this.props.setWholeLoading(true, $t('m_062'))
        }
        if (info.file.status === 'done') {
          _this.props.setWholeLoading(false, '')
          let fileext = info.file.name.split('.').pop()
          API.converaudio(fileext, 3).then((m) => {
            _this.props.setWholeLoading(false, '')
            Modal.info({
              title: m.Response === 'Success' ? $t('m_085') : $t('m_019'),
              okText: $t('b_002'),
              onOk () {}
            })
          })
        } else if (info.file.status === 'error') {
          message.error($t('m_019'))
        }
      },
      beforeUpload: (file) => {
        return new Promise((resolve, reject) => {
          let ext = file.name.split('.').pop()
          if (!(ext && (/^(wav)$/.test(ext) || /^(mp3)$/.test(ext)))) {
            Modal.info({
              title: $t('m_086'),
              okText: $t('b_002'),
              onOk () {}
            })
            reject(Error(''))
          } else {
            resolve(file)
          }
        })
      }
    }
    return (
      <Form>
        {/* 呼叫日志 */}
        <SelectItem
          {...options['P542']}
          gfd={gfd}
          selectOptions={[
            { v: '0', t: $t('c_128') },
            { v: '1', t: $t('c_130') }
          ]}
        />
        {/* #键拨号 */}
        <CheckboxItem
          {...options['P592']}
          gfd={gfd}
        />
        {/* 上传本地MOH音频文件 */}
        <FormItem {...options['MOHUploadProps']}>
          <Upload {...MOHUploadProps}>
            <Button>
              <Icon type='upload' /> {$t('b_016')}
            </Button>
          </Upload>
        </FormItem>
        {/* 开启本地MOH功能 */}
        <CheckboxItem
          {...options['P2557']}
          gfd={gfd}
        />
        {/* 常用布局模式 */}
        <SelectItem
          {...options['P29270']}
          gfd={gfd}
          selectOptions={[
            { v: '0', t: $t('c_120') },
            { v: '1', t: $t('c_121') },
            { v: '2', t: $t('c_122') },
            { v: '3', t: $t('c_123') }
          ]}
        />
        <FormItem>
          <Button className='sub-btn' onClick={this.handleSubmit} id='subBtn'>{$t('b_001')}</Button>
        </FormItem>
      </Form>
    )
  }
}

export default CallSettings
