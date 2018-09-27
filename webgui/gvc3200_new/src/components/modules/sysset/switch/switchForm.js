import React, {Component, PropTypes} from 'react'
import Enhance from '../../../mixins/Enhance'
import {FormattedHTMLMessage} from 'react-intl'
import * as Actions from '../../../redux/actions/index'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {
    Form,
    Table,
    Popconfirm,
    Tooltip,
    Radio,
    Icon,
    Input,
    Checkbox,
    Button,
    Select,
    Upload,
    Modal
} from "antd";
import * as Store from "../../../entry";

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

const req_items = [
    {"name": "switchtype", "pvalue": "22210", "value": ""},
    {"name": "triggertype", "pvalue": "22211", "value": ""},
    {"name": "soundPrompt", "pvalue": "22212", "value": ""},
    {"name": "callToDeal", "pvalue": "22213", "value": ""},
    {"name": "callRecordingFunction", "pvalue": "22214", "value": ""},
]

const Tonedata = {}
const Tonelist = []

class SwitchForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            iceValues: [],
            numberList: [""],
            promptToneDisabled: true,
            switchNumberDisabled: true,
            numbermaxLength: 2,
            options: [],
            loading: true,
            Tonedata: {},
            ToneList: [],
        }
    }

    componentDidMount = () => {
        this.props.getTonelistAll(this.getAllTonelist)
        this.props.getItemValues(req_items, (value) => {
            let promptToneDisabled = true
            let switchNumberDisabled = true
            if (value['soundPrompt'] != "" && value['soundPrompt'] != "0") {
                promptToneDisabled = false
            }
            if (value['callToDeal'] != "") {
                switchNumberDisabled = false
            }
            this.setState({
                loading: false,
                numberList: value['callToDeal'].split(","),
                promptToneDisabled: promptToneDisabled,
                switchNumberDisabled: switchNumberDisabled,
            })
        });
    }

    componentWillMount = () => {

    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.activeKey == this.props.tabOrder) {
            if (this.props.activeKey != nextProps.activeKey) {
                this.props.getItemValues(req_items);
                this.props.form.resetFields();
            }
            if (this.props.enterSave != nextProps.enterSave) {
                this.handleSubmit();
            }
        }
    }

    getAllTonelist = (result)=>{
            let a={}
            a.Ringtone = JSON.parse(result[1]).Ringtone.concat(JSON.parse(result[0]).Ringtone)
            this.getTonelistDone(JSON.stringify(a));
        }


    getTonelistDone = (data) => {
        if (data.substring(0, 1) == '{') {
            var json = eval("(" + data + ")");
            var ringtone = json.Ringtone;
            for (var i = 0; i < ringtone.length; i++) {
                let showHtml
                if (ringtone[i].title.indexOf(".") != -1) {
                    showHtml = ringtone[i].title.split(".")[0]
                } else {
                    showHtml = ringtone[i].title
                }
                Tonelist.push(<Option value={ringtone[i].data}>{this.htmlEncode(showHtml)}</Option>);
            }
            this.setState({
                ToneList: Tonelist
            })
        }
    }


    onChangesound = (e) => {
        if (e.target.checked) {
            this.setState({
                promptToneDisabled: false,
            })
        } else {
            this.setState({
                promptToneDisabled: true,
            })
        }
    }

    onChangecallToDeal = (e) => {
        if (e.target.checked) {
            this.setState({
                switchNumberDisabled: false,
            })
        } else {
            this.setState({
                switchNumberDisabled: true,
            })
        }
    }


    handleChange = (index, e) => {
        /*var searchkey = value;
        let data = [];
        let dataSource = this.props.msgsContacts;
        if (searchkey === "") {
            data = [...dataSource];
        } else {
            let len = dataSource.length;
            for (let i = 0; i < len; i++) {
                let item = dataSource[i];
                let name = item.Name;
                let number = item.Number
                if (number != "") {
                    if (name.indexOf(searchkey) != -1) {
                        data.push(item);
                    } else if (number.indexOf(searchkey) != -1) {
                        data.push(item);
                    }
                }
            }
        }*/
        let numberList = this.state.numberList
        numberList[index] = e.target.value
        this.setState({
            numberList: numberList
        });
        /*if (value == "") {
            this.setState({
                options: [],
                numberList: numberList
            });
        } else if (data.length > 0) {
            let options;
            options = data.map((item) => {
                return <Option key={item.Number}>{item.Name + " (" + item.Number + ")"}</Option>;
            });
            this.setState({
                options: options,
                numberList: numberList
            });
        } else {
            this.setState({
                options: [],
                numberList: numberList
            });
        }*/
    }

    hanleIceContacts = (index) => {
        if (!this.state.switchNumberDisabled) {
            if (this.state.numbermaxLength != this.state.numberList.length && this.state.numberList.length == index + 1) {
                this.state.numberList.push("")
            } else {
                this.state.numberList.splice(index, 1)
            }
            this.setState({
                numberList: this.state.numberList
            })
        }
    }

    handleSubmit = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
                if (!err) {
                    if (values.soundPrompt == "" || values.soundPrompt == "0") {
                        values.soundPrompt = "0"
                    } else {
                        values.soundPrompt = values.promptTone
                    }
                    if (values.callToDeal == "" || values.callToDeal == "0") {
                        values.callToDeal = ""
                    } else {
                        if (!this.state.switchNumberDisabled) {
                            let isEmpty = false
                            for (let i = 0; i < this.state.numberList.length; i++) {
                                if (this.state.numberList[i] == "") {
                                    isEmpty = true
                                    break;
                                }
                            }
                            if (isEmpty) {
                                this.props.promptMsg("ERROR", "a_switch_number");
                                return
                            } else {
                                values.callToDeal = this.state.numberList.join(",")
                            }
                        }
                    }
                    this.props.setItemValues(req_items, values);
                }
            }
        )
    }

    beforeUploadhandle = (file, fileList) => {
        return new Promise((resolve, reject) => {
            this.props.cb_ping();
            let name = file.name;
            this.setState({
                fileName: name
            })
            let ext = name.slice(name.lastIndexOf(".") + 1)
            if (!(ext && (/^(wav)$/.test(ext) || /^(mp3)$/.test(ext)|| /^(ogg)$/.test(ext)))) {
                Modal.info({
                    content: <span dangerouslySetInnerHTML={{__html: this.tr("ext_wrong2")}}></span>,
                    okText: <span dangerouslySetInnerHTML={{__html: this.tr("a_2")}}></span>,
                    onOk() {
                    },
                });
                reject();
            } else {
                resolve(file);
            }
        });
    }

    render() {
        const callTr = this.props.callTr;
        const callTipsTr = this.props.callTipsTr;
        const itemvalue = this.props.itemValues;
        const {getFieldDecorator} = this.props.form;
        let self = this;
        const cilentCertProps = {
            name: 'file',
            showUploadList: false,
            action: '../upload?type=ringtone&name=' + encodeURIComponent(this.state.fileName),
            headers: {
                authorization: 'authorization-text'
            },
            onChange(info) {
                if (info.file.status == 'uploading') {
                }
                if (info.file.status === 'done') {
                    Modal.info({
                        content: <span dangerouslySetInnerHTML={{__html: self.tr("a_16669")}}></span>,
                        okText: <span dangerouslySetInnerHTML={{__html: self.tr('a_2')}}></span>,
                        onOk() {
                        },
                    });
                    self.props.getTonelistAll(this.getAllTonelist)
                } else if (info.file.status === 'error') {
                    self.props.promptMsg("ERROR", "a_16477");
                }
            },
            beforeUpload: self.beforeUploadhandle,
            onRemove() {
                return true;
            }
        }

        let itemList = <Form hideRequiredMark id="switchForm2">
            <p className="blocktitle"><s></s>{callTr("switch_basic")}</p>
            {/*<FormItem label={<span>{callTr("a_switchName")}</span>}><span
				style={{fontSize: "0.875rem", "color": "#0d1017"}}>{this.props.product}_2pin</span></FormItem>*/}
            <FormItem label={<span>{callTr("a_switchtype")}<Tooltip title={callTipsTr("switchtype")}><Icon
                type="question-circle-o"/></Tooltip></span>}>
                {getFieldDecorator('switchtype', {
                    rules: [],
                    initialValue: itemvalue['switchtype'] ? itemvalue['switchtype'] : "1"
                })(
                    <RadioGroup className="P-8">
                        <Radio value="1">{callTr("a_switchOpen")}</Radio>
                        <Radio value="0">{callTr("a_switchClose")}</Radio>
                    </RadioGroup>)}
            </FormItem>
            <FormItem label={< span> {callTr("a_triggertype")}<Tooltip title={callTipsTr("triggertype")}><Icon
                type="question-circle-o"/></Tooltip></span>}>
                {getFieldDecorator("triggertype", {
                    rules: [],
                    initialValue: itemvalue['triggertype'] ? itemvalue['triggertype'] : "0"
                })(
                    <Select className="P">
                        <Option value="0">{callTr("a_trigger1")}</Option>
                        <Option value="1">{callTr("a_trigger2")}</Option>
                    </Select>
                )}
            </FormItem>
            <p className="blocktitle"><s></s>{callTr("switch_linkage")}</p>
            <FormItem label={<span>{callTr("a_soundPrompt")}<Tooltip title={callTipsTr("soundPrompt")}><Icon
                type="question-circle-o"/></Tooltip></span>}>
                {getFieldDecorator("soundPrompt", {
                    rules: [],
                    valuePropName: 'checked',
                    initialValue: itemvalue['soundPrompt'] == 0 ? false : parseInt(itemvalue['soundPrompt']) == "" ? false : true
                })(
                    <Checkbox onChange={this.onChangesound.bind(this)} className="P-22104"/>
                )}
            </FormItem>

            <div style={{
                position: "relative",
                height: 49,
                overflow: "hidden",
                display: this.state.promptToneDisabled ? "none" : "block"
            }}>
                <FormItem label={<span
                    style={{color: this.state.promptToneDisabled ? "#bac0ca" : ""}}> {callTr("a_promptTone")}<Tooltip
                    title={callTipsTr("promptTone")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("promptTone", {
                        rules: [],
                        initialValue: itemvalue['soundPrompt'] == 0 ? "content://settings/system/ringtone" : itemvalue['soundPrompt'] == "" ? "content://settings/system/ringtone" : itemvalue['soundPrompt']
                    })(
                        <Select className="P" disabled={this.state.promptToneDisabled}>
                            <Option value="content://settings/system/ringtone">GAC2510
                                Living{callTr("a_switchDefalut")}</Option>
                            {this.state.ToneList}
                        </Select>
                    )}
                </FormItem>{getFieldDecorator("isselected", {
                initialValue: false,
                rules: []
            })(
                <Upload {...cilentCertProps} style={{position: "absolute", top: -8, left: 775}}>
                    <Button className="upload-btn" disabled={this.state.promptToneDisabled} id="switch_upload">
                        <span className="upload-icon"/>
                        <span style={{marginLeft: "5px"}}>{callTr("a_16197")}</span>
                    </Button>
                </Upload>
            )}
            </div>
            <FormItem label={<span> {callTr("a_callToDeal")}<Tooltip title={callTipsTr("callToDeal")}><Icon
                type="question-circle-o"/></Tooltip></span>}>
                {getFieldDecorator("callToDeal", {
                    rules: [],
                    valuePropName: 'checked',
                    initialValue: itemvalue['callToDeal'] === "" ? false : true
                })(
                    <Checkbox onChange={this.onChangecallToDeal.bind(this)} className="P-22104"/>
                )}
            </FormItem>
            <div>
                {this.state.numberList.map((number, index) => {
                    return <FormItem className="icecontact"
                                     style={{display: this.state.switchNumberDisabled ? "none" : "block"}}
                                     label={index == 0 ? <span
                                             style={{color: this.state.switchNumberDisabled ? "#bac0ca" : ""}}>{callTr("a_switchNumber1")}<Tooltip
                                             title={callTipsTr("switchNumber1")}><Icon type="question-circle-o"/></Tooltip></span> :
                                         <span></span>}>
                        {getFieldDecorator('switchNumber' + index, {
                            initialValue: number
                        })(
                            <Input onChange={this.handleChange.bind(this, index)}
                                   disabled={this.state.switchNumberDisabled}></Input>
                        )}&nbsp;&nbsp;
                        <i className={`${this.state.numbermaxLength == this.state.numberList.length ? 'del-btn' : this.state.numberList.length == index + 1 ? 'add-btn' : 'del-btn'}` + " " + `${this.state.switchNumberDisabled == true ? 'disable' : ''}`}
                           onClick={this.hanleIceContacts.bind(this, index)}
                           style={{backgroundPosition: this.state.numbermaxLength == this.state.numberList.length ? this.state.switchNumberDisabled == true ? '-584px -25px' : '-21px -25px' : this.state.numberList.length == index + 1 ? this.state.switchNumberDisabled == true ? '-605px -26px' : '-63px -25px' : this.state.switchNumberDisabled == true ? '-584px -25px' : '-21px -25px'}}/>
                    </FormItem>
                })}
            </div>

            <FormItem label={<span> {callTr("a_callRecordingFunction")}<Tooltip
                title={callTipsTr("callRecordingFunction")}><Icon type="question-circle-o"/></Tooltip></span>}>
                {getFieldDecorator("callRecordingFunction", {
                    rules: [],
                    valuePropName: 'checked',
                    initialValue: itemvalue['callRecordingFunction'] ? parseInt(itemvalue['callRecordingFunction']) : false
                })(
                    <Checkbox className="P-22104"/>
                )}
            </FormItem>
            <FormItem>
                <Button className="submit" type="primary" size="large"
                        onClick={this.handleSubmit}>{callTr("a_17")}</Button>
            </FormItem>
        </Form>
        let hideItem = this.props.hideItem;
        for (let i = hideItem.length - 1; hideItem[i] != undefined && i >= 0; i--) {
            itemList.props.children.splice(hideItem[i], 1);
        }
        return <div>
            {itemList}
        </div>
    }
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => {
    const actions = {}
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(SwitchForm));
