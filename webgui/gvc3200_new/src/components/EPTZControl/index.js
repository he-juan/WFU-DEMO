/**
 * 摄像头控制组件
 */
import React from 'react'
import './EPTZControl.less'
import API from '@/api'

const EPTZControl = () => {
  let timer = null
  function ptzCtrl (type) {
    clearTimeout(timer)
    API.ptzCtrl(type).then(() => {
      if (type === 'stop') {
        timer = setTimeout(() => {
          API.addPreset('100') // ? 不知道作用
        }, 2500)
      }
    })
  }
  function btnMouseOut (e) {
    ptzCtrl('stop')
    e.target.removeEventListener('mouseout', btnMouseOut)
  }
  function btnMouseUp (e) {
    ptzCtrl('stop')
    e.target.removeEventListener('mouseout', btnMouseOut)
    e.target.removeEventListener('mouseup', btnMouseUp)
  }
  function btnMouseDown (e, type) {
    ptzCtrl(type)
    e.target.addEventListener('mouseout', btnMouseOut)
    e.target.addEventListener('mouseup', btnMouseUp)
  }
  return (
    <div className='eptz-control'>
      <div className='eptz-move'>
        <i className='icons icon-eptz-up'
          onMouseDown={(e) => { btnMouseDown(e, 'up') }}
        ></i>
        <i className='icons icon-eptz-left'
          onMouseDown={(e) => { btnMouseDown(e, 'left') }}
        ></i>
        <i className='icons icon-eptz-down'
          onMouseDown={(e) => { btnMouseDown(e, 'down') }}
        ></i>
        <i className='icons icon-eptz-right'
          onMouseDown={(e) => { btnMouseDown(e, 'right') }}
        ></i>
        <div className='icons icons-eptz-bak'>
        </div>
      </div>
      <div className='eptz-zoom'>
        <span>
          <i className='eptz-af'
            onMouseDown={(e) => { btnMouseDown(e, 'focusone') }}
          >AF</i>
        </span>
        <span>
          <i className='eptz-mf-plus'
            onMouseDown={(e) => { btnMouseDown(e, 'focusfar') }}
          >MF+</i>
        </span>
        <span>
          <i className='eptz-mf-minus'
            onMouseDown={(e) => { btnMouseDown(e, 'focusnear') }}
          >MF-</i>
        </span>
        <span>
          <i className='icons icon-zoom-in'
            onMouseDown={(e) => { btnMouseDown(e, 'zoomtele') }}
          ></i>
        </span>
        <span>
          <i className='icons icon-zoom-out'
            onMouseDown={(e) => { btnMouseDown(e, 'zoomwide') }}
          ></i>
        </span>
      </div>
    </div>
  )
}

export default EPTZControl
