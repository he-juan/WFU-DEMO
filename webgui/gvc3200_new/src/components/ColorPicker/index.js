/** 取色器 */
import React, { useState, forwardRef, useEffect } from 'react'
import { GithubPicker } from 'react-color'
import './colorPick.less'

const COLORS = [
  '#000000', '#595959', '#a5a5a5', '#ffffff',
  '#8e2323', '#b20000', '#db7070', '#ff4c4c', '#8e5923', '#b25900',
  '#dba570', '#ffa54c', '#8e8e23', '#b2b200', '#dbdb70', '#feff4c',
  '#598e23', '#59b200', '#a5db70', '#a5ff4c', '#238e23', '#00b200',
  '#70db70', '#4cff4c', '#238e59', '#00b259', '#70dba5', '#4cffa5',
  '#238e8e', '#00b2b2', '#70dbdb', '#4cfeff', '#23598e', '#0059b2',
  '#70a5db', '#4ca5ff', '#23238e', '#0000b2', '#7070db', '#4c4cff',
  '#59238e', '#5900b2', '#a570db', '#a54cff', '#8e238e', '#b200b2',
  '#db70db', '#fe4cff', '#8e2359', '#b20059', '#db70a5', '#ff4ca5',
  '#ff0000', '#ff7f00', '#feff00', '#7fff00', '#00ff00', '#00ff7f',
  '#00feff', '#007fff', '#0000ff', '#7f00ff', '#fe00ff', '#ff007f'
]

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
        <GithubPicker colors={COLORS} width={213} onChange={(v) => onChange(v.hex)}/>
      </div>
    </div>
  )
}

export default forwardRef(ColorPicker)
