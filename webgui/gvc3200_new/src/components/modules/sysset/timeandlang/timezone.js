import React, {Component, PropTypes} from 'react'
import Enhance from "../../../mixins/Enhance";
import { Form, Input, Icon, Tooltip, Checkbox, Radio, Select, Button, DatePicker, TimePicker, LocaleProvider } from "antd";
import * as Actions from '../../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'
import en_GB from 'antd/lib/locale-provider/en_GB'

const FormItem = Form.Item;
const Option = Select.Option;
let req_items;



var newgmts = new Array;


class TimezoneForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            initDate: '',
            initTime: '',
            datefmt: '3',
            timefmt: '1',
            children: [],
            timeValue:""
        }

        this.datefmtMap = {
            '3': 'YYYY/M/D',
            '0': 'YYYY/M/D',
            '1': 'M/D/YYYY',
            '2': 'D/M/YYYY'
        }
        this.timefmtMap = {
            '0':'hh:mm A',
            '1':'HH:mm'
        }
        this.handleNvram();
    }

    handleNvram = () => {
         req_items = [];
         req_items.push(
             this.getReqItem("ntpaddr", "30", ""),
             this.getReqItem("overridentp", "144", ""),
             this.getReqItem("overrideset", "143", ""),
            //  this.getReqItem("timezone", "64", ""),
             this.getReqItem("timefmt", "122", ""),
             this.getReqItem("datefmt", "102", ""),
             this.getReqItem("ntpaddr2", "8333", ""), // 指定网络时间协议服务器地址 2


         )
         return req_items;
    }

    findPos = (gmt) => {
        var index = -1;
        for( var i = 0; i < newgmts.length; i++ ){
            if( gmt < newgmts[i] )
            {
                index = i;
                break;
            }
        }
        return index;
    }

    insert = (dest, index, src) => {
        var temp = dest.splice(index);
        return dest.concat(src,temp);
    }

    htmlEncode = (str) => {
        var div = document.createElement("div");
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    getTimezone_suc = (data) => {
        let children=[]
        let hasIt=false
        for(let i=0;i<data.list.length;i++){
            if(data.timezone.id==data.list[i].id){
                hasIt=true
            }
            children.push(<Option value = {data.list[i].id} key={data.list[i].id}>{data.list[i].name}</Option>)
        }
        if(!hasIt){
            children.push(<Option value = {data.timezone.id} key={data.timezone.id}>{data.timezone.name}</Option>)
        }
        this.setState({
            children:children,
            timeValue:data.timezone.id
        })
    }

    onChangeTimezone = (value) => {

    }

    componentDidMount() {
        this.props.getItemValues(req_items, (v) => {
            let datefmt = v.datefmt;
            let timefmt = v.timefmt;
            this.setState({
                datefmt,
                timefmt
            })
        });
        this.props.getTimezone(this.props.curLocale,(values) => {
            this.getTimezone_suc(values);
        });
        this.getDateInfo();
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.activeKey == this.props.tabOrder) {
            if (this.props.activeKey != nextProps.activeKey) {
                this.props.getItemValues(req_items);
                this.getDateInfo();
                this.props.getTimezone(this.props.curLocale,(values) => {
                    this.getTimezone_suc(values);
                });
                this.props.form.resetFields();
            }
            if (this.props.enterSave != nextProps.enterSave) {
                this.handleSubmit();
            }
        }
        if(this.props.curLocale != nextProps.curLocale) {
            this.props.getTimezone(nextProps.curLocale,(values) => {
                this.getTimezone_suc(values);
            });
        }
    }

    getDateInfo = () => {
        this.props.getDateInfo((data) => {
            const _data = JSON.parse(data)
            this.setState({
                initDate:  _data.Date,
                initTime: _data.Time
            });
        })
    }
    dateChangeHandler = (moment) => {
        let date = moment.format('YYYY/M/D');
        let time = this.props.form.getFieldValue('time').format('HH:mm');
        this.props.setDateInfo({
            date,
            time
        })
    }
    timeChangeHandler = (moment) => {
        let date = this.props.form.getFieldValue('date').format('YYYY/M/D');
        let time = moment.format('HH:mm');
        this.props.setDateInfo({
            date,
            time
        })
    }
    handleTimefmt = (e) => {
        this.setState({
            timefmt: e.target.value
        })
    }
    handleDatefmt = (v) => {
        this.setState({
            datefmt: v
        })
    }
    handleSubmit = () => {
      this.props.form.validateFieldsAndScroll((err, values) => {
        if(!err) {
          let values = this.props.form.getFieldsValue();
          this.props.setItemValues(req_items, values,2,()=>{
            this.props.getItemValues([this.getReqItem("P122", "122", "")], (data) => {
                this.props.setUse24Hour(data.P122)
            })
          });
          this.props.saveTimeset(values.timezone);
          this.getDateInfo();
        }
      });
    }

    render() {
        const callTr = this.props.callTr;
        const callTipsTr = this.props.callTipsTr;
        const {getFieldDecorator} = this.props.form;
        const initialDate = moment(this.state.initDate, 'YYYY/M/D'); //服务器端是固定的
        const initialTime = moment(this.state.initTime, 'hh:mm');
        if(!initialDate._isValid || !initialTime._isValid) {
            return false
        }
        // 国际化处理
        if (this.props.curLocale !== 'zh') {
            moment.locale('en');
        } else {
            moment.locale('zh-cn');
        }
        let itemList =
            <Form hideRequiredMark>
                <FormItem label={<span>{callTr("a_12065")} 1 <Tooltip title={callTipsTr("Assign NTP Server Address")}> <Icon type="question-circle-o"/> </Tooltip> </span> }>
                    {getFieldDecorator("ntpaddr", {
                        rules: [
                            {
                                max: 32,
                                message: callTr("a_19805") + "32"
                            }
                        ],
                        initialValue: this.props.itemValues.ntpaddr
                    })(<Input className="30"/>)}
                </FormItem>
                <FormItem label={<span>{callTr("a_12065")} 2 <Tooltip title={callTipsTr("Assign NTP Server Address")}> <Icon type="question-circle-o"/> </Tooltip> </span> }>
                    {getFieldDecorator("ntpaddr2", {
                        rules: [
                            {
                                max: 32,
                                message: callTr("a_19805") + "32"
                            }
                        ],
                        initialValue: this.props.itemValues.ntpaddr2
                    })(<Input className="30"/>)}
                </FormItem>
                {/* 设置日期 */}
                <FormItem label={<span>{callTr("a_16202")}<Tooltip title={callTipsTr("Set Date")}> <Icon type="question-circle-o"/> </Tooltip> </span> }>
                    {getFieldDecorator("date", {
                        initialValue: initialDate
                    })(<DatePicker format={this.datefmtMap[this.state.datefmt]} allowClear={false} showToday={false} onChange={this.dateChangeHandler} />)}
                </FormItem>
                {/* 设置时间 */}
                <LocaleProvider locale={en_GB}>
                <FormItem label={<span>{callTr("a_9067")}<Tooltip title={callTipsTr("Set Time")}> <Icon type="question-circle-o"/> </Tooltip> </span> }>
                    {getFieldDecorator("time", {
                        initialValue: initialTime
                    })(<TimePicker use12Hours={this.state.timefmt == '0'} format={this.timefmtMap[this.state.timefmt]} allowEmpty={false} onChange={this.timeChangeHandler}/> )}
                </FormItem>
                </LocaleProvider>
                <FormItem className="select-item" label={<span>{callTr("a_23527")} <Tooltip title={callTipsTr("Time Zone")}> <Icon type="question-circle-o"/> </Tooltip> </span> }>
                    {getFieldDecorator('timezone', {
                        rules: [],
                        initialValue: this.state.timeValue
                    })(
                        <Select>
                            {this.state.children}
                        </Select>
                    )
                    }
                </FormItem>
                <FormItem label={<span>{callTr("a_16206")} <Tooltip title={callTipsTr("DHCP Option 42 Override NTP Server")}> <Icon type="question-circle-o"/> </Tooltip> </span> }>
                    {getFieldDecorator("overridentp", {
                        rules: [],
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues.overridentp)
                    })(
                        <Checkbox className="P-144"/>
                    )}
                    <Icon title={callTr("a_4278")} className="rebooticon" type="exclamation-circle-o" />
                </FormItem>
                <FormItem label={<span>{callTr("a_16207")} <Tooltip title={callTipsTr("DHCP Option 2 to override Time Zone setting")}> <Icon type="question-circle-o"/> </Tooltip> </span> }>
                    {getFieldDecorator("overrideset", {
                        rules: [],
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues.overrideset)
                    })(
                        <Checkbox className="P-143"/>
                    )}
                    <Icon title={callTr("a_4278")} className="rebooticon" type="exclamation-circle-o" />
                </FormItem>
                <FormItem label={<span>{callTr("a_16208")} <Tooltip title={callTipsTr("Time Display Format")}> <Icon type="question-circle-o"/> </Tooltip> </span> }>
                    {getFieldDecorator('timefmt', {
                        rules: [],
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues.timefmt)
                    })(
                        <Checkbox className="P-122"/>
                    )
                    }
                </FormItem>
                <FormItem className="select-item" label={<span>{callTr("a_16209")} <Tooltip title={callTipsTr("Date Display Format")}> <Icon type="question-circle-o"/> </Tooltip> </span> }>
                    {getFieldDecorator('datefmt', {
                        rules: [],
                        initialValue: this.props.itemValues["datefmt"] ? this.props.itemValues["datefmt"] : "0"
                    })(
                        <Select className="P-102" onChange={(v) => {this.handleDatefmt(v)}}>
                            <Option value="3">{callTr("a_16210")}</Option>
                            <Option value="0">{callTr("a_16211")}</Option>
                            <Option value="1">{callTr("a_16212")}</Option>
                            <Option value="2">{callTr("a_16213")}</Option>
                        </Select>
                    )
                    }
                </FormItem>
                <FormItem>
                    <Button className="submit" type="primary" size="large" onClick={this.handleSubmit}>{callTr("a_17")}</Button>
                </FormItem>
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
    enterSave: state.enterSave,
    activeKey: state.TabactiveKey,
    curLocale: state.curLocale
})

const mapDispatchToProps = (dispatch) => {
    const actions = {
        getItemValues:Actions.getItemValues,
        setItemValues:Actions.setItemValues,
        getTimezone:Actions.getTimezone,
        saveTimeset:Actions.saveTimeset,
        setPageStatus: Actions.setPageStatus,
        getDateInfo: Actions.getDateInfo,
        setDateInfo: Actions.setDateInfo,
        setUse24Hour: Actions.setUse24Hour
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(TimezoneForm));
