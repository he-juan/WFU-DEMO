import React, {Component, PropTypes} from 'react'
import Enhance from "../../../mixins/Enhance";
import { Form, Input, Icon, Tooltip, Checkbox, Radio, Select, Button, Row, InputNumber } from "antd";
import * as Actions from '../../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
let req_items;

var city_names = [ "a_gmt0", "a_Midway","a_Honolulu","a_Anchorage",
"a_Los_Angeles","a_Tijuana","a_Phoenix","a_Chihuahua","a_Denver",
"a_Costa_Rica", "a_Chicago","a_Mexico_City","a_Regina","a_Bogota",
"a_New_York","a_Caracas","a_Barbados","a_Halifax","a_Manaus",
"a_Santiago","a_St_Johns", "a_Recife", "a_Sao_Paulo", "a_Buenos_Aires",
"a_Godthab","a_Montevideo","a_South_Georgia","a_Azores","a_Cape_Verde",
"a_Casablanca", "a_London", "a_Amsterdam",
"a_Belgrade", "a_Brussels", "a_Madrid", "a_Sarajevo", "a_Windhoek", "a_Brazzaville",
"a_Amman", "a_Athens", "a_Istanbul", "a_Beirut", "a_Cairo", "a_Helsinki",
"a_Jerusalem", "a_Minsk", "a_Harare","a_Baghdad",
"a_Moscow", "a_Kuwait", "a_Nairobi", "a_Tehran", "a_Baku",
"a_Tbilisi", "a_Yerevan", "a_Dubai", "a_Kabul", "a_Karachi",
"a_Oral", "a_Yekaterinburg", "a_Calcutta", "a_Colombo", "a_Katmandu",
"a_Almaty", "a_Rangoon","a_Krasnoyarsk","a_Bangkok", "a_Jakarta",
"a_Shanghai", "a_Hong_Kong", "a_Irkutsk",
"a_Kuala_Lumpur", "a_Perth", "a_Taipei", "a_Seoul", "a_Tokyo",
"a_Yakutsk", "a_Adelaide", "a_Darwin", "a_Brisbane", "a_Hobart",
"a_Sydney","a_Vladivostok","a_Guam","a_Magadan", "a_Noumea", "a_Majuro", "a_Auckland",
"a_Fiji","a_Tongatapu"];

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

        this.state = {}

        this.handleNvram();
    }

    handleNvram = () => {
         req_items = [];
         req_items.push(
             this.getReqItem("ntpserver", "30", ""),
             this.getReqItem("overridentp", "144", ""),
             this.getReqItem("overrideset", "143", ""),
             //this.getReqItem("timezone", "64", ""),
             this.getReqItem("timefmt", "122", ""),
             this.getReqItem("datefmt", "102", "")
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
        this.props.getItemValues(req_items);
        this.props.getTimezone((values) => {
            this.getTimezone_suc(values);
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
        if(this.props.curLocale != nextProps.curLocale) {
            this.props.getTimezone((values) => {
                this.getTimezone_suc(values);
            });
        }
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

        let itemList =
            <Form hideRequiredMark>
                <FormItem label={<span>{callTr("a_ntpserver")} <Tooltip title={callTipsTr("Assign NTP Server Address")}> <Icon type="question-circle-o"/> </Tooltip> </span> }>
                    {getFieldDecorator("ntpserver", {
                        rules: [
                            {
                                max: 32,
                                message: callTr("a_lengthlimit") + "32"
                            }
                        ],
                        initialValue: this.props.itemValues.ntpserver
                    })(<Input className="30"/>)}
                </FormItem>
                <FormItem label={<span>{callTr("a_dhcpoption")} <Tooltip title={callTipsTr("DHCP Option 42 Override NTP Server")}> <Icon type="question-circle-o"/> </Tooltip> </span> }>
                    {getFieldDecorator("overridentp", {
                        rules: [],
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues.overridentp)
                    })(
                        <Checkbox className="P-144"/>
                    )}
                    <Icon title={callTr("a_rebooteffect")} className="rebooticon" type="exclamation-circle-o" />
                </FormItem>
                <FormItem label={<span>{callTr("a_allowdhcpset")} <Tooltip title={callTipsTr("DHCP Option 2 to override Time Zone setting")}> <Icon type="question-circle-o"/> </Tooltip> </span> }>
                    {getFieldDecorator("overrideset", {
                        rules: [],
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues.overrideset)
                    })(
                        <Checkbox className="P-143"/>
                    )}
                    <Icon title={callTr("a_rebooteffect")} className="rebooticon" type="exclamation-circle-o" />
                </FormItem>
                <FormItem className="select-item" label={<span>{callTr("a_timezone")} <Tooltip title={callTipsTr("Time Zone")}> <Icon type="question-circle-o"/> </Tooltip> </span> }>
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
                <FormItem label={<span>{callTr("a_timefmt")} <Tooltip title={callTipsTr("Time Display Format")}> <Icon type="question-circle-o"/> </Tooltip> </span> }>
                    {getFieldDecorator('timefmt', {
                        rules: [],
                        initialValue: this.props.itemValues.timefmt
                    })(
                        <RadioGroup className="P-122">
                            <Radio value="0">{callTr("a_12hour")}</Radio>
                            <Radio value="1">{callTr("a_24hour")}</Radio>
                        </RadioGroup>
                    )
                    }
                </FormItem>
                <FormItem className="select-item" label={<span>{callTr("a_datefmt")} <Tooltip title={callTipsTr("Date Display Format")}> <Icon type="question-circle-o"/> </Tooltip> </span> }>
                    {getFieldDecorator('datefmt', {
                        rules: [],
                        initialValue: this.props.itemValues["datefmt"] ? this.props.itemValues["datefmt"] : "0"
                    })(
                        <Select className="P-102">
                            <Option value="3">{callTr("a_normalymd")}</Option>
                            <Option value="0">{callTr("a_ymd")}</Option>
                            <Option value="1">{callTr("a_mdy")}</Option>
                            <Option value="2">{callTr("a_dmy")}</Option>
                        </Select>
                    )
                    }
                </FormItem>
                <FormItem>
                    <Button className="submit" type="primary" size="large" onClick={this.handleSubmit}>{callTr("a_save")}</Button>
                </FormItem>
            </Form>;

        let hideItem = this.props.hideItem;
        for (var i = hideItem.length-1; hideItem[i] != undefined && i>=0; i--) {
            itemList.props.children.splice(hideItem[i], 1);
        }

        return itemList;
    }
}

const mapStateToProps = (state) => ({
    itemValues: state.itemValues,
    timezoneValues: state.timezoneValues,
    enterSave: state.enterSave,
    activeKey: state.TabactiveKey
})

const mapDispatchToProps = (dispatch) => {
    const actions = {
        getItemValues:Actions.getItemValues,
        setItemValues:Actions.setItemValues,
        getTimezone:Actions.getTimezone,
        saveTimeset:Actions.saveTimeset,
        setPageStatus: Actions.setPageStatus,
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(TimezoneForm));
