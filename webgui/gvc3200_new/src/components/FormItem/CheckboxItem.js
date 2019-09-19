/**
 * 通用的checkbox 封装, 如果遇到无法套用的可以直接用更底层的FormItem
 */
import React from 'react'
import FormItem from '@/components/FormItem'
import { Checkbox } from 'antd'
import PropTypes from 'prop-types'

const CheckboxItem = (props) => {
  const { gfd, gfdOptions, name, disabled, onChange, p, ...others } = props
  return (
    <FormItem
      {...others}
      render={() => {
        return gfd(p || name, {
          valuePropName: 'checked',
          normalize: (value) => Number(value),
          hidden: others.hide,
          ...gfdOptions
        })(
          <Checkbox disabled={!!disabled} onChange={onChange}/>
        )
      }}
    />
  )
}

CheckboxItem.propTypes = {
  gfd: PropTypes.func.isRequired,
  gfdOptions: PropTypes.object,
  name: PropTypes.string,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  tips: PropTypes.string,
  hide: PropTypes.bool,
  className: PropTypes.string,
  onChange: PropTypes.func,

  // 由template options 传入
  p: PropTypes.string, // 与name作用相同， 但p值优先级高
  reboot: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  deny: PropTypes.number,
  lang: PropTypes.string
}

export default CheckboxItem
