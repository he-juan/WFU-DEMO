import React, { Component } from 'react'
import Enhance from "../../../../mixins/Enhance";
import {promptMsg} from '../../../../redux/actions';
import { Modal, Select, Input, Checkbox} from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
const Option = Select.Option

class InviteMemberModal extends Component {
  constructor(){
    super();
    this.state = {
      defaultAccount: '0',
      callType: '0',
      mediaType: '1',
      contactList: []
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
  }
  doRequest(action, region, params) {
    let uri = `/manager?action=${action}&region=${region}&time=${new Date().getTime()}`
    if(params) {
      uri += params
    }

    return new Promise((resolve, reject) => {
      $.ajax({
        url: uri,
        method: 'GET',
        success: (data) => {
          resolve(data)
        },
        error: (err) => {
          this.props.promptMsg("ERROR", "a_16418");
        }
      })
    })
  }

  componentWillUpdate(nextProps) {
    if (this.props.visible != nextProps.visible && nextProps.visible == true) {
      this.initModal();
    }
  }
  initModal() {
    this.getDefaultAcct();
    this.getContactList();
  }
  getDefaultAcct() {
    this.doRequest('get', '', '&var-0000=22046').then(msg => {
      let data = this.res_parse_rawtext(msg);
      this.setState({
        defaultAccount: data['headers'][22046]
      })
    })
  }
  getContactList() {
     this.doRequest('sqlitecontacts', 'apps', '&type=calllog&flag=2&logtype=0').then(data => {
       this.setState({
         contactList: data
       }) 
     })
  }
  render() {
    const {visible, onHide} = this.props;
    const {defaultAccount, callType, mediaType} = this.state;
    return (
      <Modal 
        width="900"
        style={this.modalStyle}
        className="invite-modal"
        visible={visible}
        onCancel={onHide}
        title={"添加成员"}
      >
        <div style={{height: '612px'}}>
          <div className="invite-filter">
            <Select value={defaultAccount} style={{width: 200}} onSelect={(v) => this.setState({defaultAccount: v})}>
              <Option value="0" key="0">36059</Option>
              <Option value="1" key="1">IPVideoTalk</Option>
              <Option value="2" key="2">BlueJeans</Option>
              <Option value="8" key="8">H.323</Option>
            </Select>
            &nbsp;&nbsp;&nbsp;
            <Select value={callType} style={{width: 120}} onSelect={(v) => this.setState({callType: v})}>
              <Option value="0" key="0">呼叫</Option>
              {/* <Option value="1" key="1">Paging</Option> */}
              <Option value="2" key="2">IP呼叫</Option>
            </Select>
            &nbsp;&nbsp;&nbsp;
            <Select value={mediaType} style={{width: 120}} onSelect={(v) => this.setState({mediaType: v})}>
              <Option value="1" key="1">视频</Option>
              <Option value="0" key="0">音频</Option>
            </Select>
          </div>
          <br />
          <div className="invite-input">
            <Input placeholder="输入号码" />
          </div>
          <br />
          <ul className="invite-list">
            <li>
                <Checkbox /> <span className="contact-icon"></span> <strong>name</strong> <em>number</em>
            </li>
            <li>
                <Checkbox /> <span className="callout-icon"></span> <strong>name</strong> <em>number</em>
            </li>
            <li>
                <Checkbox /> <span className="miss-icon"></span> <strong>name</strong> <em>number</em>
            </li>
            <li>
                <Checkbox /> <span className="incomming-icon"></span> <strong>name</strong> <em>number</em>
            </li>
            <li>
                <Checkbox /> <span className="contact-icon"></span> <strong>name</strong> <em>number</em>
            </li>
            <li>
                <Checkbox /> <span className="callout-icon"></span> <strong>name</strong> <em>number</em>
            </li>
          </ul>
        </div>
      </Modal>
    )
  }
}




const mapState = (state) => {
  return {

  }
}
const mapDispatch = (dispatch) => {
  let actions = {
    promptMsg: promptMsg
  }
  return bindActionCreators(actions,dispatch)
}
export default connect(mapState, mapDispatch)(Enhance(InviteMemberModal))

