import React, { Component, PropTypes } from 'react'
import Enhance from "../../mixins/Enhance";
import {Layout, Tabs, Form, Tooltip, Icon, Button, Select, Checkbox, Input} from "antd";
import * as Actions from '../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const Content = Layout;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;

const req_items = [
                    {"name":"avspipmode", "pvalue":"921", "value":""},
                    {"name":"viddecodefs", "pvalue":"22008", "value":""},
                    {"name": "autovideo", "pvalue": "25023", "value": ""}
                ];

class VideoForm extends Component {
    constructor(props){
        super(props);
    }

    componentWillReceiveProps = (nextProps) => {
        if(this.props.enterSave != nextProps.enterSave){
            this.handleSubmit();
        }
    }

    handleSubmit = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(!err){
                this.props.setItemValues(req_items, values, 1);
            }
        });
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const callTr = this.props.callTr;
        const callTipsTr = this.props.callTipsTr;
        const itemvalue = this.props.itemValues;

        return(
            <Form className="configform" hideRequiredMark style={{minHeight:this.props.mainHeight}}>
                 <FormItem label={<span>{callTr("a_16151")}<Tooltip title={callTipsTr("Start Video Automatically")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("autovideo", {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemvalue['autovideo'])
                    })(
                        <Checkbox className="P-25023"/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_19365")}<Tooltip placement="bottom" title={callTipsTr("Video Display Mode")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("avspipmode", {
                        initialValue: itemvalue['avspipmode'] ? itemvalue['avspipmode'] : "1"
                    })(
                        <Select className="P-921">
							<Option value="0">{callTr("a_19366")}</Option>
                            <Option value="1">{callTr("a_19367")}</Option>
                            <Option value="2">{callTr("a_19368")}</Option>
						</Select>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_16276")}<Tooltip title={callTipsTr("Enable Frame Skipping in Video Decoder")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("viddecodefs", {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemvalue['viddecodefs'])
                    })(
                        <Checkbox className="P-22008"/>
                    )}
                </FormItem>
                <FormItem>
                    <Button className="submit" type="primary" size="large" onClick={this.handleSubmit}>{callTr("a_17")}</Button>
                </FormItem>
            </Form>
        );
    }
}

const VideoSettingForm = Form.create()(VideoForm);

class Video extends Component {
    constructor(props){
        super(props);
    }

    componentDidMount = () => {
        this.props.getItemValues(req_items);
    }

    render(){
        if(!this.props.itemValues){
            return null;
        }

        return (
            <Content className="content-container config-container">
                <div className="subpagetitle">{this.tr("a_16009")}</div>
                <VideoSettingForm {...this.props} callTr={this.tr} callTipsTr={this.tips_tr} itemValues={this.props.itemValues} />
            </Content>
        );
    }
}

const mapStateToProps = (state) => ({
    curLocale: state.curLocale,
    itemValues: state.itemValues,
    mainHeight: state.mainHeight,
    enterSave: state.enterSave
})

function mapDispatchToProps(dispatch) {
  var actions = {
      getItemValues:Actions.getItemValues,
      setItemValues:Actions.setItemValues
  }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Video));
