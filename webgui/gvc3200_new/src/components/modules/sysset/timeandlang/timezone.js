import React, {Component, PropTypes} from 'react'
import Enhance from "../../../mixins/Enhance";
import { Form, Input, Icon, Tooltip, Checkbox, Radio, Select, Button, DatePicker, TimePicker, LocaleProvider } from "antd";
import * as Actions from '../../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'

import en_US from 'antd/lib/locale-provider/en_US'


const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
let req_items;
var city_names = [ "a_16489", "a_16491","a_16492","a_16493",
"a_16494","a_16495","a_16496","a_16497","a_16498",
"a_16499", "a_16500","a_16501","a_16502","a_16503",
"a_16504","a_16505","a_16506","a_16507","a_16508",
"a_16509","a_16510", "a_16711", "a_16511", "a_16512",
"a_16513","a_16514","a_16515","a_16516","a_16517",
"a_16518", "a_London", "a_Amsterdam",
"a_16521", "a_16522", "a_16712", "a_16523", "a_16524", "a_16525",
"a_Amman", "a_Athens", "a_16713", "a_Beirut", "a_16529", "a_16530",
"a_16531", "a_16532", "a_16533","a_16534",
"a_16535", "a_16536", "a_16537", "a_16538", "a_16539",
"a_16540", "a_16541", "a_16542", "a_16543", "a_Karachi",
"a_16545", "a_16546", "a_16547", "a_16548", "a_16549",
"a_16550", "a_16551","a_16552","a_16553", "a_16714",
"a_16554", "a_16555", "a_16556",
"a_16557", "a_16558", "a_16559", "a_16560", "a_Tokyo",
"a_16562", "a_16563", "a_16564", "a_16565", "a_16566",
"a_Sydney","a_16568","a_16569","a_16570", "a_Noumea", "a_Majuro", "a_16571",
"a_16572","a_16573"];

const childrenValue = ["GMT","Pacific/Midway","Pacific/Honolulu","America/Anchorage","America/Los_Angeles","America/Tijuana",
        "America/Phoenix","America/Chihuahua","America/Denver","America/Costa_Rica","America/Chicago","America/Mexico_City",
        "America/Regina","America/Bogota","America/New_York","America/Caracas","America/Barbados","America/Halifax",
        "America/Manaus","America/Santiago","America/St_Johns","America/Recife","America/Sao_Paulo","America/Argentina/Buenos_Aires",
        "America/Godthab","America/Montevideo","Atlantic/South_Georgia","Atlantic/Azores","Atlantic/Cape_Verde","Africa/Casablanca",
        "Europe/London","Europe/Amsterdam","Europe/Belgrade","Europe/Brussels","Europe/Madrid","Europe/Sarajevo","Africa/Windhoek",
        "Africa/Brazzaville","Asia/Amman","Europe/Athens","Europe/Istanbul","Asia/Beirut","Africa/Cairo","Europe/Helsinki","Asia/Jerusalem",
        "Europe/Minsk","Africa/Harare","Asia/Baghdad","Europe/Moscow","Asia/Kuwait","Africa/Nairobi","Asia/Tehran","Asia/Baku","Asia/Tbilisi",
        "Asia/Yerevan","Asia/Dubai","Asia/Kabul","Asia/Karachi","Asia/Oral","Asia/Yekaterinburg","Asia/Calcutta","Asia/Colombo","Asia/Katmandu",
        "Asia/Almaty","Asia/Rangoon","Asia/Krasnoyarsk","Asia/Bangkok","Asia/Jakarta","Asia/Shanghai","Asia/Hong_Kong","Asia/Irkutsk","Asia/Kuala_Lumpur",
        "Australia/Perth","Asia/Taipei","Asia/Seoul","Asia/Tokyo","Asia/Yakutsk","Australia/Adelaide","Australia/Darwin",
        "Australia/Brisbane","Australia/Hobart","Australia/Sydney","Asia/Vladivostok","Pacific/Guam","Asia/Magadan","Pacific/Noumea",
        "Pacific/Majuro","Pacific/Auckland","Pacific/Fiji","Pacific/Tongatapu"
    ];

var newgmts = new Array;
let newcitygmts = new Array();
var gmtvalues = new Array();
var newcity_names = new Array();
var timezone;
let children;

class TimezoneForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            initDate: '',
            initTime: '',
            datefmt: '3',
            timefmt: '1'
        }

        this.datefmtMap = {
            '3': 'YYYY/M/D',
            '0': 'YYYY/M/D',
            '1': 'M/D/YYYY',
            '2': 'D/M/YYYY'
        }
        this.timefmtMap = {
            '0':'hh:mm a',
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
             //this.getReqItem("timezone", "64", ""),
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
        if( data.substring(0, 1) == "{" ) {
            newcitygmts = [];
            gmtvalues = [];
            newcity_names = [];
            var tObj = JSON.parse(data);
            timezone = tObj.timezone;
    		var citygmts = tObj.citygmt;
            newcitygmts.push(citygmts[0]);
    		newcity_names.push(this.tr(city_names[0]));
            gmtvalues.push(childrenValue[0])

            var preid, curid, newpos;
    		preid = parseInt(citygmts[0].substring(3).replace(":", ""));
    		newgmts.push(preid);
            var insertnum = 0;
            for(var k = 1; citygmts[k] != undefined; k++) {
                curid = parseInt(citygmts[k].substring(3).replace(":", ""));
                newpos = this.findPos(curid);
                if(newpos == -1) {
                    newgmts.push(curid);
                    newcitygmts.push(citygmts[k]);
                    newcity_names.push(this.tr(city_names[k]));
                    gmtvalues.push(childrenValue[k]);
                } else {
                    insertnum ++;
                    newgmts = this.insert(newgmts, newpos, curid);
                    newcitygmts = this.insert(newcitygmts, newpos, citygmts[k]);
                    newcity_names = this.insert(newcity_names, newpos, this.tr(city_names[k]));
                    gmtvalues = this.insert(gmtvalues, newpos, childrenValue[k]);
                }
            }
            children = [];
            for (let i = 0; i < newcity_names.length; i++) {
                children.push(<Option value = {gmtvalues[i]}>{this.htmlEncode(newcitygmts[i]) + "(" + this.htmlEncode(newcity_names[i]) + ")"}</Option>);
            }
            this.props.form.setFieldsValue({
                timezone: timezone
            });
        } else {
            //this.props.setPageStatus(0);
        }
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
        this.props.getTimezone((values) => {
            this.getTimezone_suc(values);
        });
        this.getDateInfo();
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
        if(this.props.curLocale != nextProps.curLocale) {
            this.props.getTimezone((values) => {
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
          this.props.setItemValues(req_items, values,2);
          this.props.saveTimeset(values.timezone);
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
        // 国际化临时处理
        let locale;
        if (this.props.curLocale !== 'zh') {
            locale = en_US;
            moment.locale('en');
        } else {
            locale = null;
            moment.locale('zh-cn');
        }
        let itemList =
            <LocaleProvider locale={locale}>
            <Form hideRequiredMark>
                <FormItem label={<span>{callTr("a_12065")} 1 <Tooltip title={callTipsTr("Assign NTP Server Address")}> <Icon type="question-circle-o"/> </Tooltip> </span> }>
                    {getFieldDecorator("ntpaddr", {
                        rules: [
                            {
                                max: 32,
                                message: callTr("a_lengthlimit") + "32"
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
                                message: callTr("a_lengthlimit") + "32"
                            }
                        ],
                        initialValue: this.props.itemValues.ntpaddr2
                    })(<Input className="30"/>)}
                </FormItem>
                {/* 设置日期 */}
                <FormItem label={<span>{callTr("a_16202")}<Tooltip title={callTipsTr("??")}> <Icon type="question-circle-o"/> </Tooltip> </span> }>
                    {getFieldDecorator("date", {
                        initialValue: initialDate
                    })(<DatePicker format={this.datefmtMap[this.state.datefmt]} allowClear={false} showToday={false} onChange={this.dateChangeHandler} />)}
                </FormItem>
                {/* 设置时间 */}
                <FormItem label={<span>{callTr("a_9067")}<Tooltip title={callTipsTr("??")}> <Icon type="question-circle-o"/> </Tooltip> </span> }>
                    {getFieldDecorator("time", {
                        initialValue: initialTime
                    })(<TimePicker use12Hours={this.state.timefmt == '0'} format={this.timefmtMap[this.state.timefmt]} allowEmpty={false} onChange={this.timeChangeHandler}/> )}
                </FormItem>

                <FormItem className="select-item" label={<span>{callTr("a_23527")} <Tooltip title={callTipsTr("Time Zone")}> <Icon type="question-circle-o"/> </Tooltip> </span> }>
                    {getFieldDecorator('timezone', {
                        rules: [],
                        initialValue: timezone
                    })(
                        <Select  onChange={ this.onChangeTimezone.bind(this) }>
                            {children}
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
                    <Icon title={callTr("a_rebooteffect")} className="rebooticon" type="exclamation-circle-o" />
                </FormItem>
                <FormItem label={<span>{callTr("a_16207")} <Tooltip title={callTipsTr("DHCP Option 2 to override Time Zone setting")}> <Icon type="question-circle-o"/> </Tooltip> </span> }>
                    {getFieldDecorator("overrideset", {
                        rules: [],
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues.overrideset)
                    })(
                        <Checkbox className="P-143"/>
                    )}
                    <Icon title={callTr("a_rebooteffect")} className="rebooticon" type="exclamation-circle-o" />
                </FormItem>
                <FormItem label={<span>{callTr("a_timefmt")} <Tooltip title={callTipsTr("Time Display Format")}> <Icon type="question-circle-o"/> </Tooltip> </span> }>
                    {getFieldDecorator('timefmt', {
                        rules: [],
                        initialValue: this.props.itemValues.timefmt
                    })(
                        <RadioGroup className="P-122" onChange={(e) => {this.handleTimefmt(e)}}>
                            <Radio value="0">{callTr("a_12hour")}</Radio>
                            <Radio value="1">{callTr("a_24hour")}</Radio>
                        </RadioGroup>
                    )
                    }
                </FormItem>
                <FormItem className="select-item" label={<span>{callTr("a_16209")} <Tooltip title={callTipsTr("Date Display Format")}> <Icon type="question-circle-o"/> </Tooltip> </span> }>
                    {getFieldDecorator('datefmt', {
                        rules: [],
                        initialValue: this.props.itemValues["datefmt"] ? this.props.itemValues["datefmt"] : "0"
                    })(
                        <Select className="P-102" onChange={(v) => {this.handleDatefmt(v)}}>
                            <Option value="3">{callTr("a_normalymd")}</Option>
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
            </LocaleProvider>;

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
        setDateInfo: Actions.setDateInfo
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(TimezoneForm));
