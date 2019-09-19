import React, { Component } from 'react'
import { Icon, Tooltip, Upload, Button, Table, Popconfirm, message } from 'antd'
import { $t } from '@/Intl'
import './Certs.less'

const customcertpvalue = '8472'
export class CustomCert extends Component {
  // constructor
  constructor (props) {
    super(props)

    this.state = {
      maxnum: 1, // 目前最多上传一份
      certdata: []
    }
  }

  // componentWillReceiveProps
  componentWillReceiveProps (newProps) {
    let { veriCert, formatTime } = newProps

    // 处理数据
    let [owner, publisher] = ['', '']
    // 匹配 8472
    let certdata = veriCert.filter(item => {
      return item.Pvalue === customcertpvalue
    }).map((el, index) => {
      for (let j = 0; j < el.Info.length; j++) {
        let curcert = el.Info[j]
        let identity = curcert.substring(curcert.length - 4, curcert.length)
        if (identity === '(13)') owner = curcert.substring(0, curcert.length - 4)
        if (identity === '(17)') publisher = curcert.substring(0, curcert.length - 4)
      }
      return {
        key: index++,
        certorder: index++,
        issuedto: owner,
        issuedby: publisher,
        validate: formatTime(el.Validtime),
        pvalue: el.Pvalue
      }
    })
    this.setState({
      maxnum: 1 - certdata.length,
      certdata
    })
  }

  // 删除证书
  deleteCert = (nvram) => {
    const { getVeriCert, deleteCert } = this.props
    let params = {}
    params[nvram] = ''
    deleteCert(params, (msgs) => {
      if (msgs.Response === 'Success') {
        message.success($t('m_013'))
        getVeriCert()
      } else {
        console.error(msgs)
        message.error($t('m_014'))
      }
    })
  }

  // render
  render () {
    const { getVeriCert, checkVeriCert } = this.props
    const { maxnum, certdata } = this.state
    // 上传config
    const certProps = {
      name: 'file',
      multiple: false, // support upload multiple files or not
      showUploadList: false, // show upload list or not
      action: '/upload?type=vericert',
      accept: '.pem, .crt, .cer, .der',
      onChange (info) {
        const { status } = info.file
        // if (status !== 'uploading') {
        //   console.log(info.file, info.fileList)
        // }
        if (status === 'done') {
          if (maxnum < 1) {
            message.error($t('m_017'))
            return false
          }

          checkVeriCert({ type: 'customCert', pvalue: customcertpvalue }, (data) => {
            switch (+data) {
              case 1:
                getVeriCert()
                message.success(`${info.file.name} ` + $t('m_018'))
                break
              case 2:
              default:
                message.error($t('m_022'))
                break
            }
          })
        } else if (status === 'error') {
          message.error(`${info.file.name} ` + $t('m_019'))
        }
      }
    }

    // columns
    const columns = [{
      title: $t('c_001'),
      dataIndex: 'certorder',
      key: 'certorder'
    },
    {
      title: $t('c_002'),
      dataIndex: 'issuedto',
      key: 'issuedto'
    },
    {
      title: $t('c_003'),
      dataIndex: 'issuedby',
      key: 'issuedby'
    },
    {
      title: $t('c_004'),
      key: 'validate',
      dataIndex: 'validate'
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
            onConfirm={() => this.deleteCert(`P${text.pvalue}`)}>
            <span className='icons icon-delete' />
          </Popconfirm>
        </span>
      )
    }]

    return (
      <div className='certs-block'>
        <div className='upload-block'>
          <div>{$t('sys_sec_019')} <Tooltip title={$t('sys_sec_019_tip')}><Icon style={{ color: '#3d77ff' }} type='question-circle-o'/></Tooltip></div>
          <Upload {...certProps}>
            <Button className='upload-btn' disabled={maxnum < 1}>
              <Icon type='upload' />
              {$t('b_004')}
            </Button>
          </Upload>
        </div>
        <div className='table-title'>{$t('sys_sec_018')}</div>
        {/* 证书表格 */}
        <Table columns={columns} dataSource={certdata} pagination={false}/>
      </div>
    )
  }
}

export default CustomCert
