import React, {Component, PropTypes} from 'react'
import Enhance from '../../../mixins/Enhance'
import * as Actions from '../../../redux/actions/index'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {
    Form,
    Table,
    Popconfirm,
    Tooltip,
    Icon,
    Input,
    Checkbox,
    Button,
    TimePicker,
    Select,
    Modal
} from "antd";
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;
const {Column} = Table;

const req_items = [
    {"name": "schedule1", "pvalue": "22215", "value": ""},
    {"name": "schedule2", "pvalue": "22216", "value": ""},
    {"name": "schedule3", "pvalue": "22217", "value": ""},
    {"name": "schedule4", "pvalue": "22218", "value": ""},
    {"name": "schedule5", "pvalue": "22219", "value": ""},
    {"name": "schedule6", "pvalue": "22220", "value": ""},
    {"name": "schedule7", "pvalue": "22221", "value": ""},
]

class TimeForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timeList: [
                [null, null],
            ],
            timemaxLength: 3,
            data: [],
            weekpicker: [false, false, false, false, false, false, false],
            whtichtoChange: "",
            addDisabled: true,
            changeStyleIsAdd: true,
            loading: true
        }
    }

    componentDidMount = () => {
        this.UpdateTable()
    }

    UpdateTable = () => {
        this.props.getItemValues(req_items, (values) => {
            let tableList = [];
            for (let i = 1; i < 8; i++) {
                if (values['schedule' + i] != "") {
                    let obj = {}
                    obj.requency = values['schedule' + i].split(";")[1].split("=")[1];
                    obj.time = values['schedule' + i].split(";")[2].split("=")[1];
                    obj.timeIndex = i;
                    tableList.push(obj)
                }
            }
            this.setState({
                loading: false,
                data: tableList,
            })
        });
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

    hanleIceContacts = (index) => {
        if (this.state.timemaxLength != this.state.timeList.length && this.state.timeList.length == index + 1) {
            this.state.timeList.push([null, null])
        } else {
            this.state.timeList.splice(index, 1)
        }
        this.setState({
                timeList: this.state.timeList
            }
        )
        this.changeAddDisabled()
    }

    changeDaytoString = () => {
        let week = this.state.weekpicker;
        let week2 = []
        if (week[0] == true) {
            week2.push("MO")
        }
        if (week[1] == true) {
            week2.push("TU")
        }
        if (week[2] == true) {
            week2.push("WE")
        }
        if (week[3] == true) {
            week2.push("TH")
        }
        if (week[4] == true) {
            week2.push("FR")
        }
        if (week[5] == true) {
            week2.push("SA")
        }
        if (week[6] == true) {
            week2.push("SU")
        }
        let weekstr = week2.join(",")
        let time = this.state.timeList;
        let time2 = time.map((item, index) => {
            if (item[0] == null || item[1] == null) {
                return "error"
            }
            return item[0].format("HHmm") + "-" + item[1].format("HHmm")
        })
        let timestr = time2.join(",")
        return "FREQ=WEEKLY\;byday=" + weekstr + "\;ByPeriod=" + timestr
    }

    handleSubmit = () => {
        let whitch = this.state.data.length
        let req = []
        let values = {}
        if (this.props.itemValues["schedule1"] == "") {
            req = [
                {"name": "schedule1", "pvalue": "22215", "value": ""},
            ]
            values.schedule1 = this.changeDaytoString()
        } else if (this.props.itemValues["schedule2"] == "") {
            req = [
                {"name": "schedule2", "pvalue": "22216", "value": ""},
            ]
            values.schedule2 = this.changeDaytoString()
        } else if (this.props.itemValues["schedule3"] == "") {
            req = [
                {"name": "schedule3", "pvalue": "22217", "value": ""},
            ]
            values.schedule3 = this.changeDaytoString()
        } else if (this.props.itemValues["schedule4"] == "") {
            req = [
                {"name": "schedule4", "pvalue": "22218", "value": ""},
            ]
            values.schedule4 = this.changeDaytoString()
        } else if (this.props.itemValues["schedule5"] == "") {
            req = [
                {"name": "schedule5", "pvalue": "22219", "value": ""},
            ]
            values.schedule5 = this.changeDaytoString()
        } else if (this.props.itemValues["schedule6"] == "") {
            req = [
                {"name": "schedule6", "pvalue": "22220", "value": ""},
            ]
            values.schedule6 = this.changeDaytoString()
        } else if (this.props.itemValues["schedule7"] == "") {
            req = [
                {"name": "schedule7", "pvalue": "22221", "value": ""},
            ]
            values.schedule7 = this.changeDaytoString()
        } else if (whitch == 7) {
            this.props.promptMsg("ERROR", "a_switchTimeMax");
            return
        }
        let iserror = false
        for (let i = 0; i < this.state.timeList.length; i++) {
            if (this.state.timeList[i][0].isAfter(this.state.timeList[i][1])) {
                Modal.info({
                    content: <span dangerouslySetInnerHTML={{__html: this.tr("a_switch_time_error")}}></span>,
                    okText: <span dangerouslySetInnerHTML={{__html: this.tr("a_2")}}></span>,
                    onOk() {
                    },
                });
                iserror = true;
                break;
            }
        }
        if (iserror) {
            return
        }
        this.props.setItemValues(req, values, 0, () => {
            this.setState({
                timeList: [[null, null]],
                weekpicker: [false, false, false, false, false, false, false]
            });
            this.UpdateTable();
        })

    }

    handleCancel = () => {
        this.setState({
            timeList: [[null, null]],
            weekpicker: [false, false, false, false, false, false, false],
            changeStyleIsAdd: true,
        });
    }

    handleSubmit2 = () => {
        let whitch = this.state.whtichtoChange
        let req = []
        let values = {}
        if (whitch=="1") {
            req = [
                {"name": "schedule1", "pvalue": "22215", "value": ""},
            ]
            values.schedule1 = this.changeDaytoString()
        } else if (whitch=="2") {
            req = [
                {"name": "schedule2", "pvalue": "22216", "value": ""},
            ]
            values.schedule2 = this.changeDaytoString()
        } else if (whitch=="3") {
            req = [
                {"name": "schedule3", "pvalue": "22217", "value": ""},
            ]
            values.schedule3 = this.changeDaytoString()
        } else if (whitch=="4") {
            req = [
                {"name": "schedule4", "pvalue": "22218", "value": ""},
            ]
            values.schedule4 = this.changeDaytoString()
        } else if (whitch=="5") {
            req = [
                {"name": "schedule5", "pvalue": "22219", "value": ""},
            ]
            values.schedule5 = this.changeDaytoString()
        } else if (whitch=="6") {
            req = [
                {"name": "schedule6", "pvalue": "22220", "value": ""},
            ]
            values.schedule6 = this.changeDaytoString()
        } else if (whitch=="7") {
            req = [
                {"name": "schedule7", "pvalue": "22221", "value": ""},
            ]
            values.schedule7 = this.changeDaytoString()
        }
        this.props.setItemValues(req, values, 0, () => {
            this.setState({
                timeList: [[null, null]],
                weekpicker: [false, false, false, false, false, false, false],
                changeStyleIsAdd: true,
            });
            this.UpdateTable();
        })
    }

    handleEditItem = (text, index) => {
        let whitch = this.state.data[index].timeIndex;
        let timeList = []
        let weekpicker = [false, false, false, false, false, false, false]
        let weekArray = text.requency.split(",")
        for (let i = 0; i < weekArray.length; i++) {
            if (weekArray[i] == "MO") {
                weekpicker[0] = true
            } else if (weekArray[i] == "TU") {
                weekpicker[1] = true
            } else if (weekArray[i] == "WE") {
                weekpicker[2] = true
            } else if (weekArray[i] == "TH") {
                weekpicker[3] = true
            } else if (weekArray[i] == "FR") {
                weekpicker[4] = true
            } else if (weekArray[i] == "SA") {
                weekpicker[5] = true
            } else if (weekArray[i] == "SU") {
                weekpicker[6] = true
            }
        }
        let timeArray = text.time.split(",")
        for (let i = 0; i < timeArray.length; i++) {
            let timearray1 = moment().set('hour', timeArray[i].split("-")[0].substr(0, 2)).set('minute', timeArray[i].split("-")[0].substr(2, 2))
            let timearray2 = moment().set('hour', timeArray[i].split("-")[1].substr(0, 2)).set('minute', timeArray[i].split("-")[1].substr(2, 2))
            timeList.push([timearray1, timearray2])
        }
        this.setState({
            changeStyleIsAdd: false,
            whtichtoChange: whitch,
            timeList: timeList,
            weekpicker: weekpicker
        })
    }

    handleDeleteItem = (text, index) => {
        let whitch = this.state.data[index].timeIndex;
        let req = []
        let values = {}
        if (whitch == 1) {
            req = [
                {"name": "schedule1", "pvalue": "22215", "value": ""},
            ]
            values.schedule1 = ""
        } else if (whitch == 2) {
            req = [
                {"name": "schedule2", "pvalue": "22216", "value": ""},
            ]
            values.schedule2 = ""
        } else if (whitch == 3) {
            req = [
                {"name": "schedule3", "pvalue": "22217", "value": ""},
            ]
            values.schedule3 = ""
        } else if (whitch == 4) {
            req = [
                {"name": "schedule4", "pvalue": "22218", "value": ""},
            ]
            values.schedule4 = ""
        } else if (whitch == 5) {
            req = [
                {"name": "schedule5", "pvalue": "22219", "value": ""},
            ]
            values.schedule5 = ""
        } else if (whitch == 6) {
            req = [
                {"name": "schedule6", "pvalue": "22220", "value": ""},
            ]
            values.schedule6 = ""
        } else if (whitch == 7) {
            req = [
                {"name": "schedule7", "pvalue": "22221", "value": ""},
            ]
            values.schedule7 = ""
        }
        this.props.setItemValues(req, values, 0, () => {
            this.props.promptMsg("SUCCESS", "a_del_ok");
            this.UpdateTable()
        });
    }

    changeTime = (index, index2, value) => {
        this.state.timeList[index][index2] = value
        this.setState({
            timeList: this.state.timeList
        })
        this.changeAddDisabled()
    }

    changeAddDisabled = () => {
        let hasdata = false
        let hasdata2 = true;
        for (let i = 0; i < this.state.weekpicker.length; i++) {
            if (this.state.weekpicker[i] == true) {
                hasdata = true;
                break;
            }
        }
        for (let j = 0; j < this.state.timeList.length; j++) {
            if (this.state.timeList[j][0] == null || this.state.timeList[j][1] == null) {
                hasdata2 = false;
                break;
            }
        }
        this.setState({
            addDisabled: !(hasdata && hasdata2)
        })
    }

    changeday = (number) => {
        this.state.weekpicker[number] = !this.state.weekpicker[number]
        this.setState({
            weekpicker: this.state.weekpicker
        })
        this.changeAddDisabled()
    }

    render() {
        const callTr = this.props.callTr;
        const callTipsTr = this.props.callTipsTr;
        const {getFieldDecorator} = this.props.form;
        const weekButton = [
            this.props.callTr("a_124"),
            this.props.callTr("a_125"),
            this.props.callTr("a_126"),
            this.props.callTr("a_127"),
            this.props.callTr("a_128"),
            this.props.callTr("a_129"),
            this.props.callTr("a_sunday"),
        ]
        var showtips = "none";
        if (this.state.data.length == 0) {
            showtips = "block";
        } else {
            showtips = "none";
        }
        return <div>
            <Form hideRequiredMark id="switchForm">
                {this.state.timeList.map((time, index) => {
                    return <FormItem label={index == 0 ?
                        <span>{callTr("a_10056")}<Tooltip title={callTipsTr("switchTime")}><Icon
                            type="question-circle-o"/></Tooltip></span> : <span></span>} className="icecontact"
                                     style={{marginBottom: "10px"}}>
                        <TimePicker value={time[0]} format={'HH:mm'} style={{width: 220}}
                                    placeholder={callTr("a_preTime")} onChange={this.changeTime.bind(this, index, 0)}/>
                        &nbsp;&nbsp;&nbsp;<span style={{color: "#b8bdcc"}}>—</span>&nbsp;&nbsp;&nbsp;
                        <TimePicker value={time[1]} format={'HH:mm'} style={{width: 220}}
                                    placeholder={callTr("a_4034")} onChange={this.changeTime.bind(this, index, 1)}/>
                        <i className={this.state.timemaxLength == this.state.timeList.length ? 'del-btn' : this.state.timeList.length == index + 1 ? 'add-btn' : 'del-btn'}
                           onClick={this.hanleIceContacts.bind(this, index)}
                           style={{backgroundPosition: this.state.timemaxLength == this.state.timeList.length ? '-21px -25px' : this.state.timeList.length == index + 1 ? '-63px -25px' : '-21px -25px'}}/>
                    </FormItem>
                })}
                <FormItem label={<span>{callTr("a_switchFrequency")}<Tooltip title={callTipsTr("switchFrequency")}><Icon
                    type="question-circle-o"/></Tooltip></span>}>
                    {this.state.weekpicker.map((value, index) => {
                        return <div className={value ? "weekdayPicker choose" : "weekdayPicker"}
                                    onClick={this.changeday.bind(this, index)}>{weekButton[index]}</div>
                    })}
                </FormItem>
                <FormItem label={<span></span>} style={{marginTop: 30}}>
                    {
                        this.state.changeStyleIsAdd == true ?
                            <Button type="primary" size="large" style={{marginLeft: 0}}
                                    disabled={this.state.addDisabled}
                                    onClick={this.handleSubmit}>{callTr("a_23")}</Button> :
                            <div><Button className="submit" type="primary" size="large"
                                         style={{marginLeft: 0, marginTop: 0}}
                                         onClick={this.handleSubmit2}>{callTr("a_17")}</Button>
                                <Button className="cancel" size="large" onClick={this.handleCancel}
                                        style={{marginLeft: "20px", marginTop: 0}}>{callTr("a_3")}</Button></div>
                    }
                </FormItem>
            </Form>
            <div className="switchTable">
                <Table style={{"max-width": "1200px", margin: "30px",marginRight:"0px"}} dataSource={this.state.data} pagination={false}>
                    <Column title={this.tr("a_switchFrequency")} width={500} dataIndex="requency" key="name"
                            render={(text, record, index) => {
                                let array = text.split(",")
                                let array2 = []
                                for (let i = 0; i < array.length; i++) {
                                    if (array[i] == "MO") {
                                        array2.push(callTr("a_124"))
                                    } else if (array[i] == "TU") {
                                        array2.push(callTr("a_125"))
                                    } else if (array[i] == "WE") {
                                        array2.push(callTr("a_126"))
                                    } else if (array[i] == "TH") {
                                        array2.push(callTr("a_127"))
                                    } else if (array[i] == "FR") {
                                        array2.push(callTr("a_128"))
                                    } else if (array[i] == "SA") {
                                        array2.push(callTr("a_129"))
                                    } else if (array[i] == "SU") {
                                        array2.push(callTr("a_sunday"))
                                    }
                                }
                                return array2.join(",")
                            }}/>
                    <Column title={this.tr("a_10056")} width={590} dataIndex="time" key="keymode"
                            render={(text, record, index) => {
                                let array = text.split(",")
                                for (let i = 0; i < array.length; i++) {
                                    var newstr = "";
                                    var newstr2 = "";
                                    var tmp = array[i].substring(0, 7);

                                    var estr = array[i].substring(7, array[i].length);

                                    newstr += tmp + ":" + estr;

                                    var tmp2 = newstr.substring(0, 2);

                                    var estr2 = newstr.substring(2, newstr.length);

                                    newstr2 += tmp2 + ":" + estr2;

                                    array[i] = newstr2;
                                }
                                return array.join(",")
                            }}/>
                    <Column title={this.tr("a_44")} width={110} key="option" render={(text, record, index) => (
                        <span>
                    <a className="edit-icon" onClick={this.handleEditItem.bind(this, text, index)}></a>
                    <Popconfirm placement="top" title={this.tr("a_promptdelete")} okText={this.tr("a_2")}
                                cancelText={this.tr("a_3")}
                                onConfirm={this.handleDeleteItem.bind(this, text, index)}>
                        <a className="delete-icon" style={{marginLeft: "10px", "marginTop": "3px"}}></a>
                    </Popconfirm>
                </span>
                    )}/>
                </Table>
                <div className = "nodatooltips" style={{display: showtips}}>
                    <div></div>
                    <p>{this.tr("a_10082")}</p>
                </div>
            </div>
        </div>
    }
}

const mapStateToProps = (state) => ({
    activeKey: state.TabactiveKey
})

const mapDispatchToProps = (dispatch) => {
    const actions = {}
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(TimeForm));
