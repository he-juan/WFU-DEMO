/**
 * 表单元素通用封装, 主要包括了是否隐藏, 类名, 是否重启, tooltips, label
 */
import React from 'react'
import { Form, Icon, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import { $t } from '@/Intl'
import './formitem.less'

import CheckboxItem from './CheckboxItem'
import SelectItem from './SelectItem'
import InputItem from './InputItem'
import PwInputItem from './PwInputItem'
import SliderItem from './SliderItem'
import RadioGroupItem from './RadioGroupItem'
import { showp } from '@/utils/showp'

const getPtitle = (props) => {
  if (!showp) {
    return ''
  }
  let ptitle = props.ptitle || props.name || props.p || ''
  if (ptitle[0] !== 'P') {
    return ''
  }
  return ptitle
}

const Item = Form.Item

const FormItem = (props) => {
  const { children, label, tips, hide, className, reboot, deny, lang, render, ...other } = props
  if (deny) return null
  let _label = (label && $t(label)) || (lang && $t(lang)) || ''
  let _tips = (tips && $t(tips)) || (lang && $t(lang + '_tip')) || ''

  return (
    <Item
      htmlFor={'_' + (other.name || Math.random())}
      className={`bak-form-item ${className || ''}`}
      label={
        <span>
          <span title={getPtitle(other)}>{_label}{' '}</span>
          {_tips ? <Tooltip title={<span dangerouslySetInnerHTML={{ __html: _tips }}></span>}><Icon type='question-circle-o' /></Tooltip> : ''}
        </span>
      }
      {...other}
      style={{ display: typeof hide !== 'undefined' && !!hide ? 'none' : 'block' }}
    >
      {render ? render() : children}
      {reboot ? <Icon title={$t('m_037')} className='rebooticon' type='info-circle' style={{ color: '#faad14' }}/> : null}
    </Item>
  )
}

FormItem.propTypes = {
  children: PropTypes.node,
  label: PropTypes.string,
  tips: PropTypes.string,
  hide: PropTypes.bool,
  className: PropTypes.string,
  render: PropTypes.func, // 渲染函数， 用于渲染内部的组件 优先级大于children
  name: PropTypes.string,

  // 以下通过template options 传入 , 优先级更高
  reboot: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  deny: PropTypes.number,
  lang: PropTypes.string

}

export { CheckboxItem, SelectItem, InputItem, SliderItem, RadioGroupItem, PwInputItem }

export default FormItem
