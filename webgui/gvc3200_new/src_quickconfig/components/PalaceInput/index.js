import React, { useRef } from 'react'
import './PalaceInput.less'

const PalaceInput = (props) => {
  const { value = '123123', onChange, length = 6, ...rest } = props
  const inputRef = useRef()
  return (
    <div className='palace-input' {...rest}>
      <input pattern='[0-9]*' ref={inputRef} onChange={(e) => { onChange(e.target.value.slice(0, length)) } } value={value} type='number' maxLength={length} />
      <ul className='palace-view' onClick={() => inputRef.current.focus()}>
        {
          Array.from({ length }).map((u, i) => <li key={i}>{value[i] ? '●' : ''}</li>)
        }
      </ul>
    </div>
  )
}

export default PalaceInput
