import React from 'react'
import ScreenItem from './ScreenItem'
/**
 * 自定义模式下根据给定的hdmi1content 或 hdmi2content, hdmi1mode, hdmi2mode 返回特定的 布局预览
 */
const ScreenItems = (mode, content, confname, conftype) => {
  let contentAry = content.split(',');
  let contentMap = contentAry.map((item) => {
    if(item == 0) {
      return {
        type: '0',
        confname: confname
      }
    } else if (item == '13') {
      return {
        type: '13',
        conftype: conftype
      }
    } else if(item == '12') {
      return {
        type: '12'
      }
    }
  })
  // 长度
  let len = contentAry.length;
  if (len == 1) {
    return (
      <div className="custom-main">
        <ScreenItem style={{ position:'absolute',bottom:'5px',right:'5px', left:'5px', top: '5px'}} screenContent={contentMap[0]} />
      </div>
    )
  } if (len == 2) {
    if (mode == 1) {
      return (
        <div className="custom-main">
          <ScreenItem style={{ height: '50%', width: '49%', margin: '21% 0 0 5px' }} screenContent={contentMap[0]} />
          <ScreenItem style={{ height: '50%', width: '49%', margin: '21% 0 0 5px' }} screenContent={contentMap[1]} />
        </div>
      )
    } else if (mode == 2) {
      return (
        <div className="custom-main">
          <ScreenItem style={{ height: '53%', width: '64%', margin: '18% 0 0 5px' }} screenContent={contentMap[0]} />
          <ScreenItem style={{ height: '27%', width: '34%', margin: '30% 5px 0 0', float: 'right' }} screenContent={contentMap[1]} />
        </div>
      )
    } else if (mode == 3) {
      return (
        <div className="custom-main">
          <ScreenItem style={{position:'absolute',bottom:'5px',right:'5px', left:'5px', top: '5px'}} screenContent={contentMap[0]} />
          <ScreenItem style={{height:'30%', width: '30%',position:'absolute',bottom:'5px',right:'5px',border:'1px solid rgb(107, 107, 107)'}} screenContent={contentMap[1]} />
        </div>
      )
    }
  } if( len == 3) {
    if (mode == 1) {
      return (
        <div className="custom-main">
          <ScreenItem style={{ height: '44%', width: '47%', margin: '3% 0 0 26.5%', float: 'left' }} screenContent={contentMap[0]} />
          <ScreenItem style={{ height: '44%', width: '47%', margin: '2% 0 0 2%', float: 'left' }} screenContent={contentMap[1]} />
          <ScreenItem style={{ height: '44%', width: '47%', margin: '2% 2% 0 0', float: 'right' }} screenContent={contentMap[2]} />
        </div>
      ) 
    } else if( mode == 2) {
      return (
        <div className="custom-main">
          <ScreenItem style={{ height: '53%', width: '64%', margin: '18% 0 0 5px' }} screenContent={contentMap[0]} />
          <ScreenItem style={{ height: '26%', width: '34%', margin: '18% 5px 0 0', float: 'right' }} screenContent={contentMap[1]} />
          <ScreenItem style={{ height: '26%', width: '34%', margin: '5px 5px 0 0', float: 'right' }} screenContent={contentMap[2]} />
        </div>
      )
    } else if( mode == 3) {
      return (
        <div className="custom-main">
          <ScreenItem style={{position:'absolute',bottom:'5px',right:'5px', left:'5px', top: '5px'}} screenContent={contentMap[0]} />
          <ScreenItem style={{height:'30%', width: '30%',position:'absolute',bottom:'5px',right:'5px',border:'1px solid rgb(107, 107, 107)'}} screenContent={contentMap[1]} />
          <ScreenItem style={{height:'30%', width: '30%',position:'absolute',bottom:'5px',left:'5px',border:'1px solid rgb(107, 107, 107)'}} screenContent={contentMap[2]} />
        </div>
      )
    }
  }
}


export default ScreenItems