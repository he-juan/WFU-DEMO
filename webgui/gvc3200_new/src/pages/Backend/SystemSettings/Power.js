import React, { Fragment } from 'react'
import Cookie from 'js-cookie'
import { connect } from 'react-redux'
import { Form, Button, Modal, message, Select } from 'antd'
import FormCommon from '@/components/FormCommon'
import FormItem, { SelectItem } from '@/components/FormItem'
import { getOptions } from '@/template'
// import { history } from '@/App'
import { getLinesInfo } from '@/store/actions'
import API from '@/api'
import { $t, $fm } from '@/Intl'

@connect(
  state => ({
    linesInfo: state.linesInfo || ''
  }),
  (dispatch) => ({
    getLinesInfo: () => dispatch(getLinesInfo())
  })
)

@Form.create()
class Power extends FormCommon {
  constructor (props) {
    super(props)

    this.state = {
      modalTips: {
        Reboot: $fm('m_023'),
        Sleep: $fm('m_024'),
        Shutdown: $fm('m_025')
      },
      modal2Btns: {
        Reboot: [$fm('b_009'), $fm('b_011')],
        Sleep: [$fm('b_007'), $fm('b_012')],
        Shutdown: [$fm('b_010'), $fm('b_013')]
      },
      modalOption: 'Reboot', // 按钮点击类型 Reboot Sleep Shutdown
      modalShow: false,
      modalType: '1' // 1 未通话状态 2 通话状态
    }

    this.options = getOptions('System.Power')
  }

  // componentDidMount
  componentDidMount () {
    const { form: { setFieldsValue }, getLinesInfo } = this.props
    getLinesInfo()

    Promise.all([
      API.getTimeoutOpt(),
      API.getSleepMode(),
      API.getPvalues(['Phide_power'])
    ]).then(data => {
      let policy = data[0].policy
      let sleepmode = data[1].sleepmode
      let hidepower = data[2].Phide_power
      setFieldsValue({ policy, sleepmode, hidepower })
    })
  }

  toogleShutdown = (v) => {
    API.putPvalues({ 'Phide_power': v })
  }

  // 提交数据
  handleSubmit = () => {
    const { validateFields } = this.props.form
    validateFields((err, values) => {
      if (!err) {
        const { policy, sleepmode } = values
        Promise.all([
          API.setTimeoutOpt(policy),
          API.setSleepMode(sleepmode)
        ]).then(m => {
          if (m[0].res === 'success' && m[1].res === 'success') {
            message.success($t('m_001'))
          } else {
            message.error($t('m_002'))
          }
        })
      }
    })
  }

  // openModal
  openModal = (option, type = '1') => {
    this.setState({
      modalShow: true,
      modalOption: option,
      modalType: type
    })
  }

  // hideModal
  hideModal = () => {
    this.setState({
      modalShow: false
    })
  }

  // 设备操作 Reboot Sleep Shutdown
  handleOpration = (option) => {
    let { linesInfo } = this.props
    API.isUpgrade().then(msgs => {
      let { res, msg } = msgs
      if (res === 'success') {
        // 升级中
        if (msg === '1') {
          return message.error($t('m_026'))
        }
        // 通话中判断
        let type = linesInfo.length > 0 ? '2' : '1'
        this.openModal(option, type)
      }
    })
  }

  // 确定执行
  excuteOption = (time, calling = false) => {
    let { modalOption } = this.state
    let params = {
      Reboot: [0, 4],
      Sleep: [2, 6],
      Shutdown: [1, 5]
    }

    let value = params[modalOption]
    if (time === 'now') {
      // now的情况下 把 type 参数 存入 cookie， 需要调 ping 再跳转到指定页面执行
      Cookie.set('reboottype', calling ? value[1] : value[0], { path: '/', expires: 10 })
      // history.push('/reboot')
      window.location.href = '/reboot'
    } else if (time === 'later') {
      // later情况下 直接发请求，由于 重启操作 无法接受response，所以直接执行 操作成功
      API.sysReboot(value[0])
      message.success($t('m_027'))
      this.hideModal()
    }
  }

  // render
  render () {
    let { getFieldDecorator: gfd, getFieldValue } = this.props.form
    let { modalTips, modal2Btns, modalOption, modalShow, modalType } = this.state
    let modalFooter = null
    if (modalType === '1') {
      modalFooter = <>
        <Button type='default' onClick={() => this.excuteOption('now')}>{$t('b_002')}</Button>
        <Button type='primary' onClick={this.hideModal}>{$t('b_005')}</Button>
      </>
    } else {
      modalFooter = <>
        <Button type='default' onClick={() => { this.excuteOption('now', true) }} >{modal2Btns[modalOption][0]}</Button>
        <Button type='default' onClick={() => { this.excuteOption('later', true) }} >{modal2Btns[modalOption][1]}</Button>
        <Button type='primary' onClick={this.hideModal}>{$t('b_005')}</Button>
      </>
    }
    const options = this.options
    // console.log(options)

    return (
      <Fragment>
        <Modal
          visible={modalShow}
          onCancel={this.hideModal}
          footer={modalFooter}
        >
          <p style={{ fontSize: '16px', color: '#55627b' }}>
            { modalType === '1' ? modalTips[modalOption] : $t('m_029') }
          </p>
        </Modal>

        <Form>
          {/* 超时操作 */}
          <SelectItem
            gfd={gfd}
            {...options['policy']}
            selectOptions={[
              { v: '0', t: $t('c_006') },
              { v: '2', t: $t('c_007') }
            ]}
          />
          {/* 超时时间 */}
          <SelectItem
            gfd={gfd}
            {...options['sleepmode']}
            selectOptions={[
              { v: '-1', t: $t('c_008') },
              { v: '60000', t: $t('c_010') },
              { v: '300000', t: $t('c_011') },
              { v: '600000', t: $t('c_012') },
              { v: '900000', t: $t('c_013') },
              { v: '1800000', t: $t('c_014') },
              { v: '3600000', t: $t('c_015') }
            ]}
          />
          {/* 关机 */}
          <FormItem {...options['shutdown']}>
            {
              gfd('hidepower', {
                initialValue: '0',
                normalize: (value) => value || '0'
              })(
                <Select onChange={this.toogleShutdown} getPopupContainer={(triggerNode) => { return triggerNode }} style={{ width: '338px' }}>
                  <Select.Option value='1'>{$t('c_066')}</Select.Option>
                  <Select.Option value='0'>{$t('c_094')}</Select.Option>
                </Select>
              )
            }
            <Button
              style={{ display: getFieldValue('hidepower') === '1' ? 'none' : 'inline-block', marginLeft: 10 }}
              onClick={() => this.handleOpration('Shutdown')}
            >
              {$t('b_008')}
            </Button>
          </FormItem>
          {/* 重启设备 */}
          <FormItem {...options['reboot']}>
            <Button onClick={() => this.handleOpration('Reboot')}>{$t('b_006')}</Button>
          </FormItem>
          {/* 睡眠 */}
          <FormItem {...options['sleep']}>
            <Button onClick={() => this.handleOpration('Sleep')}>{$t('b_007')}</Button>
          </FormItem>
          <FormItem label=''>
            <Button className='sub-btn' id='subBtn' onClick={this.handleSubmit}>{$t('b_001')}</Button>
          </FormItem>
        </Form>
      </Fragment>
    )
  }
}

export default Power
