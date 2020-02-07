/** 取色器 */
import React, { useState, forwardRef, useEffect } from 'react'
import { ChromePicker } from 'react-color'
import './colorPick.less'

const ColorPicker = (props, ref) => {
  const { value, onChange } = props
  const [pickerVisible, setPickerVisible] = useState(false)
  useEffect(() => {
    function clickEvent (e) {
      if (e.path && e.path.indexOf(document.getElementsByClassName('color-picker')[0]) > -1) {
        return false
      }
      if (!pickerVisible) return false
      setPickerVisible(false)
    }
    document.addEventListener('click', clickEvent, false)

    return () => {
      document.removeEventListener('click', clickEvent)
    }
  })
  return (
    <div className='color-picker' ref={ref} >
      <span className='color-preview' style={{ background: value }} onClick={() => setPickerVisible(!pickerVisible)}></span>
      <div className='color-picker-main' style={{ display: pickerVisible ? 'block' : 'none' }}>
        <ChromePicker color={value} onChange={(v) => onChange(v.hex)} disableAlpha={true} />
      </div>
    </div>
  )
}

export default forwardRef(ColorPicker)
