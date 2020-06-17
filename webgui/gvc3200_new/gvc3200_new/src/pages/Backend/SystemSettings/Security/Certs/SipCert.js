import React, { Component } from 'react'
import { Icon, Tooltip, Upload, Button, Table, Popconfirm, message } from 'antd'
import { $t } from '@/Intl'
import { parseRawText } from '@/utils/tools'
import { rebootNotify } from '@/utils/rebootNotify'
import './Certs.less'

const certpvalue = ['2386', '2486', '2586', '2686', '2786', '2886', '51686', '51786', '51886', '51986', '52086', '52186', '52286', '52386', '52486', '52586']

class SipCert extends Component {
  // constructor
  constructor (props) {
    super(props)

    this.state = {
      veriCert: [],
      maxnum: 6,
      certdata: []
    }
  }

  // 使用 getDerivedStateFromProps 代替 componentWillReceiveProps
  static getDerivedStateFromProps (nextProps, preState) {
    let { veriCert, formatTime } = nextProps
    const oldVeriCert = JSON.stringify(preState.veriCert)
    const newVeriCert = JSON.stringify(veriCert)

    if (oldVeriCert !== newVeriCert) {
      // 处理数据
      let [owner, publisher] = ['', '']
      // 去除自定义证书 8472
      let certdata = veriCert.filter(item => {
        return item.Pvalue !== '8472'
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
      return {
        maxnum: 6 - certdata.length,
        veriCert,
        certdata
      }
    }
    return null
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
        const { response, status } = info.file
        if (response !== undefined) {
          let msgs = parseRawText(response)
          if (msgs.Response === 'Error' && msgs.Message === 'Authentication Required') {
            message.error($t('m_019'))
            setTimeout(() => {
              window.location.href = `/login`
            }, 1500)
            return false
          }
        }
        // if (status !== 'uploading') {
        //   console.log(info.file, info.fileList)
        // }
        if (status === 'done') {
          if (maxnum < 1) {
            message.error($t('m_017'))
            return false
          }

          let pvalue = certpvalue.filter(v => !certdata.some(i => i.pvalue === v))[0]
          checkVeriCert({ type: 'sipCert', maxnum: maxnum, pvalue: pvalue }, (data) => {
            switch (+data) {
              case 1:
                getVeriCert()
                message.success(`${info.file.name} ` + $t('m_018'))
                // 弹重启
                rebootNotify({ immediate: true })
                break
              case 2:
                message.error($t('m_020'))
                break
              case 3:
                message.error($t('m_021'))
                break
              default:
                message.error($t('m_022'))
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
          <div>{$t('sys_sec_016')} <Tooltip title={$t('sys_sec_016_tip')}><Icon style={{ color: '#3d77ff' }} type='question-circle-o'/></Tooltip></div>
          <Upload {...certProps}>
            <Button className='upload-btn' disabled={maxnum < 1}>
              <Icon type='upload' />
              {$t('b_004')}
            </Button>
          </Upload>
          <Icon
            title={$t('m_037')}
            className='rebooticon'
            type='info-circle'
            style={{ color: '#faad14', marginLeft: 20 }}
          />
        </div>
        <div className='table-title'>{$t('sys_sec_017')}</div>
        {/* 证书表格 */}
        <Table columns={columns} dataSource={certdata} pagination={false}/>
      </div>
    )
  }
}

export default SipCert
