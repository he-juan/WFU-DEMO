import React from 'react'
import { Form, Button, Spin } from 'antd'
import FormCommon from '@/components/FormCommon'
import { getOptions } from '@/template'
import FormItem, { PwInputItem, SelectItem, InputItem } from '@/components/FormItem'
import { $t, $fm } from '@/Intl'
import API from '@/api'
import './XSIServiceSet.less'
import { connect } from 'react-redux'

class BroadSoftDirOrder extends React.Component {
  state = {
    selected: -1
  }

  valueMap = {
    '0': $fm('c_452'), // 个人目录
    '1': $fm('c_453'), // 群组常用
    '2': $fm('c_454'), // 群组目录
    '3': $fm('c_455'), // 企业常用
    '4': $fm('c_456') // 企业目录
    // '5': $fm('c_457') // Polycom电话簿BroadSoft
  }

  // 排序 value eg. 0,1,2,3,4,5
  sortBy = (value = '') => {
    value = value.split(',')
    let result = value.map(v => {
      if (this.valueMap[v]) {
        return { v: v, t: this.valueMap[v] }
      } else {
        return null
      }
    }).filter(i => !!i)
    return result
  }

  selectItem = (i) => {
    this.setState({
      selected: this.state.selected === i ? -1 : i
    })
  }

  moveUp = () => {
    const { value } = this.props
    const { selected } = this.state
    let _value = value.split(',')
    if (selected === 0 || selected === -1) { return false }
    [_value[selected], _value[selected - 1]] = [_value[selected - 1], _value[selected]]
    this.props.onChange(_value.join(','))
    this.setState({
      selected: selected - 1
    })
  }

  moveDown = () => {
    const { value } = this.props
    const { selected } = this.state
    let _value = value.split(',')
    if (selected === _value.length - 1 || selected === -1) { return false }
    [_value[selected], _value[selected + 1]] = [_value[selected + 1], _value[selected]]
    this.props.onChange(_value.join(','))
    this.setState({
      selected: selected + 1
    })
  }

  render () {
    const { ref, value } = this.props
    const { selected } = this.state
    const options = this.sortBy(value)
    return (
      <div ref={ref} className='broadsoft-dir-order'>
        <ul className='order-list'>
          {
            options.map((item, i) => (
              <li
                key={item.v}
                className={i === selected ? 'active' : ''}
                onClick={() => this.selectItem(i)}
              >
                {item.t}
              </li>
            ))
          }
        </ul>
        <div className='order-btns'>
          <Button icon='up-square-o' onClick={() => this.moveUp()}>{$t('b_063')}</Button>
          <Button icon='down-square-o' onClick={() => this.moveDown()}>{$t('b_064')}</Button>
        </div>
      </div>
    )
  }
}

@connect(
  state => ({
    maxacctnum: state.maxacctnum
  })
)
@Form.create()
class XSIServiceSet extends FormCommon {
  state = {
    loaded: false
  }

  options = getOptions('App.BroadSoftDir.XSIService')

  componentDidMount () {
    const { setFieldsValue } = this.props.form
    this.initFormValue(this.options).then(data => {
      data.Pbs_contacts_order = data.Pbs_contacts_order || '0,1,2,3,4'
      setFieldsValue(data)
      this.setState({
        loaded: true
      })
    })
    API.readConfig().then(data => {
      setFieldsValue({
        bsinterval: data.bsinterval
      })
    })
  }

  handleSubmit = () => {
    const { validateFields } = this.props.form

    validateFields((err, values) => {
      if (err) return false
      const { bsinterval, ...others } = values
      this.submitFormValue(others)
      API.setBsInterval(bsinterval).then(() => {
        API.noticeBroadsoft()
      })
    })
  }

  render () {
    const options = this.options
    const { getFieldDecorator: gfd, getFieldValue } = this.props.form
    const P22054 = getFieldValue('P22054')
    return (
      <Spin wrapperClassName='common-loading-spin' spinning={!this.state.loaded}>
        <Form hideRequiredMark>
          {/* 认证类型 */}
          <SelectItem
            {...options['P22054']}
            gfd={gfd}
            selectOptions={[
              { v: '1', t: $t('c_450') },
              { v: '0', t: $t('c_451') }
            ]}
          />
          {/* 服务器 */}
          <InputItem
            {...options['P1591']}
            gfd={gfd}
            gfdOptions={{
              rules: [
                this.checkUrlPath()
              ]
            }}
          />
          {/* 端口 */}
          <InputItem
            {...options['P1592']}
            gfd={gfd}
            gfdOptions={{
              rules: [
                this.digits(),
                this.range(0, 65535)
              ]
            }}
          />
          {/* 请求路径 */}
          <InputItem
            {...options['P2937']}
            gfd={gfd}
          />
          {/* BroadWorks用户ID */}
          <InputItem
            {...options['P22034']}
            gfd={gfd}
          />
          {/* SIP认证ID */}
          <InputItem
            {...options['P1593']}
            hide={P22054 === '1'}
            gfd={gfd}
            gfdOptions={{
              hidden: P22054 === '1'
            }}
          />
          {/* SIP认证密码 */}
          <PwInputItem
            {...options['P1594']}
            hide={P22054 === '1'}
            gfd={gfd}
            gfdOptions={{
              hidden: P22054 === '1'
            }}
          />
          {/* 登录密码 */}
          <PwInputItem
            {...options['P22103']}
            hide={P22054 !== '1'}
            gfd={gfd}
            gfdOptions={{
              hidden: P22054 !== '1'
            }}
          />
          {/* BroadSoft联系人及通话记录更新间隔(秒) */}
          <InputItem
            {...options['bsinterval']}
            name='bsinterval'
            gfd={gfd}
            gfdOptions={{
              rules: [
                this.digits(),
                this.required(),
                this.range(60, 2147483647)
              ]
            }}
          />
          {/* BroadSoft联系人返回条数 */}
          <InputItem
            {...options['P22014']}
            gfd={gfd}
            gfdOptions={{
              rules: [
                this.digits(),
                this.range(1, 1000)
              ]
            }}
          />
          {/* 关联BroadSoft帐号 */}
          <SelectItem
            {...options['Pxsi_call_accountid']}
            gfd={gfd}
            selectOptions={
              Array(this.props.maxacctnum).fill().map((v, i) => {
                return { v: i + '', t: $t('c_405') + (i + 1) }
              })
            }
          />
          {/* BroadSoft联系人顺序 */}
          <FormItem
            {...options['Pbs_contacts_order']}
          >
            {
              gfd('Pbs_contacts_order')(
                <BroadSoftDirOrder />
              )
            }

          </FormItem>
          <br />
          <FormItem label='' >
            <Button className='sub-btn' id='subBtn' onClick={this.handleSubmit}>{$t('b_001')}</Button>
          </FormItem>
        </Form>
      </Spin>
    )
  }
}

export default XSIServiceSet
