import React, {Component, PropTypes} from 'react'
import Enhance from "../../../mixins/Enhance";
import { Form, Layout, Tabs, Input, Icon, Tooltip, Button, Row } from "antd";
import * as Actions from '../../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const FormItem = Form.Item;
const Content = Layout;
var misstart = 0;
var pingtimeout;
var cur_offset = 0;
var old_offset = 0;
var old_pingmsg;

class TracerouteForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            disabled_targethost:"",
            disabled_start:"",
            disabled_stop:"disabled",
            pingresValue:"",
            content:""
        }
    }

    componentDidMount() {
        this.props.clearTraceroute(this.clearTraceroute)
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.activeKey == this.props.tabOrder) {
            if (this.props.activeKey != nextProps.activeKey) {
                this.props.form.resetFields();
                this.setState({
                    disabled_targethost:"",
                    disabled_start:"",
                    disabled_stop:"disabled",
                    pingresValue:"",
                    content:""
                })
            }
        }
    }

    clearTraceroute = () => {
        this.setState({
            pingresValue:""
        })
    }

    onChangeTargethost = (e) => {
        this.setState({
            disabled_start: e.target.value.length ? "" : "disabled"
        })
    }

    get_ping_msg_suc = (values) => {
        if(!this.refs.traceroute) return;
        let res = values.headers['response'];
        let pingresValue = this.state.pingresValue;
        this.setState({
            disabled_stop : ""
        })
        if (res === 'Success') {
            var pingmsg = values.headers['pingmsg'];
            if (pingmsg != "") {
                cur_offset = values.headers['offset'];
                let text = pingresValue;
                pingresValue = text + pingmsg;
                this.setState({
                    pingresValue:pingresValue,
                    content:"content"
                })
            } else {
                if (cur_offset == old_offset && old_offset != 0 && old_pingmsg == pingmsg)
                {
                    this.clickStopping();
                    old_offset = 0;
                    return false;
                }
            }
            old_pingmsg = pingmsg;
            old_offset = cur_offset;
            if (misstart == 1) {
                pingtimeout = setTimeout(() => {this.props.get_ping_msg(cur_offset,(values) => {
                    this.get_ping_msg_suc(values);
                });}, 3000);
            }
        } else {
            var errmsg = values.headers['message'];
            if(errmsg == "unknown host") {
                misstart = 0;
                this.setState({
                    content:"content",
                    pingresValue:errmsg
                })
            } else if (errmsg == "can not open file") {
                setTimeout(() => {this.clickStartping();},2000);
            }
        }

    }

    start_ping_suc = (value) => {
        const self = this;
        let res = value.headers['response'];
        let disabled_targethost;
        let disabled_start;
        if (res === "Success") {
            disabled_targethost = "disabled";
            disabled_start = "disabled";
            pingtimeout = setTimeout(() => {this.props.get_ping_msg(0,(values) => {
                this.get_ping_msg_suc(values);
            });}, 3000);
        } else {
            var errmsg = value.headers['message'];
            alert(errmsg);
        }
        this.setState({
            disabled_targethost:disabled_targethost,
            disabled_start:disabled_start
        })
    }

    clickStartping = () => {
        misstart = 1;
        this.setState({
            pingresValue:""
        })
        cur_offset = 0;
        this.props.form.validateFieldsAndScroll({force: true}, (err, values) => {
            this.props.start_ping(values.targethost, (value) => {
                this.start_ping_suc(value);
            });
        })
        return false;
    }

    stop_ping_suc = (msgs) => {
        let res = msgs.headers['response'];
        if (res == "Success") {
            this.setState({
                disabled_stop:"disabled"
            })
            clearTimeout(pingtimeout);
            setTimeout(()=> {
                this.setState({
                    disabled_start:"",
                    disabled_targethost:""
                })
            },2000)
            misstart = 0;
        }
    }

    clickStopping = () => {
        this.props.stop_ping( (msgs) => {
            this.stop_ping_suc(msgs)
        });
        return false;
    }

    render() {
        const callTr = this.props.callTr;
        const callTipsTr = this.props.callTipsTr;
        const {getFieldDecorator} = this.props.form;
        let disabled_targethost = this.state.disabled_targethost;
        let disabled_start = this.state.disabled_start;
        let disabled_stop = this.state.disabled_stop;
        let pingresValue = this.state.pingresValue;
        let content = this.state.content;

        let itemList =
            <Form hideRequiredMark ref="traceroute">
                <FormItem label={( <span> {callTr("a_16629")} <Tooltip title={callTipsTr("Target Host")}> <Icon type="question-circle-o"/> </Tooltip> </span> )} >
                    {getFieldDecorator('targethost', {
                        rules: [
                            {
                                validator: (data, value, callback) => {
                                    this.checkUrlPath(data, value, callback)
                                }
                            }
                        ],
                        initialValue: this.props.networkStatus.gateway
                    })(<Input disabled = {disabled_targethost == "disabled"} onChange={(e) => this.onChangeTargethost(e)} />) }
                </FormItem>
                <Row style = {{"paddingLeft":"435px"}}>
                    <Button style = {{"marginRight":"20px"}} type="primary" disabled = {disabled_start} onClick = {this.clickStartping.bind(this)}>
                        {this.tr("a_9")}
                    </Button>
                    <Button type="danger" disabled = {disabled_stop} onClick = {this.clickStopping.bind(this)}>
                        {this.tr("a_10")}
                    </Button>
                </Row>
                <Row style = {{"marginTop":"15px"}}><Input type="textarea" disabled={true} id="pingres" value={pingresValue} className = {content} style={{fontSize:"0.875rem"}} /></Row>
            </Form>

        let hideItem = this.props.hideItem;
        for (var i = hideItem.length-1; hideItem[i] != undefined && i>=0; i--) {
            itemList.props.children.splice(hideItem[i], 1);
        }

        return itemList;
    }
}

const mapStateToProps = (state) => ({
    itemValues: state.itemValues,
    changeNotice: state.changeNotice,
    activeKey: state.TabactiveKey,
    networkStatus: state.networkStatus
})

const mapDispatchToProps = (dispatch) => {
  const actions = {
      start_ping:Actions.start_ping,
      get_ping_msg:Actions.get_ping_msg,
      stop_ping:Actions.stop_ping
  }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(TracerouteForm));
