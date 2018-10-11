import React, { Component } from 'react';

/**
 * 自定义模式下根据给定的hdmi1content 或 hdmi2content, hdmi1mode, hdmi2mode 返回特定的 布局预览
 */
const calLayout = (mode, content, confname, conftype) => {
  //lines 为 0
  if(content == '0') {
    return (
      <div className="custom-main">
        <div className="preview-item" style={{height:'96%', width: '96%', margin:'1.7% 2%'}}>
          <p><strong>{confname}</strong><span>({confname})</span></p>
        </div>
      </div>
    )
  }
  // lines 为 13
  if(content == '13') {
    return (
      <div className="custom-main">
        <div className="preview-item" style={{height:'96%', width: '96%', margin:'1.7% 2%'}}>
          <p><strong>本地</strong><span>{conftype}</span></p>
        </div>
      </div>
    )
  }
  // lines 为 0,13
  if(content == '0,13') {
    if(mode == 1) {
      return (
        <div className="custom-main">
          <div className="preview-item" style={{height:'50%', width: '47.5%', margin:'21% 0 0 1.7%'}}>
            <p><strong>{confname}</strong><span>({confname})</span></p>
          </div>
          <div className="preview-item" style={{height:'50%', width: '47.5%', margin:'21% 0 0 1.7%'}}>
            <p><strong>本地</strong><span>{conftype}</span></p>
          </div>
        </div>
      )
    } else if(mode == 2) {
      return (
        <div className="custom-main">
          <div className="preview-item" style={{height:'53%', width: '64%', margin:'18% 0 0 11px'}}>
            <p><strong>{confname}</strong><span>({confname})</span></p>
          </div>
          <div className="preview-item" style={{height:'27%', width: '30%', margin:'30% 11px 0 0', float:'right'}}>
            <p><strong>本地</strong><span>{conftype}</span></p>
          </div>
        </div>
      )
    } else if(mode == 3) {
      return (
        <div className="custom-main">
          <div className="preview-item" style={{height:'96%', width: '96%', margin:'1.7% 2%', position:'relative'}}>
            <p><strong>{confname}</strong><span>({confname})</span></p>
            <div className="preview-item" style={{height:'30%', width: '30%',position:'absolute',bottom:'0',right:'0',border:'2px solid rgb(107, 107, 107)'}}>
              <p><strong>本地</strong><span>{conftype}</span></p>
            </div>
          </div>
        </div>
      )
    }
  }
  // lines 为 13,0
  if(content == '13,0') {
    if(mode == 2) {
      return (
        <div className="custom-main">
          <div className="preview-item" style={{height:'53%', width: '64%', margin:'18% 0 0 11px'}}>
            <p><strong>本地</strong><span>{conftype}</span></p>
          </div>
          <div className="preview-item" style={{height:'27%', width: '30%', margin:'30% 11px 0 0', float:'right'}}>
            <p><strong>{confname}</strong><span>({confname})</span></p>
          </div>
        </div>
      )
    } else if (mode == 3) {
      return <div className="custom-main">
        <div className="preview-item" style={{height:'96%', width: '96%', margin:'1.7% 2%', position:'relative'}}>
          <p><strong>本地</strong><span>{conftype}</span></p>
          <div className="preview-item" style={{height:'30%', width: '30%',position:'absolute',bottom:'0',right:'0',border:'2px solid rgb(107, 107, 107)'}}>
            <p><strong>{confname}</strong><span>({confname})</span></p>
          </div>
        </div>
      </div>
    }
  }

}

/**
 * 自定义布局控制
 */
class CustomControl extends Component {
  constructor(props) {
    super(props);

  }
  toggleContent = (content) => {
    if(this.props.hdmi1mode == 1 && content == '13,0') {
      content = '0,13';
    }
    this.props.onToggleContent(content)
  }
  toggleCustomMode = (i) => {
    if(i == 1 && this.props.hdmi1content == '13,0'){
      this.props.onToggleContent('0,13')
    }
    this.props.onToggleCustomMode(i)
  }
  render() {
    let { hdmi1mode, hdmi1content, onToggleCustomMode, confname, conftype } = this.props;
    if (hdmi1mode >= 4) {
      hdmi1mode = hdmi1mode - 3;
      onToggleCustomMode(hdmi1mode);
      return null;
      // hdmi1content = '0';
    }

    return (
      <div className="custom-control">
        <div className="custom-control-list">
          <p>
            <span className="linename" title={confname}>{confname}</span>
            <span
              className={`hidescreen screendiv ${hdmi1content == '13' ? 'active' : ''}`}
              title="隐藏"
              onClick={() => this.toggleContent('13')}>
            </span>
            <span
              className={`normalscreen screendiv ${(hdmi1content == '13,0' || (hdmi1mode == 1 && hdmi1content.indexOf('0') > -1)) ? 'active' : ''}`}
              title="子屏"
              onClick={() => this.toggleContent('13,0')}>
            </span>
            {
              hdmi1mode == 1
                ? ''
                : (<span
                  className={`fullscreen screendiv ${hdmi1content == '0' || hdmi1content == '0,13' ? 'active' : ''}`}
                  title="母屏"
                  onClick={() => this.toggleContent('0,13')}>
                </span>)
            }
          </p>
          <p>
            <span className="linename" title={conftype}>{conftype}</span>
            <span className="layoutlocalicon" title="本地"></span>
            <span
              className={`hidescreen screendiv ${hdmi1content == '0' ? 'active' : ''}`} 
              title="隐藏"
              onClick={() => this.toggleContent('0')}>
            </span>
            <span 
              className={`normalscreen screendiv ${(hdmi1content == '0,13' || (hdmi1mode == 1 && hdmi1content.indexOf('13') > -1)) ? 'active' : ''}`} 
              title="子屏"
              onClick={() => this.toggleContent('0,13')}>
            </span>
            {
              hdmi1mode == 1
                ? ''
                : <span 
                    className={`fullscreen screendiv ${hdmi1content == '13' || hdmi1content == '13,0' ? 'active' : ''}`} 
                    title="母屏"
                    onClick={() => this.toggleContent('13,0')}>
                  </span>
            }
          </p>
        </div>
        <div className="custom-control-preview">
          { calLayout(hdmi1mode,hdmi1content,confname,conftype) }
          <div className="cusmodecls">
            <ul>
              <li className={`cusmode cusoverlap ${hdmi1mode == 1 ? 'active' : ''}`} mode="1" onClick={() => this.toggleCustomMode(1)}></li>
              <li className={`cusmode cuschildmother ${hdmi1mode == 2 ? 'active' : ''}`} mode="2" onClick={() => this.toggleCustomMode(2)}></li>
              <li className={`cusmode cuspop ${hdmi1mode == 3 ? 'active' : ''}`} mode="3" onClick={() => this.toggleCustomMode(3)}></li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

export default CustomControl