import React from 'react'

function tr(text) {
  var tr_text = text;
  var language = $.cookie('MyLanguage') == null ? 'en' : $.cookie('MyLanguage');
  try {
      tr_text = window.eval(text+"_" + language);
  } catch (err) {
  } finally {
      return tr_text;
  }
}
/**
 * 每个屏幕
 */
export default ({screenContent, style}) => {
  let inner = null
  if(screenContent.type == '12') {  //演示
    inner = <p><strong>{tr('a_10004')}</strong></p>
  } else if (screenContent.type == '0') {  // 远程
    inner = <p><strong>{screenContent.confname}</strong><span>({screenContent.confname})</span></p>
  } else if (screenContent.type == '13') {
    inner = <p><strong>{tr('a_10032')}</strong><span>{screenContent.conftype}</span></p>
  } else {
    inner = <p>other</p>
  }
  return (
    <div className="preview-item" style={style}>
      {inner}
    </div>
  )
}