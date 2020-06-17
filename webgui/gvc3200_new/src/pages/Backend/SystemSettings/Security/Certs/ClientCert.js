import React, { Component } from 'react'
import { Form, Modal, Icon, Upload, Button, Table, Popconfirm, message, Tooltip } from 'antd'
import FormCommon from '@/components/FormCommon'
import FormItem, { SelectItem, InputItem, PwInputItem } from '@/components/FormItem'
import { $t } from '@/Intl'
import { getVpnCerts, getWifiCerts, deleteUserCert, uploadAndInstallCert, installCert } from '@/api/api.system'
import './Certs.less'

@Form.create()
class AddCertForm extends FormCommon {
  constructor (props) {
    super(props)

    this.state = {
      randomKey: Math.random(),
      loading: false,
      pwdvisible: false,
      selbtndisable: false,
      fileList: []
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (!prevProps.reset && this.props.reset) {
      this.props.form.resetFields()
      this.setState({
        type: 'password',
        pwdvisible: false,
        selbtndisable: false,
        fileList: []
      })
    }
  }

  handleUploadAndInstall = () => {
    const { setModalVisible, form: { validateFields } } = this.props
    const { fileList } = this.state
    validateFields((err, values) => {
      if (!err) {
        let file = fileList[0]
        const filetype = file.name.substring(file.name.length - 3, file.name.length)
        values['ext'] = filetype
        const formData = new FormData()
        formData.append('files[]', file)
        // 上传并提交
        uploadAndInstallCert(formData).then(msgs => {
          const { Response, Message } = msgs
          if (Response === 'Success' && Message === 'Upload Done') {
            // 上传证书
            installCert(values).then(data => {
              if (data.res === 'success') {
                this.setState({
                  loading: true
                })
                setTimeout(() => {
                  this.setState({ loading: false }, () => {
                    setModalVisible(false, 'init')
                    const modal = Modal.info({
                      title: $t('m_305'),
                      content: $t('m_306'),
                      okText: $t('b_002')
                    })
                    setTimeout(() => modal.destroy(), 3000)
                  })
                }, 1500)
              } else {
                const modal = Modal.error({
                  title: $t('m_304'),
                  okText: $t('b_002')
                })
                setTimeout(() => modal.destroy(), 3000)
                setModalVisible(false)
              }
            })
          }
        })
      }
    })
  }

  render () {
    const { reset, setModalVisible, form: { getFieldDecorator: gfd } } = this.props
    let { randomKey, loading, selbtndisable, pwdvisible } = this.state

    const cilentCertProps = {
      name: 'file',
      multiple: false, // support upload multiple files or not
      showUploadList: true, // show upload list or not
      action: '../upload?type=vericert',
      accept: '.crt, .cer, .pem, .p12, .pfx',
      beforeUpload: (file) => {
        const filetype = file.name.substring(file.name.length - 3, file.name.length)
        if (filetype === 'p12' || filetype === 'pfx') {
          this.setState({ pwdvisible: true })
        }
        this.setState(({ fileList }) => ({
          fileList: [...fileList, file],
          selbtndisable: true,
          randomKey: Math.random()
        }))
        return false
      },
      onRemove: (file) => {
        this.setState({
          fileList: [],
          selbtndisable: false,
          pwdvisible: false
        })
      },
      fileList: this.state.fileList
    }

    return (
      <Modal
        title={$t('c_517')}
        visible={reset}
        onOk={this.handleUploadAndInstall}
        onCancel={() => setModalVisible(false)}
        okText={$t('b_100')}
        cancelText={$t('b_005')}
        confirmLoading={loading}
        className='addCertForm'
        width='600px'
      >
        <Form hideRequiredMark>
          {/* 证书用途 */}
          <SelectItem
            label='c_516'
            gfd={gfd}
            name='certuse'
            gfdOptions={{
              initialValue: '0'
            }}
            selectOptions={[
              { v: '1', t: 'Wi-Fi' },
              { v: '0', t: $t('c_518') }
            ]}
          />
          {/* 选择证书 */}
          <FormItem label='c_520'>
            <Upload {...cilentCertProps} key={randomKey}>
              <Button disabled={selbtndisable} style={{ width: 100 }}>{$t('b_101')}</Button>
            </Upload>
          </FormItem>
          {/* 证书名称 */}
          <InputItem
            label='c_515'
            gfd={gfd}
            name='certname'
            gfdOptions={{
              rules: [
                this.required()
              ]
            }}
          />
          {/* 密码 */}
          <PwInputItem
            label='c_519'
            gfd={gfd}
            name='certpwd'
            hide={!pwdvisible}
            gfdOptions={{
              rules: [
                this.required()
              ]
            }}
          />
        </Form>
      </Modal>
    )
  }
}

class ClientCert extends Component {
  state = {
    reset: false,
    certdata: []
  }

  componentDidMount = () => {
    this.handleGetCertData()
  }

  setModalVisible = (bool = false, key = '') => {
    this.setState({
      reset: bool
    })
    if (key === 'init') this.handleGetCertData()
  }

  handleGetCertData = () => {
    let certdata = []
    getVpnCerts().then(vpncerts => {
      if (vpncerts.res === 'success') {
        vpncerts.list.forEach((item, i) => {
          certdata.push({
            certorder: parseInt(i) + 1,
            certname: item,
            certuse: $t('c_518')
          })
        })
        // getWifiCerts
        getWifiCerts().then(wificerts => {
          if (wificerts.res === 'success') {
            let initorder = certdata.length + 1
            wificerts.list.forEach((item, i) => {
              certdata.push({
                certorder: parseInt(i) + initorder,
                certname: item,
                certuse: 'Wi-Fi'
              })
            })
          }
          this.setState({ certdata })
        })
      }
    })
  }

  // 删除证书
  deleteCert = ({ certname, certuse }) => {
    let use = certname === 'Wi-Fi' ? '1' : '0'
    deleteUserCert(certname, use).then(msgs => {
      if (msgs.res === 'success') {
        this.handleGetCertData()
        message.success($t('m_013'))
      } else {
        message.error($t('m_014'))
      }
    })
  }

  render () {
    const { reset, certdata } = this.state
    // columns
    const columns = [{
      title: $t('c_001'),
      dataIndex: 'certorder',
      key: 'certorder'
    },
    {
      title: $t('c_515'),
      dataIndex: 'certname',
      key: 'certname'
    },
    {
      title: $t('c_516'),
      dataIndex: 'certuse',
      key: 'certuse'
    },
    {
      title: $t('c_005'),
      key: 'delete',
      render: (text, record) => (
        <span>
          <Popconfirm
            placement='top'
            title={$t('m_016')}
            okText={$t('b_002')}
            cancelText={$t('b_005')}
            onConfirm={() => this.deleteCert(text)}>
            <span className='icons icon-delete' />
          </Popconfirm>
        </span>
      )
    }]

    return (
      <div className='certs-block'>
        <div className='upload-block'>
          <div>{$t('sys_sec_022')} <Tooltip title={$t('sys_sec_022_tip')}><Icon style={{ color: '#3d77ff' }} type='question-circle-o'/></Tooltip></div>
          <Button className='upload-btn' onClick={() => this.setModalVisible(true)}>
            <Icon type='upload' />{$t('b_004')}
          </Button>
        </div>
        <div className='table-title'>{$t('c_191')}</div>
        {/* 证书表格 */}
        <Table rowKey='certorder' columns={columns} dataSource={certdata} pagination={false}/>
        {/* 添加证书弹窗 */}
        <AddCertForm reset={reset} setModalVisible={this.setModalVisible}/>
      </div>
    )
  }
}

export default ClientCert
