import React, { Component } from 'react';
import ScreenItems from './ScreenItems'

let _HDMIARY_ = ['0'];
let _CONTENTPOOL_ = ['0', '13'];
/**
 * 自定义布局控制
 */
class CustomControl extends Component {
  constructor(props) {
    super(props);
    this.state= {
      tab: 'hdmi1'
    }
  }
  toggleContent = (hdmiary) => {
    // console.log(hdmiary);
    // 重新整理下顺序,有些顺序是固定的
    if(this.props[this.state.tab + 'mode'] == 1) { 
      let _hdmiary = [];
      _CONTENTPOOL_.forEach((item) => {
        if(hdmiary.indexOf(item) >=0) {
          _hdmiary.push(item)
        }
      });
      hdmiary = _hdmiary
    }
    if(hdmiary.length == 3) {
      let _hdmiary = hdmiary.splice(1);
      let _hdmiary2 = [];
      _CONTENTPOOL_.forEach((item) => {
        if(_hdmiary.indexOf(item) >=0) {
          _hdmiary2.push(item)
        }
      });
      _hdmiary = _hdmiary2

      hdmiary = hdmiary.concat(_hdmiary)
    }

    this.props.onToggleContent(this.state.tab, hdmiary.join(','));
  }
  toggleCustomMode = (i) => {
    this.props.onToggleCustomMode(this.state.tab, i);
  }
  deleteContent = (c) => {
    let cIndex = _HDMIARY_.indexOf(c);
    if(cIndex < 0) {
      return false;
    }
    if(cIndex == 0 ){
      let cPoolIndex = _CONTENTPOOL_.indexOf(c);
      let x = _CONTENTPOOL_[(cPoolIndex + 1) % (_CONTENTPOOL_.length)]
      _HDMIARY_.splice(cIndex, 1);
      if(_HDMIARY_.indexOf(x) < 0) {
        _HDMIARY_.unshift(x);
      }
    } 
    if(cIndex > 0) {
      _HDMIARY_.splice(cIndex, 1);
    }
    this.toggleContent(_HDMIARY_);
  }
  pushContent = (c) => {
    let cIndex = _HDMIARY_.indexOf(c);
    if(cIndex > 0 ) {
      return false
    }
    if(cIndex < 0) {
      _HDMIARY_.push(c)
    }
    if(cIndex == 0) {  // 目前是首个
      let cPoolIndex = _CONTENTPOOL_.indexOf(c);
      let x = _CONTENTPOOL_[(cPoolIndex + 1) % (_CONTENTPOOL_.length)];
        
      _HDMIARY_.splice(cIndex, 1);
      _HDMIARY_.unshift(x);
      _HDMIARY_.push(c);
      
    }
    if(_HDMIARY_.length > 2) {
      if(this.props[this.state.tab + 'mode'] == 1) {
        let cPoolIndex = _CONTENTPOOL_.indexOf(c);
        let x = _CONTENTPOOL_[(cPoolIndex + 1) % (_CONTENTPOOL_.length)];
        _HDMIARY_.splice(_HDMIARY_.indexOf(x), 1)
      } else {
        _HDMIARY_.splice(1,1);
      }
    }
    this.toggleContent(_HDMIARY_);
  }
  unshiftContent = (c) => {
    let cIndex = _HDMIARY_.indexOf(c);
    if (cIndex == 0 ){ // 如果 已经是首个
      return false;
    }
    if (cIndex < 0) {   // 如果 未被选中
      _HDMIARY_.unshift(c)
    }
    if(cIndex > 0) {  // 如果已被选中,但是目前是子屏
      _HDMIARY_.splice(cIndex, 1);
      _HDMIARY_.unshift(c);
    }
    if(_HDMIARY_.length > 2) {
      let cPoolIndex = _CONTENTPOOL_.indexOf(c);
      let x = _CONTENTPOOL_[(cPoolIndex + 1) % (_CONTENTPOOL_.length)];
      _HDMIARY_.splice(_HDMIARY_.indexOf(x), 1)
    }
    this.toggleContent(_HDMIARY_);
  }
  render() {
    let { hdmi1mode, hdmi1content, hdmi2mode, hdmi2content, onToggleCustomMode, confname, conftype, presentation } = this.props;
    let {tab} = this.state;
    
    let hdmimode, hdmicontent;
    if(tab == 'hdmi1') {
      hdmimode = hdmi1mode
      hdmicontent = hdmi1content
    } else {
      hdmimode = hdmi2mode
      hdmicontent = hdmi2content
    }
    if (hdmimode >= 4) {
      hdmimode = hdmimode - 3;
      onToggleCustomMode(tab, hdmimode);
      return null;
      // hdmi1content = '0';
    }

    _HDMIARY_ = hdmicontent.split(',');
    if (presentation) {
      _CONTENTPOOL_ = ['12', '0', '13'];
    } else {
      _CONTENTPOOL_ = ['0', '13'];
    }

    return (
      <div className="custom-control">
        <div className="custom-control-list">
          {
            // 演示中
            presentation ?
              <p>
                <span className="linename" title={'演示'}>演示</span>
                <span className="layoutpresenticon" title="演示"></span>
                <span
                  className={`hidescreen screendiv ${hdmicontent.indexOf('12') < 0 ? 'active' : ''}`}
                  title="隐藏"
                  onClick={() => this.deleteContent('12')}>
                </span>
                <span
                  className={`normalscreen screendiv ${(hdmicontent.indexOf('12') > 0 || (hdmimode == 1 && hdmicontent.indexOf('12') == 0)) ? 'active' : ''}`}
                  title="子屏"
                  onClick={() => {this.pushContent('12')}}>
                </span>
                {
                  hdmimode == 1
                    ? ''
                    : (<span
                      className={`fullscreen screendiv ${hdmicontent.indexOf('12') == 0 ? 'active' : ''}`}
                      title="母屏"
                      onClick={() => {this.unshiftContent('12')}}>
                    </span>)
                }
              </p>
              : ''
          }
          <p>
            <span className="linename" title={confname}>{confname}</span>
            <span
              className={`hidescreen screendiv ${hdmicontent.indexOf('0') < 0 ? 'active' : ''}`}
              title="隐藏"
              onClick={() => this.deleteContent('0')}>
            </span>
            <span
              className={`normalscreen screendiv ${(hdmicontent.indexOf('0') > 0 || (hdmimode == 1 && hdmicontent.indexOf('0') == 0)) ? 'active' : ''}`}
              title="子屏"
              onClick={() => {this.pushContent('0')}}>
            </span>
            {
              hdmimode == 1
                ? ''
                : (<span
                  className={`fullscreen screendiv ${hdmicontent.indexOf('0') == 0 ? 'active' : ''}`}
                  title="母屏"
                  onClick={() => {this.unshiftContent('0')}}>
                </span>)
            }
          </p>
          <p>
            <span className="linename" title={conftype}>{conftype}</span>
            <span className="layoutlocalicon" title="本地"></span>
            <span
              className={`hidescreen screendiv ${hdmicontent.indexOf('13') < 0 ? 'active' : ''}`}
              title="隐藏"
              onClick={() => this.deleteContent('13')}>
            </span>
            <span
              className={`normalscreen screendiv ${(hdmicontent.indexOf('13') > 0 || (hdmimode == 1 && hdmicontent.indexOf('13') == 0)) ? 'active' : ''}`}
              title="子屏"
              onClick={() => {this.pushContent('13')}}>
            </span>
            {
              hdmimode == 1
                ? ''
                : <span
                  className={`fullscreen screendiv ${hdmicontent.indexOf('13') == 0 ? 'active' : ''}`}
                  title="母屏"
                  onClick={() => {this.unshiftContent('13')}}>
                </span>
            }
          </p>
        </div>
        <div className="custom-control-preview sechdmi">
          <div className="hdmi-tab">
            <span>
              <strong className={tab == 'hdmi1' ? 'active': ''} onClick={() => {this.setState({tab: 'hdmi1'})}}>HDMI1</strong>
            </span>
            <span>
              <strong className={tab == 'hdmi2' ? 'active': ''} onClick={() => {this.setState({tab: 'hdmi2'})}}>HDMI2</strong>
            </span>
          </div>
          {ScreenItems(hdmimode, hdmicontent, confname, conftype)}
          <div className="cusmodecls">
            <ul>
              <li className={`cusmode cusoverlap ${hdmimode == 1 ? 'active' : ''}`} mode="1" onClick={() => this.toggleCustomMode(1)}></li>
              <li className={`cusmode cuschildmother ${hdmimode == 2 ? 'active' : ''}`} mode="2" onClick={() => this.toggleCustomMode(2)}></li>
              <li className={`cusmode cuspop ${hdmimode == 3 ? 'active' : ''}`} mode="3" onClick={() => this.toggleCustomMode(3)}></li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

export default CustomControl