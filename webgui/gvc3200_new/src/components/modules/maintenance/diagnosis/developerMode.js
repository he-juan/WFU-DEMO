import React, {Component, PropTypes} from 'react'
import Enhance from "../../../mixins/Enhance";
import { Form, Layout, Tabs, Input, Icon, Tooltip, Checkbox, Radio, Select, Button, Row, InputNumber } from "antd";
import * as Actions from '../../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const FormItem = Form.Item;
const Option = Select.Option;

class DevForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            devestate:"0"
        }
    }

    componentDidMount() {
        this.props.getdevelopmode((data)=>{
           this.setState({
               devestate: data.devestate
           })
        });
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.activeKey == this.props.tabOrder) {
            if (this.props.activeKey != nextProps.activeKey) {
                this.props.getdevelopmode((data)=>{
                    this.setState({
                        devestate: data.devestate
                    })
                });
                this.props.form.resetFields();
            }
            if (this.props.enterSave != nextProps.enterSave) {
                this.handleSubmit();
            }
        }
    }

    handleSubmit = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(!err) {
                let devemode
                devemode=(values.devestate?"1":"0")
                this.props.setdevelopmode(devemode,()=>{
                    this.props.promptMsg("SUCCESS", "a_savesuc");
                });
            }
        });
    }

    render() {
        const callTr = this.props.callTr;
        const callTipsTr = this.props.callTipsTr;
        const {getFieldDecorator} = this.props.form;

        let itemList =
            <Form hideRequiredMark>
                <FormItem label={< span > {callTr("a_4347")} < Tooltip title = {callTipsTr("Disable SIP NOTIFY Authentication")} > <Icon type="question-circle-o"/> < /Tooltip></span >}>
                    {getFieldDecorator("devestate", {
                        rules: [],
                        valuePropName: 'checked',
                        initialValue: parseInt(this.state.devestate)
                    })(
                        <Checkbox/>
                    )}
                </FormItem>
                <FormItem>
                    <Button className="submit" type="primary" size="large" onClick={this.handleSubmit}>{callTr("a_17")}</Button>
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
    enterSave: state.enterSave,
    activeKey: state.TabactiveKey
})

const mapDispatchToProps = (dispatch) => {
    const actions = {
        getdevelopmode:Actions.getdevelopmode,
        setdevelopmode:Actions.setdevelopmode,
        cb_ping:Actions.cb_ping,
        promptMsg:Actions.promptMsg,
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(DevForm));