import React, { Component } from 'react'
import Enhance from '../../../../../mixins/Enhance'
import { promptMsg,getBFCPMode } from '../../../../../redux/actions';
import { Modal } from 'antd'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import API from './api'

import DefaultLayout from './DefaultLayout'
import CustomLayout from './CustomLayout'

let HDMI1_MODE,   //hdmi1模式 
    IS_SYS_RCMD,  //是否系统推荐
    LAYOUT_SET,   //布局
    HDMI2_STATE,  //hdmi2 是否接入
    MEMBERLIST,   //成员列表
    CUS_LAYOUT_SET,  // 自定义模式下的布局存储用
    HIDE_PIP = false;
class LayoutModel_SFU extends Component {
  constructor(){
    super()
    this.modalStyle = {
      position: 'absolute',
      left: '0',
      top: '-10px',
      bottom: '0',
      right: '0',
      margin: 'auto',
      height: '700px',
      paddingBottom: '0',
    }
    this.state = {
      activeIndex: 'sysrcmd',
      layoutSet: [],
      isCustom: false,
      customLayoutset: []
    }
  }
  componentWillUpdate = (nextProps) => {
    if (this.props.visible != nextProps.visible && nextProps.visible == true) {
      if(API.SFU_gethdmi1state().state != 1) {
        this.props.promptMsg("ERROR", this.tr('a_10081') + ' HDMI1!');
        return false;
      }
      this.initModal();
    }
    if (this.props.hdmiStatus != nextProps.hdmiStatus) {    
      this.props.onHide();
    }
  }
  initModal = () => {
    // 接口数据获取
    HDMI1_MODE = API.SFU_gethdmi1mode().mode;                      //hdmi1模式 
    IS_SYS_RCMD = parseInt(API.SFU_issysrcmode().state);           //是否系统推荐
    LAYOUT_SET = API.SFU_getsfuvideolayout().layoutSet;            //布局
    HDMI2_STATE = API.SFU_gethdmi2state().state;                   //hdmi2 是否接入
    MEMBERLIST = API.SFU_getsfuvideolayoutlist().displayList;      //成员列表
    CUS_LAYOUT_SET = JSON.parse(JSON.stringify(LAYOUT_SET));       //自定义布局 拷贝一份， 所有自定义布局改动均存储在这，并且最终提交时，以该变量为依据
    HIDE_PIP = MEMBERLIST.length > 3

    this.setState({
      layoutSet: LAYOUT_SET,
      activeIndex: IS_SYS_RCMD ? 'sysrcmd' : this.chooseIndex(HDMI1_MODE),
      isCustom: HDMI1_MODE <= 3 ? true : false,
      customLayoutset: CUS_LAYOUT_SET
    })
  }
  chooseIndex(hdmi1mode) {
    switch (hdmi1mode) {
      case "1":
      case "2":
      case "3":
        return 'custom';
      case "4":
        return 'Average';
      case "5":
        return 'POP';
      case "6":
        return 'PIP';
      case "7": 
        return 'remote';

    }
  }
  handleSwitch = (mode) => {
    let _LAYOUT_SET = JSON.parse(JSON.stringify(LAYOUT_SET))
    var _MEMBERLIST = MEMBERLIST.slice();
    if(mode == 'custom') {
      this.setState({
        isCustom: true,
        customLayoutset: _LAYOUT_SET
      })
    } else {
      let tempLayoutset;
      if(HDMI2_STATE == '0') {
        if(mode == 'sysrcmd' && _MEMBERLIST[0].name == 'null') {
          _MEMBERLIST = [_MEMBERLIST[0]]
          
        } else if(mode == 'remote' ) {
          if(_MEMBERLIST.length > 1) {
            _MEMBERLIST = _MEMBERLIST.slice(0, -1)
          }
          if(_MEMBERLIST[0].name == 'null') {
            _MEMBERLIST = _MEMBERLIST.slice(1)
          }
        } 
        tempLayoutset = [
          {displayList: _MEMBERLIST, mode: mode, name: 'hdmi1'}
        ]

      } else if(HDMI2_STATE == '1') {
        if(mode == 'remote') {
          _MEMBERLIST = _MEMBERLIST.slice(0, -1)
        }
        if(_MEMBERLIST[0].name == 'null'){  //name 为null 是 演示流
          tempLayoutset = [
            {displayList: [_MEMBERLIST[0]], mode: mode, name: 'hdmi1'},
            {displayList: _MEMBERLIST.slice(1), mode: mode, name: 'hdmi2'}
          ]
        } else {    //无演示
          if(_MEMBERLIST.length == 2) {
            tempLayoutset = [
              {displayList: [_MEMBERLIST[0]], mode: mode, name: 'hdmi1'},
              {displayList: [_MEMBERLIST[1]], mode: mode, name: 'hdmi2'}
            ]
          } else if(_MEMBERLIST.length == 3) {
            tempLayoutset = [
              {displayList: [_MEMBERLIST[0]], mode: mode, name: 'hdmi1'},
              {displayList: _MEMBERLIST.slice(1), mode: mode, name: 'hdmi2'}
            ]
          } else if(_MEMBERLIST.length == 4) {
            tempLayoutset = [
              {displayList: _MEMBERLIST.slice(0,2), mode: mode, name: 'hdmi1'},
              {displayList: _MEMBERLIST.slice(2,2), mode: mode, name: 'hdmi2'}
            ]
          }
        }
      }
      this.setState({
        layoutSet: tempLayoutset,
        isCustom: false
      })
    }
    this.setState({
      activeIndex: mode
    });
  }
  updateCustomLayoutSet(v) {
    this.setState({
      customLayoutset: v
    })
  }
  handleSubmit(){
    switch(this.state.activeIndex) {
      case 'sysrcmd':
        API.SFU_setsysrcmdmode();
        break;
      case 'remote':
        API.SFU_setremotemode();
        break;
      case 'Average':
        API.SFU_setdefaultaverage();
        break;
      case 'POP':
        API.SFU_setdefaultpop();
        break;
      case 'PIP':
        API.SFU_setdefaultpip();
        break;
      case 'custom':
        let customLayoutset = this.state.customLayoutset
        let hdmi1mode, hdmi1content = [], hdmi2mode, hdmi2content = [];
        hdmi1mode = this.mapMode(customLayoutset[0].mode);
        hdmi2mode = this.mapMode(customLayoutset[1].mode);
        $.each(customLayoutset[0].displayList, function(i, v) {
          hdmi1content.push(v.trackId);
        });
        $.each(customLayoutset[1].displayList, function(i, v) {
          hdmi2content.push(v.trackId);
        });
        hdmi1content = hdmi1content.join(':::');
        hdmi2content = hdmi2content.join(':::');
        API.SFU_setcustommode(hdmi1mode, hdmi1content, hdmi2mode, hdmi2content);
        break;
    }
    this.props.onHide() 
  }
  mapMode(mode) {
    switch(mode) {
      case 'Average':
        return '1';
      case 'POP': 
        return '2';
      case 'PIP':
        return '3'
    }
  }
  render() {
    if( !HDMI1_MODE ) {
      return null;
    }
    let { activeIndex, layoutSet, isCustom, customLayoutset } = this.state
    let { visible, onHide } = this.props
    let callTr = this.tr
    return (
      <Modal
        visible={visible}
        onCancel={onHide}
        width="990"
        title={callTr('a_16703')}
        className="layout-modal"
        style={this.modalStyle}
        onOk={() => this.handleSubmit()}
      >
        <div className="layout-modal-main" style={{ height: '598.5px' }}>
          <ul className="layout-mode-list">
            <li title={callTr('a_19383')} className={activeIndex == 'sysrcmd' ? 'active' : ''} onClick={() => { this.handleSwitch('sysrcmd') }}>
              <div className="sysrcmd modediv"></div>
            </li>
            <li title={callTr('a_10031')} className={activeIndex == 'remote' ? 'active' : ''} onClick={() => { this.handleSwitch('remote') }}>
              <div className="remote modediv"></div>
            </li>
            <li title={callTr('a_19384')} className={activeIndex == 'Average' ? 'active' : ''} onClick={() => { this.handleSwitch('Average') }}>
              <div className="Average modediv"></div>
            </li>
            <li title={callTr('a_19385')} className={activeIndex == 'POP' ? 'active' : ''} onClick={() => { this.handleSwitch('POP') }}>
              <div className="POP modediv"></div>
            </li>
            { HIDE_PIP ? '' : 
              <li title={callTr('a_19386')} className={activeIndex == 'PIP' ? 'active' : ''} onClick={() => { this.handleSwitch('PIP') }}>
                <div className="PIP modediv"></div>
              </li>
            }
            <li title={callTr('a_10151')}  className={activeIndex == 'custom' ? 'active' : ''} onClick={() => { this.handleSwitch('custom') }} style={{ border: "none" }}>
              <div className="custom modediv"></div>
            </li>
          </ul>
          <div className="layout-mode-preview">
            {
              !isCustom ? <DefaultLayout layoutSet={layoutSet} hdmi2State={HDMI2_STATE} />
              : <CustomLayout layoutSet={customLayoutset} hdmi2State={HDMI2_STATE} hdmi1mode={HDMI1_MODE} memberlist={MEMBERLIST} updateCustomLayoutSet={(v) => this.updateCustomLayoutSet(v)}/>
            }
          </div>
        </div>
      </Modal>
    )
  }
}



const mapStateToProps = (state) => {
  return {
    hdmiStatus: state.hdmiStatus  //hdmi线连接状态  有 hdmi1 hdmi2 hdmiIn  
  }
}

const mapDispatchToProps = (dispatch) => {
  var actions = {
    promptMsg: promptMsg,
  }
  return bindActionCreators(actions, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Enhance(LayoutModel_SFU))