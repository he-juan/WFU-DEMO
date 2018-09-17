import React, {Component, PropTypes} from 'react'
import Enhance from "../../../mixins/Enhance";
import { Form, Layout, Tabs, Input, Icon, Tooltip, Select, Button, Row } from "antd";
import * as Actions from '../../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const FormItem = Form.Item;
const Content = Layout;
const Option = Select.Option;

class LogactForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            logcatFile: {}
        }
    }

    show_logfile = () => {
        this.props.getLogcatfile();
    }

    onClickClearLogcat = () => {
        this.props.getClearLogcat();
    }

    onClickGetlog = () => {
        this.props.form.validateFieldsAndScroll({force: true}, (err, values) => {
            this.props.getLogcatDown(values,() => {
                setTimeout(this.show_logfile(), 200);
            });
        })
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.activeKey == this.props.tabOrder) {
            if (this.props.activeKey != nextProps.activeKey) {
                this.props.form.resetFields();
            }
        }
    }

    render() {
        const callTr = this.props.callTr;
        const callTipsTr = this.props.callTipsTr;
        const {getFieldDecorator} = this.props.form;

        let logcatFile = this.props.logcatFile;
        if (this.isEmptyObject(logcatFile)) {
            logcatFile = "";
        }

        let itemList =
            <Form hideRequiredMark>
                <FormItem label={( <span> {callTr("a_16353")} <Tooltip title={callTipsTr("Clear Log")}> <Icon type="question-circle-o"/> </Tooltip> </span> )} hasFeedback>
                    <Button style = {{"border":"1px solid #3d77ff", "height":"30px","width":"80px"}} onClick={this.onClickClearLogcat}>{callTr("a_clear")}</Button>
                </FormItem>
                <FormItem label={( <span> {callTr("a_16354")} <Tooltip title={callTipsTr("Log Tag")}> <Icon type="question-circle-o"/> </Tooltip> </span> )}>
                    {getFieldDecorator('logtag', {
                        rules: [
                            {
                                max:32,
                                message: callTr("a_lengthlimit") + "32",
                            }
                        ]
                    })(<Input/>)
                    }
                </FormItem>
                <FormItem className="select-item" label={( <span> {callTr("a_16355")} <Tooltip title={callTipsTr("Log Priority")}> <Icon type="question-circle-o"/> </Tooltip> </span> )}>
                    {getFieldDecorator('logpriority', {
                        rules: [],
                        initialValue: 'V'
                    })(
                        <Select>
                            <Option value="V">Verbose</Option>
                            <Option value="D">Debug</Option>
                            <Option value="I">Info</Option>
                            <Option value="W">Warning</Option>
                            <Option value="E">Error</Option>
                            <Option value="F">Fatal</Option>
                            <Option value="S">Silent (supress all output)</Option>
                        </Select>
                    )
                    }
                </FormItem>
                <FormItem>
                    <Button className="button" type="primary" size="large" onClick={this.onClickGetlog.bind(this)} style={{margin: "15px 0 0 133%"}}>
                        {this.tr("a_16356")}
                    </Button>
                </FormItem>
                <Row id='mainlogcat'>
                    <div style={logcatFile == "" ? {display:'block'} : {display:'none'}} className = "tooltips">
                        <div></div>
                        <p>{this.tr("no_data")}</p>
                    </div>
                    <pre style={{wordWrap: "break-word", whiteSpace: "pre-wrap"}}>{logcatFile}</pre>
                </Row>
            </Form>

        let hideItem = this.props.hideItem;
        for (var i = hideItem.length-1; hideItem[i] != undefined && i>=0; i--) {
            itemList.props.children.splice(hideItem[i], 1);
        }

        return itemList;
    }
}

const mapStateToProps = (state) => ({
    logcatFile:state.logcatFile,
    activeKey: state.TabactiveKey
})

const mapDispatchToProps = (dispatch) => {
  const actions = {
    getLogcatDown:Actions.getLogcatDown,
    getLogcatfile:Actions.getLogcatfile,
    getClearLogcat:Actions.getClearLogcat
  }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(LogactForm));
