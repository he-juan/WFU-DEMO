import React, { Component } from 'react';
import Enhance from "../../../../mixins/Enhance";
import { promptMsg } from '../../../../redux/actions';
import { Modal } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import OneHDMICustomControl from './OneHDMICustomControl'
import TwoHDMICustomControl from './TwoHDMICustomControl'
import OneHDMILayout from './OneHDMILayout'
import TwoHDMILayout from './TwoHDMILayout'








class LayoutModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hdmi1state: 0,
      activeIndex: 1,   // 1. 系统推荐;  2.等分模式; 3. 子母模式; 4. 画中画模式 5. 自定义模式
      hdmi1mode: 4,     // 4: 系统推荐, 等分模式; 5: 字母模式; 6: 画中画模式;  小于3的是自定义模式
      hdmi1content: '0', // 可能的值: '0,13' , '13, 0' , '0', '13',  (15, 12?) 
      hdmi2mode: 3,
      hdmi2content: '-1',
      hdmi2state: 0
    }
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
    this.action = 'setsysrcmdmode'
  }

  doRequest = (action, region) => {
    let url = `/manager?action=${action}&region=${region}&time=${new Date().getTime()}`
    if(action == 'setcustommode') {
      let {hdmi1mode, hdmi1content, hdmi2content, hdmi2mode} =  this.state
      url += `${url}&hdmi1mode=${hdmi1mode}&hdmi1content=${hdmi1content.replace(',',':::')}&hdmi2content=${hdmi2content.replace(',',':::')}&hdmi2mode=${hdmi2mode}`
    }
    return new Promise((resolve, reject) => {
      $.ajax({
        url: url,
        method: 'GET',
        dataType: 'json',
        success: (data) => {
          if (data.res == 'success') {
            resolve(data);
          } else {
            this.props.promptMsg("ERROR", "a_neterror");
          }
        },
        error: (err) => {
          this.props.promptMsg("ERROR", "a_neterror");
        }
      })
    })
  }
  componentWillUpdate = (nextProps) => {
    if (this.props.visible != nextProps.visible && nextProps.visible == true) {
      this.initModal();
    }
  }
  initModal = () => {
    // 第一步 检查已接入HDMI1
    this.doRequest('gethdmi1state', 'status')
      .then((data) => {
        this.setState({
          hdmi1state : data.state 
        })
        if (data.state != '1') {
          this.props.promptMsg("ERROR", "您必须接入HDMI1");
          return false;
        }
        return Promise.all([
          this.doRequest('issysrcmdmode', 'confctrl'),
          this.doRequest('gethdmi2state', 'status'),
          this.doRequest('gethdmi1displaymode', 'confctrl'),
          this.doRequest('gethdmi1displaycontent', 'confctrl')
        ])
      })
      .then(data => {
        if(!data) return false;
        let mIsSysrcmd = data[0].state;  // 是否系统推荐 
        let hdmi2state = data[1].state;  // hdmi2
        let hdmi1mode = parseInt(data[2].mode);    // 4: 系统推荐, 等分模式; 5: 字母模式; 6: 画中画模式;  小于3的是自定义模式
        let hdmi1content = data[3].lines; // '0,13' 

        this.setState({
          hdmi1mode,
          hdmi1content,
          hdmi2state
        })

        // hdmi2state == 1 的情况
        if (hdmi2state == 1) { 
          Promise.all([
            this.doRequest('gethdmi2displaymode', 'confctrl'),
            this.doRequest('gethdmi2displaycontent', 'confctrl')
          ]).then(data => {
            let hdmi2mode = parseInt(data[0].mode);
            let hdmi2content = data[1].lines;
            this.setState({
              hdmi2mode,
              hdmi2content
            })
          })
        }

        // 开始初始化...

        if (mIsSysrcmd == 1) {
          this.handleSwitch('setsysrcmdmode', 1);
          return;
        }

        switch (true) {
          case hdmi1mode == 4:
            this.handleSwitch('setdefaultaverage', 2);
            break;
          case hdmi1mode == 5:
            this.handleSwitch('setdefaultpop', 3);
            break;
          case hdmi1mode == 6:
            this.handleSwitch('setdefaultpip', 4);
            break;
          case hdmi1mode < 4:
            this.handleSwitch('setcustommode', 5);
            break;
        }
        
      })
  }
  toggleIndex = (i) => {
    this.setState({
      activeIndex: i
    });
  }
  handleSwitch = (action, index) => {
    // uri action
    this.action = action
    // 切换tab
    this.toggleIndex(index)
  }
  handleSubmit = () => {
    let _action = this.action
    this.doRequest(_action, 'confctrl').then((data) => {
      this.props.onHide();
    })
  }
  handleToggleCustomMode = (name, i) => {
    this.setState({
      [name + 'mode']: i
    })
  }
  handleToggleContent = (name, content) => {
    this.setState({
      [name + 'content']: content
    })
  }
  render() {
    let { visible, onHide, confname, conftype, presentation } = this.props;
    const {hdmi1state, activeIndex, hdmi1mode, hdmi1content, hdmi2state, hdmi2content, hdmi2mode } = this.state;
    if (!visible || hdmi1state != '1') {
      return null;
    }
    let _conftype = conftype.match(/\(.*\)/)[0];
    return (
      <Modal
        visible={visible}
        onCancel={onHide}
        onOk={() => { this.handleSubmit() }}
        width="990"
        title="布局"
        style={this.modalStyle}
        className="layout-modal"
      >
        <div className="layout-modal-main" style={{ height: '598.5px' }}>
          <ul className="layout-mode-list">
            <li title="系统推荐" className={activeIndex == '1' ? 'active' : ''} onClick={() => { this.handleSwitch('setsysrcmdmode', 1) }}>
              <div className="sysrcmd modediv"></div>
            </li>
            <li title="等分模式" className={activeIndex == 2 ? 'active' : ''} onClick={() => { this.handleSwitch('setdefaultaverage', 2) }}>
              <div className="overlap modediv"></div>
            </li>
            <li title="子母模式" className={activeIndex == 3 ? 'active' : ''} onClick={() => { this.handleSwitch('setdefaultpop', 3) }}>
              <div className="childmother modediv"></div>
            </li>
            <li title="画中画模式" className={activeIndex == 4 ? 'active' : ''} onClick={() => { this.handleSwitch('setdefaultpip', 4) }}>
              <div className="pop modediv"></div>
            </li>
            <li title="自定义"  className={activeIndex == 5 ? 'active' : ''} onClick={() => { this.handleSwitch('setcustommode', 5) }} style={{ border: "none" }}>
              <div className="custom modediv"></div>
            </li>
          </ul>
          { 
            hdmi2state == 0 ? 
            <OneHDMILayout  activeIndex={activeIndex} confname={confname} conftype={_conftype} presentation={presentation}/>
            : <TwoHDMILayout activeIndex={activeIndex} confname={confname} conftype={_conftype} presentation={presentation}/>
          }
          <div className='preview-box custom-preview' style={{ display: activeIndex == 5 ? 'block' : 'none' }}>
            {
              hdmi2state == 0 ? 
              <OneHDMICustomControl 
                hdmi1mode={hdmi1mode} 
                hdmi1content={hdmi1content}
                onToggleCustomMode={(name,i) => { this.handleToggleCustomMode(name,i) }} 
                onToggleContent={(name,content) => this.handleToggleContent(name,content)} 
                confname={confname}
                conftype={_conftype}
                presentation={presentation}
              /> :
              <TwoHDMICustomControl 
                hdmi1mode={hdmi1mode} 
                hdmi1content={hdmi1content}
                hdmi2mode={hdmi2mode}
                hdmi2content={hdmi2content}
                onToggleCustomMode={(name, i) => { this.handleToggleCustomMode(name, i) }} 
                onToggleContent={(name, content) => this.handleToggleContent(name, content)} 
                confname={confname}
                conftype={_conftype}
                presentation={presentation}
              />
            }
          </div>
        </div>
      </Modal>
    )
  }
}




const mapStateToProps = (state) => {
  return {
    presentation: true   // 是否在演示中  功能暂未开发, 暂时写死
  }
}

const mapDispatchToProps = (dispatch) => {
  var actions = {
    promptMsg: promptMsg
  }
  return bindActionCreators(actions, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Enhance(LayoutModal))