import React, {Component, PropTypes} from 'react'
import Enhance from "../../../mixins/Enhance";
import { Form, Layout, Tabs, Input, Icon, Tooltip, Checkbox, Radio, Select, Button, Row, InputNumber, Modal,Transfer } from "antd";
import * as Actions from '../../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const FormItem = Form.Item;
const Content = Layout;
const Option = Select.Option;
const confirm = Modal.confirm
let req_items;

class DeployForm extends Component {
    dayofweekdata = '1'
    constructor(props) {
        super(props)
        this.state = {
            lan_autoup_class: {
                peroid: '',
                start_endhour: '',
                dayofweek: ''
            },
            endhour:"",
            starhour: "",
            a_autopro:"",
            VocoderTargetKeys:[]
        }

        this.handleNvram();
    }

    handleNvram = () => {
         req_items = [];
         req_items.push(
             this.getReqItem("autoup", "194", ""),
             this.getReqItem("peroid", "193", ""),
             this.getReqItem("hourofday", "285", ""),
             this.getReqItem("endhour" ,"8459", ""),
             this.getReqItem("dayofweek", "286", ""),

             this.getReqItem("updaterule", "238", ""),
             this.getReqItem("autoreboot", "1549", ""),
             this.getReqItem("dhcp66", "145", ""),
             this.getReqItem("dhcp120", "1411", ""),
             this.getReqItem("dhcp242", "22053", ""),
             this.getReqItem("enablepnp", "22032", ""),
             this.getReqItem("pnpurl", "22033", ""),
             this.getReqItem("autopro", "1414", ""),
             this.getReqItem("sipport1", "40", ""),
             this.getReqItem("sipport2", "413", ""),
             this.getReqItem("sipport3", "513", ""),
             this.getReqItem("sipport4", "613", ""),
             this.getReqItem("sipport5", "1713", ""),
             this.getReqItem("sipport6", "1813", ""),
             this.getReqItem("CFG-Provision", "8501", "")
         )
         return req_items;
    }

    componentDidMount() {
        this.props.getItemValues(req_items,(values) => {
            if(this.props.itemValues["CFG-Provision"]==""){
                this.setState({
                    VocoderTargetKeys:[]
                })
            }else{
                this.setState({
                    VocoderTargetKeys:this.props.itemValues["CFG-Provision"].split(";")
                })
            }
            this.checkoutAutoupmode(values.autoup);
            this.checkENablepnp(values.enablepnp);
        });
        this.props.getNetworkStatus();
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.activeKey == this.props.tabOrder) {
            if (this.props.activeKey != nextProps.activeKey) {
                this.props.getItemValues(req_items,(values) => {
                    this.checkoutAutoupmode(values.autoup);
                    this.checkENablepnp(values.enablepnp);
                });
                this.props.form.resetFields();
            }
            if (this.props.enterSave != nextProps.enterSave) {
                this.handleSubmit();
            }
        }
    }

    handleSubmit = () => {
        const callTr = this.props.callTr;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(!err) {
                let values = this.props.form.getFieldsValue();

                var upvalue = values.autoup;
                if (upvalue == "1") {
                    if ( (values.endhour) && (parseInt(values.hourofday) > parseInt(values.endhour))) {
                        this.props.promptMsg('ERROR',"tip_timer");
                        return false;
                    }
                } else if (upvalue == "2" || upvalue == '3') {
                    if ((values.endhour) && (parseInt(values.hourofday) > parseInt(values.endhour)))  {
                        this.props.promptMsg('ERROR',"tip_timer");
                        return false;
                    }
                    if(upvalue == '3') {
                       if(!values.endhour && values.hourofday || values.endhour && !values.hourofday){
                           this.props.promptMsg('ERROR',"tip_timeempty");
                           return false;
                       }
                    }
                }

                var dayofweek = "";
                for ( var i = 0; i <= 6; i++) {
                    if (Number(values["dayofweek"+`${i}`]) == 1) {
                        dayofweek += `${i}` + "/";
                    }
                }
                if(dayofweek.length > 0) {
                    dayofweek = dayofweek.substring(0, dayofweek.length - 1);
                }
                this.dayofweekdata = dayofweek
                var showDialog = false;
                if (values.enablepnp === true) {
                    if( values.sipport1 == "5060" || values.sipport2 == "5060" || values.sipport3 == "5060"
                    || values.sipport4 == "5060" || values.sipport5 == "5060" || values.sipport5 == "5060" ){
                        showDialog = true;
                    }
                }
                if (showDialog) {
                    const self = this;
                    confirm({
                        content: <span dangerouslySetInnerHTML={{__html: callTr("a_pnp5060port")}}></span>,
                        okText: callTr("a_2"),
                        cancelText: callTr("a_3"),
                        onOk() {
                            self.save_settings();
                        },
                    })
                } else {
                    this.save_settings();
                }
            }
        });
    }

    save_settings  ()  {
        let values = this.props.form.getFieldsValue();
        values["dayofweek"] = this.dayofweekdata;
        values['CFG-Provision']=this.state.VocoderTargetKeys.join(";")
        this.props.setItemValues(req_items, values);
        if (values.dhcp66 === true) {
            this.props.cb_set_property(3,1);
        } else {
            this.props.cb_set_property(3,0);
        }
    }

    checkENablepnp = (value) => {
        let a_autopro;
        value === true ? a_autopro = "display-hidden" : a_autopro = "display-block";
        this.setState({
            a_autopro: a_autopro
        });
    }

    onChangeEnablepnp = (e) => {
        this.checkENablepnp(e.target.checked);
    }

    onChangeAutoup = (value) => {
        this.checkoutAutoupmode(value);
    }

    connectInputValue = (e) => {
        this.checkPeroid(e.target.value);
    }

    checkPeroid = (value) => {
        if(parseInt(value) < 1440 || value === ''){
            this.setState({
                starhour: true,
                endhour: true
            });
        } else {
            this.setState({
                starhour: false,
                endhour: false
            });
        }
    }

    checkoutAutoupmode = (value) => {
        let values = this.props.form.getFieldsValue();
        let mode = {};
        if (value === '0') {
            mode = {
                peroid: 'display-hidden',
                start_endhour: 'display-hidden',
                dayofweek: 'display-hidden'
            }
        } else if (value === '1') {
            mode = {
                peroid: 'display-hidden',
                start_endhour: 'display-block',
                dayofweek: 'display-hidden'
            }
            let endhour = "";
            this.setState({endhour:'',starhour:''});
        } else if (value === '2') {
            mode = {
                peroid: 'display-hidden',
                start_endhour: 'display-block',
                dayofweek: 'display-block'
            }
            this.setState({endhour:'',starhour:''});
        } else if (value === '3') {
            mode = {
                peroid: 'display-block',
                start_endhour: 'display-block',
                dayofweek: 'display-hidden'
            }
            let starhour = this.props.form.getFieldValue('hourofday')
            let endhour = this.props.form.getFieldValue('endhour')
            let peroid = this.props.form.getFieldValue('peroid')
            this.checkPeroid(peroid)
            if (starhour ==='' || endhour ==='') {
                this.props.form.setFieldsValue({
                    hourofday: '',
                    endhour: ''
                });
            }
        }
        if (value !== '3') {
            this.props.getItemValues(req_items,(values) => {
            });
            this.props.form.resetFields();
        }
        this.setState({
            lan_autoup_class: mode
        })
    }

    handleVocoderChange = (VocoderTargetKeys, direction, moveKeys) => {
        this.setState({ VocoderTargetKeys });
    }

    render() {
        let dayofweekArr;
        let dayofweekArrvalue = [];
        if (this.props.itemValues.dayofweek) {
            dayofweekArr = this.props.itemValues.dayofweek.split("/");
            for(var i in dayofweekArr){
                dayofweekArrvalue[dayofweekArr[i]] = "1";
            }
        } else {
            dayofweekArrvalue = [0,0,0,0,0,0,0]
        }

        const callTr = this.props.callTr;
        const callTipsTr = this.props.callTipsTr;
        const {getFieldDecorator} = this.props.form;

        let networkStatus = this.props.networkStatus;
        let data=[];
        if(this.props.itemValues["CFG-Provision"]!==undefined&&!this.isEmptyObject(networkStatus)){
            data=[{
                key:"cfg.xml",
            },
            {
                key:"cfg"+networkStatus["mac"].replace(/:/g,"").toLocaleLowerCase(),
            },
            {
                key:"cfg"+networkStatus["mac"].replace(/:/g,"").toLocaleLowerCase()+".xml",
            },
            {
                key:"cfg"+this.props.product+".xml",
            }
          ]
        }


        let itemList =
            <Form hideRequiredMark>
                <p className="blocktitle"><s></s>{this.tr("a_16340")}</p>
                <FormItem className="select-item" label={< span > {callTr("a_16340")} < Tooltip title = {callTipsTr("Automatic Upgrade")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator('autoup', {
                        rules: [],
                        initialValue: this.props.itemValues["autoup"] ? this.props.itemValues["autoup"] : "0"
                    })(
                        <Select onChange={ this.onChangeAutoup.bind(this) } className="P-194">
                            <Option value="0">{callTr("a_6")}</Option>
                            <Option value="1">{callTr("a_16341")}</Option>
                            <Option value="2">{callTr("a_16342")}</Option>
                            <Option value="3">{callTr("a_16343")}</Option>
                        </Select>
                    )
                    }
                </FormItem>
                <Row className = "start-endhour">
                    <FormItem className={ this.state.lan_autoup_class.start_endhour } label={< span > {callTr("a_16345")+ "(0-23)" } < Tooltip title = {callTipsTr("Hour of the Day")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                        <Row className="div-startendhour">
                            <FormItem>
                                {getFieldDecorator('hourofday', {
                                    rules: [{
                                        validator: (data, value, callback) => {
                                            this.digits(data, value, callback)
                                        }
                                    }, {
                                        validator: (data, value, callback) => {
                                            this.range(data, value, callback, 0, 23)
                                        }
                                    }],
                                    initialValue: this.props.itemValues['hourofday']
                                })(<Input disabled={this.state.starhour} className="P-285"/>)}
                            </FormItem>
                            <Row className = "breakline">-</Row>
                            <FormItem style = {{"marginRight":"0"}}>
                                {getFieldDecorator('endhour', {
                                    rules: [{
                                        validator: (data, value, callback) => {
                                            this.digits(data, value, callback)
                                        }
                                    }, {
                                        validator: (data, value, callback) => {
                                            this.range(data, value, callback, 0, 23)
                                        }
                                    }],
                                    initialValue: this.props.itemValues['endhour']
                                })(<Input disabled = {this.state.endhour} className="P-8459"/>)}
                            </FormItem>
                        </Row>
                    </FormItem>
                </Row>
                <FormItem className="select-item" label={< span > { callTr("a_4107") } < Tooltip title = {callTipsTr("Firmware Upgrade and Provisioning")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator('updaterule', {
                        rules: [],
                        initialValue: this.props.itemValues["updaterule"] ? this.props.itemValues["updaterule"] : "0"
                    })(
                        <Select className="P-238">
                            <Option value="0">{callTr("a_alawaycheck")}</Option>
                            <Option value="1">{callTr("a_whenchange")}</Option>
                            <Option value="2">{callTr("a_skip")}</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem label={< span > {callTr("a_16329")} < Tooltip title = {callTipsTr("Auto Reboot to Upgrade Without Prompt")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator("autoreboot", {
                        rules: [],
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues.autoreboot)
                    })(
                        <Checkbox className="P-1549"/>
                    )}
                </FormItem>
                <p className="blocktitle"><s></s>{this.tr("a_19702")}</p>
                <FormItem className = {this.state.gapsitem} label={< span > {callTr("a_19702")} < Tooltip title = {callTipsTr("CFG Provision")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    <div style={{width:"600px"}}>
                        <Transfer className="vocodertrans" dataSource={data} sorter={ true } titles = {[callTr("a_notallowed"),callTr("a_23010")]} listStyle={{ width: 230, height: 206,}} targetKeys={this.state.VocoderTargetKeys} onChange={this.handleVocoderChange}  render={item => `${item.key}`} />
                    </div>
                </FormItem>
                <FormItem>
                    <Button className="submit" type="primary" size="large" onClick={this.handleSubmit}>{callTr("a_17")}</Button>
                </FormItem>
            </Form>;

        let hideItem = this.props.hideItem;
        for (var i = hideItem.length-1; hideItem[i] != undefined && i>=0; i--) {
            itemList.props.children.splice(hideItem[i], 1);
        }

        return itemList;
    }
}

//export default Enhance(DeployForm);
const mapStateToProps = (state) => ({
    itemValues: state.itemValues,
    enterSave: state.enterSave,
    activeKey: state.TabactiveKey,
    product: state.product,
    networkStatus: state.networkStatus,
})

const mapDispatchToProps = (dispatch) => {
    const actions = {
        getItemValues:Actions.getItemValues,
        setItemValues:Actions.setItemValues,
        cb_set_property:Actions.cb_set_property,
        promptMsg: Actions.promptMsg,
        getNetworkStatus:Actions.getNetworkStatus,
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(DeployForm));
