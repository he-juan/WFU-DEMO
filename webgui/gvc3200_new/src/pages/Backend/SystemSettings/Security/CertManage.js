import React from 'react'
import { Form } from 'antd'
import moment from 'moment'
import FormCommon from '@/components/FormCommon'
import { SipCert, CustomCert } from './Certs/'
import API from '@/api'
import { $t } from '@/Intl'

@Form.create()
class CertManage extends FormCommon {
  constructor (props) {
    super(props)

    this.state = {
      veriCert: [],
      getVeriCert: this.getVeriCert,
      checkVeriCert: this.checkVeriCert,
      deleteCert: this.deleteCert,
      formatTime: this.formatTime
    }
  }

  // componentDidMount
  componentDidMount = () => {
    this.getVeriCert()
  }

  // 获取 VeriCert CA证书
  getVeriCert = () => {
    API.getVeriCert().then(data => {
      if (data.Response === 'Success') {
        this.setState({
          veriCert: data.Data
        })
      }
    })
  }

  // 检查 VeriCert CA证书
  checkVeriCert = (info, callback) => {
    API.checkVeriCert(info).then(data => {
      callback(data)
    })
  }

  // 删除 VeriCert CA证书
  deleteCert = (params, callback) => {
    API.putPvalues(params).then(data => {
      callback(data)
    })
  }

  // 格式化时间 为 YYYY-MM-DD HH:mm:ss
  formatTime = (time) => {
    return moment(time * 1000).format('YYYY-MM-DD HH:mm:ss')
  }

  // render
  render () {
    return (
      <Form>
        <div className='bak-sub-title'><s></s>{$t('sys_sec_015')}</div>
        <SipCert {...this.props} {...this.state}/>
        <div className='bak-sub-title'><s></s>{$t('sys_sec_018')}</div>
        <CustomCert {...this.props} {...this.state}/>
      </Form>
    )
  }
}

export default CertManage
