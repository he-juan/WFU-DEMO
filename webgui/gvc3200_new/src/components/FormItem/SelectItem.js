/**
 * 通用的select 封装, 如果遇到无法套用的可以直接用更底层的FormItem
 */
import React from 'react'
import FormItem from '@/components/FormItem'
import { Select } from 'antd'
import PropTypes from 'prop-types'

const Option = Select.Option

const SelectItem = (props) => {
  const { gfd, gfdOptions, name, disabled, onChange, selectOptions = [], p, ...others } = props

  return (
    <FormItem
      name={name || p}
      {...others}
      render={() => {
        return gfd(p || name, {
          hidden: others.hide,
          ...gfdOptions,
          normalize: (value) => value || (selectOptions[0] && selectOptions[0].v) || ''
        })(
          <Select disabled={!!disabled} onChange={onChange} getPopupContainer={(triggerNode) => { return triggerNode }}>
            {
              selectOptions.map(item => (
                <Option value={item.v} key={item.v} title={item.t}>{item.t}</Option>
              ))
            }
          </Select>
        )
      }}
    />
  )
}

SelectItem.propTypes = {
  gfd: PropTypes.func.isRequired,
  gfdOptions: PropTypes.object,
  name: PropTypes.string,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  tips: PropTypes.string,
  hide: PropTypes.bool,
  className: PropTypes.string,
  onChange: PropTypes.func,
  selectOptions: PropTypes.array.isRequired,

  // 由template options 传入
  p: PropTypes.string, // 与name作用相同， 但p值优先级高
  reboot: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  deny: PropTypes.number,
  lang: PropTypes.string
}
export default SelectItem
