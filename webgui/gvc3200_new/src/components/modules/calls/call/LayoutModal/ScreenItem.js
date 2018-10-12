import React from 'react'

/**
 * 每个屏幕
 */
export default ({screenContent, style}) => {
  let inner = null
  if(screenContent.type == '12') {  //演示
    inner = <p><strong>演示</strong></p>
  } else if (screenContent.type == '0') {  // 远程
    inner = <p><strong>{screenContent.confname}</strong><span>({screenContent.confname})</span></p>
  } else if (screenContent.type == '13') {
    inner = <p><strong>本地</strong><span>{screenContent.conftype}</span></p>
  } else {
    inner = <p>other</p>
  }
  return (
    <div className="preview-item" style={style}>
      {inner}
    </div>
  )
}