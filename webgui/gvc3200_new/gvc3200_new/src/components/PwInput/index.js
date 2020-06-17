/**
 * 密码输入
 */
import React, { useState, forwardRef } from 'react' // forwardRef.. https://reactjs.org/docs/react-api.html#reactforwardref
import { Input } from 'antd'
// import PropTypes from 'prop-types'

const PwInput = (props, ref) => {
  const { placeholder, ...rest } = props
  const [pwVisible, setPwvisible] = useState(false) // react hooks
  return (
    <Input
      ref={ref}
      placeholder={ placeholder || ''}
      type={pwVisible ? 'text' : 'password'}
      name='password'
      autoComplete='new-password'
      suffix={ <i style={{ cursor: 'pointer' }} className={`icons icon-eye ${pwVisible ? 'open' : 'close'}`} onClick={() => setPwvisible(!pwVisible)} />}
      {...rest}
    />
  )
}

// PwInput.propTypes = {
//   placeholder: PropTypes.string
// }

export default forwardRef(PwInput)
