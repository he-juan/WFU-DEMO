/**
 * 通用的RadioGroup 封装, 如果遇到无法套用的可以直接用更底层的FormItem
 */
import React from 'react'
import FormItem from '@/components/FormItem'
import { Radio } from 'antd'
import PropTypes from 'prop-types'

const RadioGroup = Radio.Group

const RadioGroupItem = (props) => {
  const { gfd, gfdOptions, name, disabled, onChange, radioOptions = [], p, ...others } = props

  return (
    <FormItem
      name={name || p}
      {...others}
      render={() => {
        return gfd(p || name, {
          hidden: others.hide,
          ...gfdOptions,
          normalize: (value) => value || (radioOptions[0] && radioOptions[0].v) || ''
        })(
          <RadioGroup disabled={!!disabled} onChange={onChange}>
            {
              radioOptions.map(item => (
                <Radio value={item.v} key={item.v}>{item.t}</Radio>
              ))
            }
          </RadioGroup>
        )
      }}
    />
  )
}

RadioGroupItem.propTypes = {
  gfd: PropTypes.func.isRequired,
  gfdOptions: PropTypes.object,
  name: PropTypes.string,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  tips: PropTypes.string,
  hide: PropTypes.bool,
  className: PropTypes.string,
  onChange: PropTypes.func,
  radioOptions: PropTypes.array.isRequired,

  // 由template options 传入
  p: PropTypes.string, // 与name作用相同， 但p值优先级高
  reboot: PropTypes.bool,
  deny: PropTypes.number,
  lang: PropTypes.string
}
export default RadioGroupItem
