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
    Modal,
    Icon
} from "antd";

import * as Actions from '../../redux/actions/index'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

const Content = Layout;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;


const req_items = [

];

let mFocusTimer="";
let mUpdatePosTimer=""

class Preset extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:[{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
            modalVisible:false,
            controlBackground:"normal",
            position:"",
            mPressedDown:false,
            applyPosion:""
        }
    }

    componentDidMount = () => {
        this.props.getPresetInfoVedio((data)=>{
            let needData=this.state.data
            for(let i=0;i<data.Data.length;i++){
                if(data.Data[i].position<24){
                   for(var j in data.Data[i]){
                       needData[data.Data[i].position][j]=data.Data[i][j]
                   }
                }
            }
            this.setState({
                data:needData
            })
        })
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.props.enterSave != nextProps.enterSave) {
            this.handleSubmit();
        }
    }

    handleOk = () =>{
        this.props.setpreset(this.state.position,()=>{
            this.setState({
                modalVisible:false
            })
        })
        this.props.getPresetInfo((data)=>{
            let needData=this.state.data
            for(let i=0;i<data.Data.length;i++){
                if(data.Data[i].position<24){
                    for(var j in data.Data[i]){
                        needData[data.Data[i].position][j]=data.Data[i][j]
                    }
                }
            }
            this.setState({
                data:needData
            })
        })
    }

    handleCancel = () =>{
        this.props.deletepreset(this.state.position,()=>{
            this.setState({
                modalVisible:false
            })
            let needData=this.state.data
            needData[this.state.position]={}
            this.setState({
                data:needData
            })

        })
    }

    changeBackgroud = (way) =>{
        switch (way){
            case 'up':
                this.setState({
                    controlBackground:'uphover'
                })
                break;
            case 'down':
                this.setState({
                    controlBackground:'downhover'
                })
                break;
            case 'left':
                this.setState({
                    controlBackground:'lefthover'
                })
                break;
            case 'right':
                this.setState({
                    controlBackground:'righthover'
                })
                break;
        }
    }

    resetBackground = ()=>{
        this.setState({
            controlBackground:'normal'
        })
        if(this.state.mPressedDown){
            this.state.mPressedDown=false
            this.props.PtzctrlStop()
        }
    }

    moveDirection = (type)=>{
        clearTimeout(mUpdatePosTimer);
        this.state.mPressedDown=true
        this.props.Ptzctrl(type)
    }

    moveDirectionFocus = (type) =>{
        clearTimeout(mUpdatePosTimer);
        clearInterval(mFocusTimer);
        this.state.mPressedDown=true
        this.props.Ptzctrl(type)
        if( type == "focusfar" ){
            mFocusTimer = setInterval(()=>{
                this.props.Ptzctrl(type)
            }, 250);
        }else if( type == "focusnear" ){
            mFocusTimer = setInterval(()=>{
                this.props.Ptzctrl(type)
            }, 250);
        }
    }

    StopDirection = () =>{
        clearTimeout(mUpdatePosTimer);
        this.props.PtzctrlStop()
    }

    StopDirectionFocus = () =>{
        clearTimeout(mUpdatePosTimer);
        clearInterval(mFocusTimer);
        this.props.PtzctrlStop()
    }

    ifStopDirection= () =>{
        if(this.state.mPressedDown){
            this.state.mPressedDown=false
            this.props.PtzctrlStop()
        }
    }

    applyPreset = (position)=>{
        clearTimeout(mUpdatePosTimer);
        clearInterval(mFocusTimer);
        this.props.sqliteconf(position,()=>{
            this.setState({
                applyPosion:position
            })
            clearTimeout(mUpdatePosTimer);
            mUpdatePosTimer = setTimeout(()=>{
                this.props.updatePosition()
            }, 3000);
        })
    }

    handleSubmit = () => {

    }

    showSetting = (position,e) =>{
        e.stopPropagation()
        let data=this.state.data
        this.setState({
            modalVisible:true,
            position:position,
        })
        this.props.form.setFieldsValue({
            posionName:data[position].name?data[position].name:""
        })
    }

    render() {
        const callTr = this.tr;
        const callTipsTr = this.tips_tr;
        const {getFieldDecorator} = this.props.form;
        return (
            <Content className="content-container config-container" id="preset">
                <div className="subpagetitle">{this.tr("a_16595")}</div>
                <div className="configform" style={{minHeight: this.props.mainHeight}}>
                    <div className="preset_table">
                        {this.state.data.map((item, i)=> {
                            let isEmpty=true
                            for(var key in item){
                                isEmpty=false
                                break;
                            };
                            if(isEmpty){
                                return  <Tooltip
                                    title={"点击编辑该预置位"}><div className="preset_box" onClick={this.showSetting.bind(this,i)}>{i+1}</div>
                                </Tooltip>
                            }else{
                                return <Tooltip
                                    title={"点击应用该预置位"}>
                                    <div className="preset_box">
                                        <div className="preset_content" onClick={this.applyPreset.bind(this,item['position'])}>
                                            <div className="preset_title">{item['position']}.{item['name']}</div>
                                            <div className="preset_config" onClick={this.showSetting.bind(this,item['position'])}></div>
                                            {item['position']==this.state.applyPosion?<div className="preset_apply">{"已应用"}</div>:""}
                                            <img src={'/com.base.module.preset/' + item['position'] + '.jpg'} />
                                        </div>
                                    </div>
                                </Tooltip>
                            }
                        })}
                    </div>
                    <div style={{"display":this.state.modalVisible?"block":"none"}}>
                        <div className="control_title">
                            设置名称
                        </div>
                        <div>
                            <FormItem label={(<span>{callTr('设置名称')}&nbsp;<Tooltip title={this.tips_tr('')}><Icon type="question-circle-o" /></Tooltip></span>)} >
                                {getFieldDecorator("posionName")(<Input type="text"/>)}
                            </FormItem>
                        </div>
                        <div className="control_title">
                            设置视角
                        </div>
                        <div id="direction" className={this.state.controlBackground}>
                            <div id="up" className="ptzctrl" onMouseEnter={this.changeBackgroud.bind(this,'up')} onMouseLeave={this.resetBackground} onMouseDown={this.moveDirection.bind(this,'up')} onMouseUp={this.StopDirection}></div>
                            <div id="right" className="ptzctrl" onMouseEnter={this.changeBackgroud.bind(this,'right')} onMouseLeave={this.resetBackground} onMouseDown={this.moveDirection.bind(this,'right')} onMouseUp={this.StopDirection}></div>
                            <div id="down" className="ptzctrl" onMouseEnter={this.changeBackgroud.bind(this,'down')} onMouseLeave={this.resetBackground} onMouseDown={this.moveDirection.bind(this,'down')} onMouseUp={this.StopDirection}></div>
                            <div id="left" className="ptzctrl" onMouseEnter={this.changeBackgroud.bind(this,'left')} onMouseLeave={this.resetBackground} onMouseDown={this.moveDirection.bind(this,'left')} onMouseUp={this.StopDirection}></div>
                        </div>
                        <div className="optionbtn">
                            <div className="zoombtn">
                                <div id="AF" class="ptzctrl"
                                     onMouseLeave={this.ifStopDirection}
                                     onMouseDown={this.moveDirection.bind(this,'focusone')}
                                     onMouseUp={this.StopDirection}>AF</div>
                            </div>
                            <div className="divingline"></div>
                            <div className="zoombtn">
                                <div id="MFup" class="ptzfocusctrl"
                                     onMouseLeave={this.ifStopDirection}
                                     onMouseDown={this.moveDirectionFocus.bind(this,'focusone')}
                                     onMouseUp={this.StopDirectionFocus}>MF+</div>
                            </div>
                            <div className="divingline"></div>
                            <div className="zoombtn">
                                <div id="MFdown" class="ptzfocusctrl"
                                     onMouseLeave={this.ifStopDirection}
                                     onMouseDown={this.moveDirectionFocus.bind(this,'focusnear')}
                                     onMouseUp={this.StopDirectionFocus}>MF-</div>
                            </div>
                            <div className="divingline"></div>
                            <div className="zoombtn">
                                <div id="zoomwide" className="ptzctrl"
                                     onMouseLeave={this.ifStopDirection}
                                     onMouseDown={this.moveDirection.bind(this,'zoomtele')}
                                     onMouseUp={this.StopDirection}></div>
                            </div>
                            <div className="divingline"></div>
                            <div className="zoombtn">
                                <div id="zoomtele" className="ptzctrl"
                                     onMouseLeave={this.ifStopDirection}
                                     onMouseDown={this.moveDirection.bind(this,'zoomwide')}
                                     onMouseUp={this.StopDirection}></div>
                            </div>
                        </div>
                        <div>
                            <div className="deletePreset" onClick={this.handleCancel}>{this.tr("a_21")}</div>
                            <div className="savePreset" onClick={this.handleOk}>{this.tr("a_403")}</div>
                        </div>
                    </div>
                </div>
            </Content>
        );
    }
}

const PresetForm = Form.create()(Enhance(Preset));


const mapStateToProps = (state) => ({
    curLocale: state.curLocale,
    product: state.product,
    mainHeight: state.mainHeight,
    userType: state.userType,
    activeKey: state.TabactiveKey,
    itemValues: state.itemValues,
    enterSave: state.enterSave,
})

function mapDispatchToProps(dispatch) {
    var actions = {
        promptMsg: Actions.promptMsg,
        getItemValues: Actions.getItemValues,
        setItemValues: Actions.setItemValues,
        getPresetInfoVedio: Actions.getPresetInfoVedio,
        Ptzctrl:Actions.Ptzctrl,
        PtzctrlStop:Actions.PtzctrlStop,
        updatePosition:Actions.updatePosition,
        sqliteconf:Actions.sqliteconf,
        setpreset:Actions.setpreset,
        deletepreset:Actions.deletepreset,
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(PresetForm));