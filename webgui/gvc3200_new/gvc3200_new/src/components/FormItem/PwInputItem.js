/**
 * 通用的密码input 封装, 如果遇到无法套用的可以直接用更底层的FormItem
 */
import React from 'react'
import FormItem from '@/components/FormItem'
import PwInput from '@/components/PwInput'
import PropTypes from 'prop-types'

const InputItem = (props) => {
  const { gfd, gfdOptions, name, disabled, onChange, p, ...others } = props

  return (
    <FormItem
      name={name || p}
      {...others}
      render={() => {
        return gfd(p || name, {
          hidden: others.hide,
          ...gfdOptions
        })(
          <PwInput onChange={onChange} disabled={!!disabled}/>
        )
      }}
    />
  )
}

InputItem.propTypes = {
  gfd: PropTypes.func.isRequired,
  gfdOptions: PropTypes.object,
  name: PropTypes.string,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  tips: PropTypes.string,
  hide: PropTypes.bool,
  className: PropTypes.string,

  // 由template options 传入
  p: PropTypes.string, // 与name作用相同， 但p值优先级高
  reboot: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  deny: PropTypes.number,
  lang: PropTypes.string
}

export default InputItem
