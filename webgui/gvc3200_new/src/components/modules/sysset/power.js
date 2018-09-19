import React, { Component } from 'react'
import Enhance from '../../mixins/Enhance'
import * as Actions from '../../redux/actions/index'
import { connect } from 'react-redux'
import { Layout, Form, Input, Button, Tooltip, Icon, Select, Modal } from 'antd'
import * as optionsFilter from "../../template/optionsFilter"

const Content = Layout;
const FormItem = Form.Item;
const Option = Select.Option;
class Power extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timeoutoptValue: '',
            sleepModeValue: '',
            dialog1: false,
            dialog1Tips: '',
            dialog2: false,
            dialog2BtnText: ['a_19324', 'a_20004', 'a_3'],
            excuteType: ''  //Reboot; Sleep; Shutdown
        }
        this.dialog1Tips = {
            'Reboot': 'a_16469',
            'Sleep': 'a_16470',
            'Shutdown': 'a_19171'
        }
        this.dialog2BtnText = {
            'Reboot': ['a_19324', 'a_20004', 'a_3'],
            'Sleep': ['a_16375', 'a_20005', 'a_3'],
            'Shutdown': ['a_20006', 'a_20007', 'a_3']
        }

    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.activeKey == this.props.tabOrder) {
            if (this.props.activeKey != nextProps.activeKey) {
                this.props.form.resetFields();
            }
            if (this.props.enterSave != nextProps.enterSave) {
                this.handleSubmit();
            }
        }
    }
    componentDidMount() {
        this.props.getTimeoutOpt((policy) => {
            this.setState({
                timeoutoptValue: policy
            });
        })
        this.props.getSleepMode((sleepmode) => {
            this.setState({
                sleepModeValue: sleepmode
            });
        })
    }

    handleOpration = (option) => {
        this.props.checkUpgradingOrCalling((type) => {
            if (type === 1) {   //未通话状态
                this.showDialog1(option);
            } else if (type === 2) {  // 在通话状态
                this.showDialog2(option);
            }
            this.setState({
                excuteType: option
            })
        })
    }

    showDialog1 = (option) => {
        this.setState({
            dialog1Tips: this.dialog1Tips[option],
            dialog1: true
        })
    }
    showDialog2 = (option) => {
        this.setState({
            dialog2BtnText: this.dialog2BtnText[option],
            dialog2: true
        })
    }
    hideDialog1 = () => {
        this.setState({
            dialog1: false
        })
    }
    hideDialog2 = () => {
        this.setState({
            dialog2: false
        })
    }
    cb_ping = () => {
        var urihead = "action=ping";
        urihead += "&time=" + new Date().getTime();
        var self = this;
        $.ajax ({
            type: 'get',
            url:'/manager',
            data:urihead,
            dataType:'text',
            success:function(data) {
                self.cb_pingres(data);
            },
            error:function(xmlHttpRequest, errorThrown) {
                self.cb_networkerror(xmlHttpRequest, errorThrown);
            }
        });
    }

    cb_pingres(data) {
        var msgs = this.res_parse_rawtext(data);
        if (msgs.headers['response'].toLowerCase() == "pong") {
            this.props.setPageStatus(2)
        } else {
            this.props.setPageStatus(0)
        }
    }
    excuteOp = (time, calling) => {
        let excuteType = this.state.excuteType
        let param;
        if (time === 'now') {
            // now的情况下 把 type参数 存入 cookie， 需要调ping 再跳转到指定页面执行
            if (excuteType === 'Reboot') {
                param = calling ? 4 : 0;
            } else if (excuteType === 'Sleep') {
                param = calling ? 6 : 2;
            } else if (excuteType === 'Shutdown') {
                param = calling ? 5 : 1
            }
            // console.log(param)
            $.cookie("reboottype", param , { path: '/', expires: 10 });
            this.cb_ping();


        } else if (time === 'later') {
            // later情况下 直接发请求
            if (excuteType === 'Reboot') {
                param = 0;
            } else if (excuteType === 'Sleep') {
                param = 2;
            } else if (excuteType === 'Shutdown') {
                param = 1;
            }
            // console.log(param)
            this.props.sysReboot(param, (data) => {
                this.props.promptMsg('SUCCESS','a_64');
                this.hideDialog2();
            });

        }
    }
    handleSubmit() {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let timeoutopt = values.timeoutopt;
                let sleepmode = values.sleepmode;
                this.props.setTimeoutOpt(timeoutopt);
                this.props.setSleepMode(sleepmode);
            }
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;

        let itemList =
            <Form className="configform" hideRequiredMark style={{ 'min-height': this.props.mainHeight }}>
                <FormItem label={<span>{this.tr('a_19321')} < Tooltip title={this.tips_tr("Timeout Operation")} > <Icon type="question-circle-o" /> </Tooltip></span>} >
                    {getFieldDecorator("timeoutopt", {
                        initialValue: this.state.timeoutoptValue
                    })(
                        <Select >
                            <Option value="0">{this.tr('a_19323')}</Option>
                            <Option value="2">{this.tr('a_19325')}</Option>
                        </Select>
                    )
                    }
                </FormItem>
                <FormItem label={<span>{this.tr('a_19322')} < Tooltip title={this.tips_tr("Enter Sleep Mode")} > <Icon type="question-circle-o" /> </Tooltip></span>} >
                    {getFieldDecorator("sleepmode", {
                        initialValue: this.state.sleepModeValue
                    })(
                        <Select >
                            <Option value="-1">{this.tr('a_42')}</Option>
                            <Option value="60000">{this.tr('a_12112')}</Option>
                            <Option value="300000">{this.tr('a_12068')}</Option>
                            <Option value="600000">{this.tr('a_12069')}</Option>
                            <Option value="900000">{this.tr('a_12070')}</Option>
                            <Option value="1800000">{this.tr('a_12071')}</Option>
                            <Option value="3600000">{this.tr('a_12113')}</Option>
                        </Select>
                    )
                    }
                </FormItem>

                <FormItem label={<span>{this.tr('a_4251')}</span>}>
                    <Button type="default" size="default" onClick={() => { this.handleOpration('Reboot') }}>{this.tr("a_4251")}</Button>
                </FormItem>

                <FormItem label={<span>{this.tr('a_16375')}</span>}>
                    <Button type="default" size="default" onClick={() => { this.handleOpration('Sleep') }}>{this.tr("a_16375")}</Button>
                </FormItem>

                <FormItem label={<span>{this.tr('a_17020')}</span>}>
                    <Button type="default" size="default" onClick={() => { this.handleOpration('Shutdown') }}>{this.tr("a_17020")}</Button>
                </FormItem>


                <FormItem>
                    <Button className="submit" type="primary" size="large" onClick={() => { this.handleSubmit() }}>{this.tr("a_17")}</Button>
                </FormItem>
            </Form>

        let hiddenOptions = optionsFilter.getHiddenOptions(0);
        for (var i = hiddenOptions.length - 1; hiddenOptions[i] != undefined && i >= 0; i--) {
            itemList.props.children.splice(hiddenOptions[i], 1);
        }
        return (
            <Content className="content-container config-container">
                <div className="subpagetitle">{this.tr("a_16617")}</div>
                {itemList}
                {/* 未通话状态 */}
                <Modal
                    visible={this.state.dialog1}
                    onCancel={this.hideDialog1}
                    footer={
                        <div>
                            <Button type="default" size="default" onClick={() => this.excuteOp('now')} >{this.tr('a_2')}</Button>
                            <Button type="primary" size="default" onClick={this.hideDialog1} style={{ height: '28px', fontSize: '12px' }}>{this.tr('a_3')}</Button>
                        </div>
                    }
                >
                    <p style={{ fontSize: '16px', color: '#55627b' }}>{this.tr(this.state.dialog1Tips)}</p>
                </Modal>
                {/* 在通话状态 */}
                <Modal
                    visible={this.state.dialog2}
                    onCancel={this.hideDialog2}
                    footer={
                        <div>
                            <Button type="default" size="default" onClick={() => { this.excuteOp('now', 'calling') }} >{this.tr(this.state.dialog2BtnText[0])}</Button>
                            <Button type="default" size="default" onClick={() => { this.excuteOp('later', 'calling') }} >{this.tr(this.state.dialog2BtnText[1])}</Button>
                            <Button type="primary" size="default" onClick={this.hideDialog2} style={{ height: '28px', fontSize: '12px' }}>{this.tr(this.state.dialog2BtnText[2])}</Button>
                        </div>
                    }
                >
                    <p style={{ fontSize: '16px', color: '#55627b' }}>{this.tr("a_20003")}...</p>
                </Modal>
            </Content>
        )
    }
}

const PowerForm = Form.create()(Enhance(Power));

const mapStateToProps = (state) => ({
    enterSave: state.enterSave,
    activeKey: state.TabactiveKey,
    mainHeight: state.mainHeight,
})

const mapDispatchToProps = (dispatch) => ({
    getTimeoutOpt: (cb) => dispatch(Actions.getTimeoutOpt(cb)),
    getSleepMode: (cb) => dispatch(Actions.getSleepMode(cb)),
    setTimeoutOpt: (value) => dispatch(Actions.setTimeoutOpt(value)),
    setSleepMode: (value) => dispatch(Actions.setSleepMode(value)),
    checkUpgradingOrCalling: (cb) => dispatch(Actions.checkUpgradingOrCalling(cb)),
    sysReboot: (type, cb) => dispatch(Actions.sysReboot(type, cb)),
    setPageStatus: (i) => dispatch(Actions.setPageStatus(i)),
    promptMsg: (type, label) => dispatch(Actions.promptMsg(type,label))
})

export default connect(mapStateToProps, mapDispatchToProps)(PowerForm)