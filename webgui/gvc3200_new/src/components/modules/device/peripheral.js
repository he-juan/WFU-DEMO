import React, {Component, PropTypes} from 'react'
import Enhance from "../../mixins/Enhance";
import {
    Layout,
    Form,
    Radio,
    Select,
    Input,
    Tooltip,
    Checkbox,
    Icon,
    Button,
    Slider,
    Col
} from "antd";

import * as Actions from '../../redux/actions/index'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

const Content = Layout;
const FormItem = Form.Item;
const Option = Select.Option;


const req_items = [
    {"name":"movespeed", "pvalue":"25029", "value":""},
    {"name":"initposition", "pvalue":"25030", "value":""},
    {"name":"enablepreauto", "pvalue":"25109", "value":""},
]

let presetList=[]
let hdmi1List=[]
let hdmi2List=[]

class peripheral extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initHDMI:"-1",
            initHDMI2:"-1",
        }
    }

    componentDidMount = () => {
        this.props.getPresetInfoVedio((data) => {
            for(let i=0;i<data.Data.length;i++){
                if(data.Data[i].position<24){
                    presetList.push(<Option key={i} value={data.Data[i].position}>{this.tr("a_10024")}{parseInt(data.Data[i].position)+1}{data.Data[i].name?`(${data.Data[i].name})`:""}</Option>)
                }
            }
        });
        this.props.gethdmiconnectstatus((data)=>{
            if(data.hdmi1=="true"){
                this.props.gethdmimode('hdmi1',(data)=>{
                    if(data.res == "success"){
                        var modes = data.modes.split(",")
                        for(var i = 0; i < modes.length; i++){
                            if(modes[i].indexOf("-P") != -1){
                                modes[i] = modes[i].substring(0, modes[i].length - 2);
                                modes[i] += "(" + this.tr("a_12100")  + ")";
                            }
                            hdmi1List.push(<Option value={i.toString()} key={i}>{modes[i]}</Option>);
                        }
                        this.props.getcurhdmimode('hdmi1',(data)=>{
                            if(data.res == "success"){
                                this.setState({
                                    initHDMI:data.mode,
                                })
                            }
                        })
                    }
                })
            }else{
                hdmi1List.push(<Option value='-1' key={-1}>{this.tr("a_9717")}</Option>)
            }
            if(data.hdmi2=="true"){
                this.props.gethdmimode('hdmi2',(data)=>{
                    if(data.res == "success"){
                        var modes = data.modes.split(",")
                        for(var i = 0; i < modes.length; i++){
                            if(modes[i].indexOf("-P") != -1){
                                modes[i] = modes[i].substring(0, modes[i].length - 2);
                                modes[i] += "(" + this.tr("a_12100")  + ")";
                            }
                            hdmi2List.push(<Option value={i.toString()} key={i}>{modes[i]}</Option>);
                        }
                        this.props.getcurhdmimode('hdmi2',(data)=>{
                            if(data.res == "success"){
                                this.setState({
                                    initHDMI2:data.mode,
                                })
                            }
                        })
                    }
                })
            }else{
                hdmi2List.push(<Option value='-1' key={-1}>{this.tr("a_9717")}</Option>)
            }
        })
        this.props.getItemValues(req_items, () => {});
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.props.enterSave != nextProps.enterSave) {
            this.handleSubmit();
        }
    }

    handleSubmit = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(!err){
                this.props.setItemValues(req_items, values, 0);
                this.props.sethdmimode('hdmi1',values.HDMI)
                this.props.sethdmimode('hdmi2',values.HDMI2)
            }
        })
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const callTr = this.tr;
        const callTipsTr = this.tips_tr;
        const itemvalue = this.props.itemValues;
        return (
            <Content className="content-container config-container" id="preset">
                <div className="subpagetitle">{callTr("a_16590")}</div>
                <Form className="configform" hideRequiredMark style={{minHeight: this.props.mainHeight}}>
                    <p className="blocktitle"><s></s>{callTr("HDMI")}</p>
                    <FormItem label={<span>{callTr("a_19341")}<Tooltip title={callTipsTr("HDMI 1 Out Resolution")}><Icon type="question-circle-o"/></Tooltip></span>}>
                        {getFieldDecorator("HDMI", {
                            initialValue: this.state.initHDMI
                        })(
                            <Select>
                                {hdmi1List}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem label={<span>{callTr("a_19342")}<Tooltip title={callTipsTr("HDMI 2 Out Resolution")}><Icon type="question-circle-o"/></Tooltip></span>}>
                        {getFieldDecorator("HDMI2", {
                            initialValue: this.state.initHDMI2
                        })(
                            <Select>
                                {hdmi2List}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem label={<span>{callTr("a_19398")}<Tooltip title={callTipsTr("Enable Presentation Automatically When HDMI Plugged")}><Icon type="question-circle-o"/></Tooltip></span>}>
                        {getFieldDecorator("enablepreauto", {
                            valuePropName: 'checked',
                            initialValue: parseInt(itemvalue['enablepreauto'])
                        })(
                            <Checkbox className={"P-25109"}/>
                        )}
                    </FormItem>
                    <p className="blocktitle"><s></s>{callTr("a_10007")}</p>
                    <FormItem label={<span>{callTr("a_16606")}<Tooltip title={callTipsTr("Move Speed")}><Icon type="question-circle-o"/></Tooltip></span>}>
                        <Col span={3}><span style={{color: "#3d77ff"}}>{"1("+callTr("a_16242")+") "} </span></Col>
                        <Col span={18}> {getFieldDecorator("movespeed", {
                            valuePropName: 'value',
                            initialValue: parseInt(itemvalue['movespeed'] ? itemvalue['movespeed'] : "8")
                        })(
                            <Slider min={1} max={16} className="P-25029"/>
                        )}</Col>
                        <Col span={3}><span style={{color: "#3d77ff"}}>{" 16("+callTr("a_16241")+")"}</span></Col>
                    </FormItem>
                    <FormItem label={<span>{callTr("a_16607")}<Tooltip title={callTipsTr("Initial Position")}><Icon type="question-circle-o"/></Tooltip></span>}>
                        {getFieldDecorator("initposition", {
                            initialValue: itemvalue['initposition'] ? itemvalue['initposition'] : "0"
                        })(
                            <Select className={"P-camera_boot_position"}>
                                <option value="0">{callTr('a_17026')}</option>
                                <option value="100">{callTr('a_17027')}</option>
                                {presetList}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem>
                        <Button className="submit" type="primary" size="large" onClick={this.handleSubmit}>{callTr("a_17")}</Button>
                    </FormItem>
                </Form>
            </Content>
        );
    }
}

const peripheralForm = Form.create()(Enhance(peripheral));


const mapStateToProps = (state) => ({
    enterSave: state.enterSave,
    itemValues:state.itemValues,
    mainHeight:state.mainHeight
})

function mapDispatchToProps(dispatch) {
    var actions = {
        getItemValues: Actions.getItemValues,
        setItemValues: Actions.setItemValues,
        getPresetInfoVedio:Actions.getPresetInfoVedio,
        gethdmiconnectstatus:Actions.gethdmiconnectstatus,
        gethdmimode:Actions.gethdmimode,
        getcurhdmimode:Actions.getcurhdmimode,
        sethdmimode:Actions.sethdmimode
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(peripheralForm));