/**
 * 弹窗限制参数有: 
 * hdmiInOn
 * wifiDisplayOn
 * is4kon
 * videocodec
 */
import React, { Component } from 'react'
import { Modal, Form, Select } from 'antd';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { promptMsg, setPresentation } from '../../../redux/actions';

const FormItem = Form.Item
const Option = Select.Option
class PresentationModal extends Component {
  constructor() {
    super()
    this.state = {
      hdmiInOn: 0,
      wifiDisplayOn: 0,
      bfcpMode: 0,
      bfcpSource: 0
    }
  }
  doRequest = (action, region, params) => {
    let url = `/manager?action=${action}&region=${region}&time=${new Date().getTime()}`
    if(params) {
      url += params
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
            if(action == 'ctrlBFCPState') {
              this.props.promptMsg("ERROR", "操作失败!");
            } else {
              this.props.promptMsg("ERROR", "a_neterror");
            }
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
  initModal() {
    Promise.all([
      this.doRequest('gethdmiinstate', 'status'),
      this.doRequest('getwifidisplaystate', 'confctrl'),
      this.doRequest('getBFCPMode', 'confctrl')
    ]).then(data => {
      let _hdmiInOn = parseInt(data[0].state);
      let _wifiDisplayOn = parseInt(data[1].state);
      let _bfcpMode = parseInt(data[2].mode);
      this.setState({
        hdmiInOn: _hdmiInOn,
        wifiDisplayOn: _wifiDisplayOn,
        bfcpMode: _bfcpMode
      });

      if (_hdmiInOn && _wifiDisplayOn) {
        return this.doRequest('getpresentsource', 'confctrl')
      }
    }).then(data => {
      if (data) {
        this.setState({
          bfcpSource: data.bfcpSource == 'hdmi' ? 0 : 1
        })
      }
    })
  }
  handleSelectMode = (v) => {
    this.setState({
      bfcpMode: v
    })
  }
  handleSelectSource = (v) => {
    this.setState({
      bfcpSource: v
    })
  }
  handleSubmit = () => {
    let ison = this.state.bfcpMode
    let source;
    // 先判断是否在通话中
    // ...
    
    // 判断是否连接HDMI1
    this.doRequest('gethdmi1state', 'status').then(data => {
      if(data.state != '1') {
        this.props.promptMsg("ERROR", "您必须接入HDMI1!");
        return false
      }
      return Promise.all([
        this.doRequest('gethdmiinstate', 'status'),
        this.doRequest('getwifidisplaystate', 'confctrl')
      ])
    }).then(data => {
      if(!data) return false;
      let _hdmiInOn = parseInt(data[0].state);
      let _wifiDisplayOn = parseInt(data[1].state);
      if(!_hdmiInOn && !_wifiDisplayOn) {
        this.props.promptMsg("ERROR", "请接入HDMI IN或WifiDisplay!");
        return false;
      }
      if(!_hdmiInOn && _wifiDisplayOn) {
        source = 1
      } else if (_hdmiInOn && _wifiDisplayOn) {
        source = this.state.bfcpSource
      }

      //..
      return this.doRequest("ctrlBFCPState", "confctrl", `&source=${source}&ison=${ison}`)
    }).then(data => {
      if(data && data.msg == 'true') {
        this.props.promptMsg("success",'请稍候...');
        let isPresent = this.state.bfcpMode > 0;
        this.props.setPresentation(isPresent);
        this.props.onHide();
      } else {
        this.props.promptMsg("ERROR", "操作失败!");
      }
    })
  }
  render() {
    const { hdmiInOn, wifiDisplayOn, bfcpMode, bfcpSource } = this.state;
    const { visible, onHide, is4kon, videocodec} = this.props;
    const ItemStyleProps = {
      style: {display:'block'},
      labelCol: {span: 6},
      wrapperCol: {span: 16}
    };
    return (
      <Modal
        visible={visible}
        title={"演示"}
        width={400}
        style={{ top: '350px' }}
        onCancel={onHide}
        onOk={() => {this.handleSubmit()}}
      >
        <FormItem
          {...ItemStyleProps}
          label="演示流设置"
        >
          <Select
            style={{ width: 240 }}
            value={bfcpMode}
            onSelect={(v) => this.handleSelectMode(v) }
          >
            <Option value={1} key="1">自动</Option>
            {
              (!is4kon && !videocodec && (hdmiInOn || wifiDisplayOn))
              ? <Option value={3} key="3">PC</Option> : ''
            }
            <Option value={0} key="0">关闭</Option>
          </Select>
        </FormItem>
        {
          hdmiInOn && wifiDisplayOn ?
          <FormItem
          {...ItemStyleProps}
          label="演示源"
        >
          <Select 
            style={{width: 240}}
            value={bfcpSource}
            onSelect={(v) => this.handleSelectSource(v) }
          >
            <Option value={0}>HDMI</Option>
            <Option value={1}>WifiDisplay</Option>
          </Select>
        </FormItem> : ''
        }
      </Modal>
    )
  }
}

const mapState = (state) => {
  return {
    is4kon: false,  // 取值?
    videocodec: 0,  // 取值?
  }
}

const mapDispatch = (dispatch) => {
  var actions = {
    promptMsg: promptMsg,
    setPresentation:setPresentation
  }
  return bindActionCreators(actions, dispatch)
}
export default connect(mapState, mapDispatch)(PresentationModal)