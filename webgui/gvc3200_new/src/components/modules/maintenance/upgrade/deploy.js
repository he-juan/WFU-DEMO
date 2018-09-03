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
                        okText: callTr("a_ok"),
                        cancelText: callTr("a_cancel"),
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
        if(this.props.itemValues["CFG-Provision"]!==undefined){
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
            /*  for(let i=0;i<this.state.VocoderTargetKeys.length;i++){
                 for(let j=0;j<data.length;j++) {
                     if(this.state.VocoderTargetKeys[i]==data[j].key){
                         data.splice(j,1)
                     }
                 }
              }*/
        }


        let itemList =
            <Form hideRequiredMark>
                <p className="blocktitle"><s></s>{this.tr("a_autoup")}</p>
                <FormItem className="select-item" label={< span > {callTr("a_autoup")} < Tooltip title = {callTipsTr("Automatic Upgrade")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator('autoup', {
                        rules: [],
                        initialValue: this.props.itemValues["autoup"] ? this.props.itemValues["autoup"] : "0"
                    })(
                        <Select onChange={ this.onChangeAutoup.bind(this) } className="P-194">
                            <Option value="0">{callTr("a_no")}</Option>
                            <Option value="1">{callTr("a_checkday")}</Option>
                            <Option value="2">{callTr("a_checkweek")}</Option>
                            <Option value="3">{callTr("a_checkatperiod")}</Option>
                        </Select>
                    )
                    }
                </FormItem>
                <FormItem className={ this.state.lan_autoup_class.peroid } label={< span > { callTr("a_period") } < Tooltip title = {callTipsTr("Automatic Upgrade Check Interval")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator("peroid", {
                        rules: [{
                            validator: (data, value, callback) => {
                            this.digits(data, value, callback)
                            }
                        },{
                            validator: (data, value, callback) => {
                            this.range(data, value, callback, 60, 5256000)
                            }
                        }],
                        initialValue: this.props.itemValues.peroid
                    })(<Input onChange ={this.connectInputValue}  className="P-193"/>)}
                </FormItem>
                <Row className = "start-endhour">
                    <FormItem className={ this.state.lan_autoup_class.start_endhour } label={< span > { callTr("start_endhour") } < Tooltip title = {callTipsTr("Starting/Ending Hour of the Day")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
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
                <FormItem className={ this.state.lan_autoup_class.dayofweek + " " + "mutilCheckbox" } label={< span > { callTr("a_dayofweek") } < Tooltip title = {callTipsTr("Day of the Week")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator('dayofweek', {
                        rules: [],
                        initialValue: this.props.itemValues['dayofweek']
                    })(<Input className="P-286" style={{"display": "none"}}/>)}
                    {getFieldDecorator('dayofweek0', {
                        valuePropName: 'checked',
                        initialValue: parseInt(dayofweekArrvalue[0])
                        })(
                            <Checkbox>{callTr("a_sunday")}</Checkbox>
                    )}
                    {getFieldDecorator('dayofweek1', {
                        valuePropName: 'checked',
                        initialValue: parseInt(dayofweekArrvalue[1])
                        })(
                            <Checkbox>{callTr("a_monday")}</Checkbox>
                    )}
                    {getFieldDecorator('dayofweek2', {
                        valuePropName: 'checked',
                        initialValue: parseInt(dayofweekArrvalue[2])
                        })(
                            <Checkbox>{callTr("a_tuesday")}</Checkbox>
                    )}
                    {getFieldDecorator('dayofweek3', {
                        valuePropName: 'checked',
                        initialValue: parseInt(dayofweekArrvalue[3])
                        })(
                            <Checkbox>{callTr("a_wednesday")}</Checkbox>
                    )}
                    {getFieldDecorator('dayofweek4', {
                        valuePropName: 'checked',
                        initialValue: parseInt(dayofweekArrvalue[4])
                        })(
                            <Checkbox>{callTr("a_thursday")}</Checkbox>
                    )}
                    {getFieldDecorator('dayofweek5', {
                        valuePropName: 'checked',
                        initialValue: parseInt(dayofweekArrvalue[5])
                        })(
                            <Checkbox>{callTr("a_friday")}</Checkbox>
                    )}
                    {getFieldDecorator('dayofweek6', {
                        valuePropName: 'checked',
                        initialValue: parseInt(dayofweekArrvalue[6])
                        })(
                            <Checkbox>{callTr("a_saturday")}</Checkbox>
                    )}
                </FormItem>
                <FormItem className="select-item" label={< span > { callTr("a_autouprule") } < Tooltip title = {callTipsTr("Firmware Upgrade and Provisioning")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
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
                <FormItem label={< span > {callTr("a_autoreboot")} < Tooltip title = {callTipsTr("Auto Reboot to Upgrade Without Prompt")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator("autoreboot", {
                        rules: [],
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues.autoreboot)
                    })(
                        <Checkbox className="P-1549"/>
                    )}
                </FormItem>
                <p className="blocktitle"><s></s>{this.tr("a_dhcptitle")}</p>
                <FormItem label={< span > {callTr("a_dhcp66")} < Tooltip title = {callTipsTr("Allow DHCP Option 43 and Option 66 to Override Server")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator("dhcp66", {
                        rules: [],
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues.dhcp66)
                    })(
                        <Checkbox className="P-145"/>
                    )}
                    <Icon title={callTr("a_rebooteffect")} className="rebooticon" type="exclamation-circle-o" />
                </FormItem>
                <FormItem label={< span > {callTr("a_dhcp120")} < Tooltip title = {callTipsTr("DHCP Option 120 Override SIP Server")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator("dhcp120", {
                        rules: [],
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues.dhcp120)
                    })(
                        <Checkbox className="P-1411"/>
                    )}
                    <Icon title={callTr("a_rebooteffect")} className="rebooticon" type="exclamation-circle-o" />
                </FormItem>
                <FormItem label={< span > {callTr("a_dhcp242")} < Tooltip title = {callTipsTr("Allow DHCP Option 242 (Avaya IP Phones)")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator("dhcp242", {
                        rules: [],
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues.dhcp242)
                    })(
                        <Checkbox className="P-22053"/>
                    )}
                    <Icon title={callTr("a_rebooteffect")} className="rebooticon" type="exclamation-circle-o" />
                </FormItem>
                <p className="blocktitle"><s></s>{this.tr("a_cfgProvision")}</p>
                <FormItem className = {this.state.gapsitem} label={< span > {callTr("a_CFG_Provision")} < Tooltip title = {callTipsTr("CFG Provision")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    <div style={{width:"600px"}}>
                        <Transfer className="vocodertrans" dataSource={data} sorter={ true } titles = {[callTr("a_notallowed"),callTr("a_allowed")]} listStyle={{ width: 230, height: 206,}} targetKeys={this.state.VocoderTargetKeys} onChange={this.handleVocoderChange}  render={item => `${item.key}`} />
                    </div>
                </FormItem>
                <p className="blocktitle"><s></s>{this.tr("a_pnptitle")}</p>
                <FormItem label={< span > {callTr("a_enablepnp")} < Tooltip title = {callTipsTr("Enable PNP Feature")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator("enablepnp", {
                        rules: [],
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues.enablepnp)
                    })(
                        <Checkbox className="P-22032"/>
                    )}
                    <Icon title={callTr("a_rebooteffect")} className="rebooticon" type="exclamation-circle-o" />
                </FormItem>
                <FormItem label={< span > {callTr("a_pnpurl")} < Tooltip title = {callTipsTr("PNP URL")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator("pnpurl", {
                        rules: [{
                            max: 128,
                            message: callTr("a_lengthlimit") + "128"
                        }, {
                            validator: (data, value, callback) => {
                                this.checkUrlPath(data, value, callback)
                            }
                        }],
                        initialValue: this.props.itemValues.pnpurl
                    })(<Input className="P-22033"/>)}
                </FormItem>
                <FormItem className = {this.state.a_autopro} label={< span > {callTr("a_autopro")} < Tooltip title = {callTipsTr("PnP(3CX) Auto Provision")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator("autopro", {
                        rules: [],
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues.autopro)
                    })(
                        <Checkbox className="P-1414"/>
                    )}
                    <Icon title={callTr("a_rebooteffect")} className="rebooticon" type="exclamation-circle-o" />
                </FormItem>
                <FormItem>
                    <Button className="submit" type="primary" size="large" onClick={this.handleSubmit}>{callTr("a_save")}</Button>
                </FormItem>
                <FormItem>
                    {getFieldDecorator('sipport1', {
                        rules: [],
                        initialValue: this.props.itemValues.sipport1
                    })(<Input style = {{display:"none"}} className="P-40"/>)
                    }
                </FormItem>
                <FormItem>
                    {getFieldDecorator('sipport2', {
                        rules: [],
                        initialValue: this.props.itemValues.sipport2
                    })(<Input style = {{display:"none"}} className="P-413"/>)
                    }
                </FormItem>
                <FormItem>
                    {getFieldDecorator('sipport3', {
                        rules: [],
                        initialValue: this.props.itemValues.sipport3
                    })(<Input style = {{display:"none"}} className="P-513"/>)
                    }
                </FormItem>
                <FormItem>
                    {getFieldDecorator('sipport4', {
                        rules: [],
                        initialValue: this.props.itemValues.sipport4
                    })(<Input style = {{display:"none"}} className="P-613"/>)
                    }
                </FormItem>
                <FormItem>
                    {getFieldDecorator('sipport5', {
                        rules: [],
                        initialValue: this.props.itemValues.sipport5
                    })(<Input style = {{display:"none"}} className="P-1713"/>)
                    }
                </FormItem>
                <FormItem>
                    {getFieldDecorator('sipport6', {
                        rules: [],
                        initialValue: this.props.itemValues.sipport6
                    })(<Input style = {{display:"none"}} className="P-1813"/>)
                    }
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
