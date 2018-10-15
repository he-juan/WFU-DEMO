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

  }

  toggleContent = (hdmiary) => {
    // console.log(hdmiary);
    // 重新整理下顺序,有些顺序是固定的
    if(this.props.hdmi1mode == 1) { 
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

    this.props.onToggleContent('hdmi1', hdmiary.join(','));
  }
  toggleCustomMode = (i) => {
    this.props.onToggleCustomMode('hdmi1',i);
  }
  // 隐藏按钮行为
  deleteContent = (c) => {
    let cIndex = _HDMIARY_.indexOf(c);
    if (cIndex < 0) {
      return false;
    }
    _HDMIARY_.splice(cIndex, 1);
    if (_HDMIARY_.length == 0) {
      let cPoolIndex = _CONTENTPOOL_.indexOf(c);
      _HDMIARY_.push(_CONTENTPOOL_[(cPoolIndex + 1) % (_CONTENTPOOL_.length)]);
    }
    this.toggleContent(_HDMIARY_);
  }
  // 子屏按钮行为
  pushContent = (c) => {
    let cIndex = _HDMIARY_.indexOf(c);
    if (cIndex < 0) {
      _HDMIARY_.push(c)
    }
    if(cIndex > 0 ) {   // 已经是子屏
      _HDMIARY_.splice(cIndex, 1);
      _HDMIARY_.push(c)
    }
    if(cIndex == 0) {  // 目前是首个
      let cPoolIndex = _CONTENTPOOL_.indexOf(c);
      let x = _CONTENTPOOL_[(cPoolIndex + 1) % (_CONTENTPOOL_.length)];
        
      _HDMIARY_.splice(cIndex, 1);
      if (_HDMIARY_.length == 0) { // 如果删去后 数组空了
        _HDMIARY_.push(x);
      } else if(_HDMIARY_.length > 0 && _HDMIARY_.indexOf(x) < 0){  // 如果删去 数组未空,但仍有隐藏的屏,则该屏放首位
        _HDMIARY_.unshift(x);
      }
      _HDMIARY_.push(c)
    }
    this.toggleContent(_HDMIARY_);
  }
  // 母屏按钮行为
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

    this.toggleContent(_HDMIARY_);
  }
  render() {
    console.log("one one")
    let { hdmi1mode, hdmi1content, onToggleCustomMode, confname, conftype, presentation } = this.props;
    if (hdmi1mode >= 4) {
      hdmi1mode = hdmi1mode - 3;
      onToggleCustomMode("hdmi1", hdmi1mode);
      return null;
      // hdmi1content = '0';
    }

    _HDMIARY_ = hdmi1content.split(',');
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
                  className={`hidescreen screendiv ${hdmi1content.indexOf('12') < 0 ? 'active' : ''}`}
                  title="隐藏"
                  onClick={() => this.deleteContent('12')}>
                </span>
                <span
                  className={`normalscreen screendiv ${(hdmi1content.indexOf('12') > 0 || (hdmi1mode == 1 && hdmi1content.indexOf('12') == 0)) ? 'active' : ''}`}
                  title="子屏"
                  onClick={() => this.pushContent('12')}>
                </span>
                {
                  hdmi1mode == 1
                    ? ''
                    : (<span
                      className={`fullscreen screendiv ${hdmi1content.indexOf('12') == 0 ? 'active' : ''}`}
                      title="母屏"
                      onClick={() => this.unshiftContent('12')}>
                    </span>)
                }
              </p>
              : ''
          }
          <p>
            <span className="linename" title={confname}>{confname}</span>
            <span
              className={`hidescreen screendiv ${hdmi1content.indexOf('0') < 0 ? 'active' : ''}`}
              title="隐藏"
              onClick={() => this.deleteContent('0')}>
            </span>
            <span
              className={`normalscreen screendiv ${(hdmi1content.indexOf('0') > 0 || (hdmi1mode == 1 && hdmi1content.indexOf('0') == 0)) ? 'active' : ''}`}
              title="子屏"
              onClick={() => this.pushContent('0')}>
            </span>
            {
              hdmi1mode == 1
                ? ''
                : (<span
                  className={`fullscreen screendiv ${hdmi1content.indexOf('0') == 0 ? 'active' : ''}`}
                  title="母屏"
                  onClick={() => this.unshiftContent('0')}>
                </span>)
            }
          </p>
          <p>
            <span className="linename" title={conftype}>{conftype}</span>
            <span className="layoutlocalicon" title="本地"></span>
            <span
              className={`hidescreen screendiv ${hdmi1content.indexOf('13') < 0 ? 'active' : ''}`}
              title="隐藏"
              onClick={() => this.deleteContent('13')}>
            </span>
            <span
              className={`normalscreen screendiv ${(hdmi1content.indexOf('13') > 0 || (hdmi1mode == 1 && hdmi1content.indexOf('13') == 0)) ? 'active' : ''}`}
              title="子屏"
              onClick={() => this.pushContent('13')}>
            </span>
            {
              hdmi1mode == 1
                ? ''
                : <span
                  className={`fullscreen screendiv ${hdmi1content.indexOf('13') == 0 ? 'active' : ''}`}
                  title="母屏"
                  onClick={() => this.unshiftContent('13')}>
                </span>
            }
          </p>
        </div>
        <div className="custom-control-preview">
          {ScreenItems(hdmi1mode, hdmi1content, confname, conftype)}
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