import React from 'react'
import { Form, Button, Modal } from 'antd'
import FormCommon from '@/components/FormCommon'
import FormItem from '@/components/FormItem'
import API from '@/api'
import { $t } from '@/Intl'
import { formatTime } from '@/utils/tools'

let GetremoteTimeout = null
let SetremoteInterval = null

@Form.create()
class Remotediagnosis extends FormCommon {
  state = {
    mRsshtcfgswitch: '0', // 远程诊断 开启状态
    mTime: '0' // 时间
  }

  componentDidMount () {
    this.getRemotedebug()
  }

  componentWillUnmount () {
    clearTimeout(GetremoteTimeout)
    clearInterval(SetremoteInterval)
  }

  // 获取远程诊断状态
  getRemotedebug = () => {
    API.getRemotedebug().then(msgs => {
      let { response, status, time } = msgs
      if (response === 'success') {
        this.setState({
          mRsshtcfgswitch: status || '0',
          mTime: +time || 0
        }, () => {
          if (status === '1') {
            if (+time === 0) {
              clearTimeout(GetremoteTimeout)
              GetremoteTimeout = setTimeout(() => {
                this.getRemotedebug()
              }, 1500)
            } else if (+time <= 172800) { // 小于 172800s也就是48小时
              clearTimeout(GetremoteTimeout)
              clearInterval(SetremoteInterval)
              SetremoteInterval = setInterval(() => {
                let state = {}
                if (time <= 0) {
                  state = {
                    mRsshtcfgswitch: '0',
                    mTime: 0
                  }
                  clearInterval(SetremoteInterval)
                } else {
                  time--
                  state = { mTime: time }
                }
                this.setState(state)
              }, 1000)
            }
          }
        })
      }
    })
  }

  // 切换 远程诊断的状态
  handleRemotedebug = () => {
    let { mRsshtcfgswitch } = this.state

    // 禁用状态 转为启用
    if (mRsshtcfgswitch === '0') {
      Modal.confirm({
        title: $t('m_213'),
        onOk: () => {
          API.putPvalues({ P276: '1' }, 0).then(msgs => {
            API.setRemotedebug('1').then(res => {
              this.getRemotedebug()
            })
          })
        }
      })
    } else {
      // 启用转为 禁用
      API.setRemotedebug('0').then(res => {
        this.setState({
          mRsshtcfgswitch: '0',
          mTime: 0
        })
        clearTimeout(GetremoteTimeout)
        clearInterval(SetremoteInterval)
      })
    }
  }

  render () {
    const { mRsshtcfgswitch, mTime } = this.state

    return (
      <Form>
        <FormItem lang='mai_tr_024'>
          <Button type='primary' onClick={this.handleRemotedebug}>{$t(mRsshtcfgswitch === '1' ? 'c_066' : 'c_094')}</Button>
          {
            mRsshtcfgswitch === '1' && mTime > 0 && mTime <= 172800 && <span style={{ marginLeft: 50 }}>
              {formatTime(mTime)}
            </span>
          }
        </FormItem>
      </Form>
    )
  }
}

export default Remotediagnosis
