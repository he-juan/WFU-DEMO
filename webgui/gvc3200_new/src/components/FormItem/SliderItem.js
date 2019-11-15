/**
 * 通用的slider 封装, 如果遇到无法套用的可以直接用更底层的FormItem
 */
import React from 'react'
import FormItem from '@/components/FormItem'
import { Slider } from 'antd'
import PropTypes from 'prop-types'

const SliderItem = (props) => {
  const { gfd, gfdOptions, name, disabled, min, max, p, ...others } = props

  return (
    <FormItem
      name={name || p}
      {...others}
      render={() => {
        return gfd(p || name, {
          hidden: others.hide,
          normalize: (value) => Number(value),
          ...gfdOptions
        })(
          <Slider disabled={!!disabled} min={min} max={max} marks={{ [min]: min, [max]: max }} />
        )
      }}
    />
  )
}

SliderItem.propTypes = {
  gfd: PropTypes.func.isRequired,
  gfdOptions: PropTypes.object,
  name: PropTypes.string,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  tips: PropTypes.string,
  hide: PropTypes.bool,
  className: PropTypes.string,
  onChange: PropTypes.func,

  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,

  // 由template options 传入
  p: PropTypes.string, // 与name作用相同， 但p值优先级高
  reboot: PropTypes.bool,
  deny: PropTypes.number,
  lang: PropTypes.string
}

export default SliderItem
