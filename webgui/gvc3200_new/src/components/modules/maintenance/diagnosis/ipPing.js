import React, {Component, PropTypes} from 'react'
import Enhance from "../../../mixins/Enhance";
import { Form, Layout, Tabs, Input, Icon, Tooltip, Button, Row } from "antd";
import * as Actions from '../../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const FormItem = Form.Item;
const Content = Layout;


let pingtimeout = null;
let curOffset = 0;
let isStop = false;

class PingForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            startDisable: false,
            stopDisable: true,
            inputDisable: false,
            pingresValue:'',
            className:''
        }
    }
    componentWillReceiveProps = (nextProps) => { 
        if (this.props.activeKey != nextProps.activeKey) {
            this.props.form.resetFields();
            clearTimeout(pingtimeout);
            this.handleStopPing();
            this.setState({
                startDisable: false,
                stopDisable: true,
                inputDisable: false,
                pingresValue:'',
                className:''
            });
        }
    }
    doRequest = (urihead) => new Promise((resolve, reject) => {
        let _urihead = urihead + "&time=" + new Date().getTime();
        let _this = this;
        $.ajax({
            type: 'get',
            url: '/manager',
            data: _urihead,
            dataType: 'text',
            success: function(data){
                resolve(_this.res_parse_rawtext(data));
            },
            error: function(){
                _this.props.promptMsg("ERROR", "a_neterror");
            }
        })
    })
    handleStartPing = () => {
        curOffset = 0;
        this.props.form.validateFields((err,values) => {
            if(!err) {
                this.setState({
                    pingresValue:'',
                    startDisable: true,
                    inputDisable: true
                })
                let targethost = values['targethost'];
                this.doRequest(`action=startping&addr=${targethost}`).then((msgs) => {
                    let res = msgs.headers['response'];
                    if( res == 'Success'){
                        pingtimeout = setTimeout(() => {
                            isStop = false;
                            this.getPingMsg(0);
                            this.setState({
                                stopDisable : false,
                                className: 'content'
                            })
                        }, 2000)
                    } else {
                        this.props.promptMsg("ERROR", "a_neterror");
                    }
                })
            }
        })
    }
    getPingMsg = (offset) => {
        this.doRequest(`action=getpingmsg&offset=${offset}`).then( msgs => {
            if(!this.refs.ipping) return;
            let res = msgs.headers['response'];
            if(res == 'Success')　{
                let pingmsg = msgs.headers['pingmsg'];
                if (pingmsg != "continue") {
                    curOffset = msgs.headers['offset'];
                    let _pingresValue = this.state.pingresValue  + pingmsg + '\n';
                    this.setState({
                        pingresValue : _pingresValue
                    })
                    pingtimeout = setTimeout(() => {this.getPingMsg(curOffset)}, 1000);
                } else {
                    curOffset = 0;
                    clearTimeout(pingtimeout);
                    this.setState({
                        startDisable: false,
                        stopDisable: true,
                        inputDisable: false
                    })
                    // if(isStop) {
                    //     curOffset = 0;
                    //     clearTimeout(pingtimeout);
                    //     this.setState({
                    //         startDisable: false,
                    //         stopDisable: true,
                    //         inputDisable: false
                    //     })
                    // } else {
                    //     pingtimeout = setTimeout(() => {this.getPingMsg(curOffset)}, 1000);  
                    // }
                }
                
            }else {
                let errmsg = msgs.headers['message'];
                if(errmsg == 'unknown host') {
                    let _pingresValue = this.state.pingresValue  + errmsg + '\n';
                    this.setState({
                        pingresValue : _pingresValue,
                        startDisable: false,
                        stopDisable: true,
                        inputDisable: false
                    })
                }
                clearTimeout(pingtimeout);
            }
        })
    }
    handleStopPing = () => {
        this.doRequest(`action=stopping`).then((msgs) => {
            if(!this.refs.ipping) return;
            let res = msgs.headers['response'];
            if(res == 'Success')　{
                isStop = true;
                this.setState({
                    stopDisable : true
                })
            } else {
                this.props.promptMsg("ERROR", "a_neterror")
            }
        })
    }
    
    render() {
        const {callTr, callTipsTr, networkStatus} = this.props;
        const {getFieldDecorator} = this.props.form;
        let itemList =
            <Form hideRequiredMark ref="ipping">
              <FormItem label={( <span> {callTr("a_16629")} <Tooltip title={callTipsTr("Ping Target Host")}> <Icon type="question-circle-o"/> </Tooltip> </span> )} >
                    {getFieldDecorator('targethost', {
                        initialValue: networkStatus.gateway,
                        rules: [
                            {
                                validator: (data, value, callback) => {
                                    this.setState({
                                        startDisable: value != '' ? false : true
                                    })
                                    this.checkUrlPath(data, value, callback)
                                }
                            }
                        ],
                    })(<Input disabled={this.state.inputDisable}/>)}
                </FormItem>
                <Row style = {{"paddingLeft":"435px"}}>
                    <Button style = {{"marginRight":"20px"}} type="primary" onClick={() => {this.handleStartPing()}} disabled={this.state.startDisable}>
                        {this.tr("a_9")}
                    </Button>
                    <Button type="danger" onClick={() => {this.handleStopPing()}} disabled={this.state.stopDisable}>
                        {this.tr("a_10")}
                    </Button>
                </Row>
                <Row style = {{"marginTop":"15px"}}><Input  type="textarea" id="pingres" disabled={true} value={this.state.pingresValue} className={this.state.className} style={{fontSize:"0.875rem"}} /></Row>
            </Form>

        let hideItem = this.props.hideItem;
        for (var i = hideItem.length-1; hideItem[i] != undefined && i>=0; i--) {
            itemList.props.children.splice(hideItem[i], 1);
        }

        return itemList;
    }
}

const mapStateToProps = (state) => ({
    networkStatus: state.networkStatus,
})

const mapDispatchToProps = (dispatch) => {
  const actions = {
    promptMsg: Actions.promptMsg
  }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(PingForm));
