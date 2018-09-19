import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Enhance from "../../../mixins/Enhance";
import { Form, Layout, Icon, Tooltip, Select, Button, Transfer } from "antd";
const FormItem = Form.Item;
const Content = Layout;
const Option = Select.Option;
let req_items = new Array;


class CodecForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            videoTargetKeys: []
        }
        
        this.videoDataSource = [
            {
                key: '99',
                title: 'H264',
            },
            {
                key: '114',
                title: 'H265',
            }
        ]
    }

    handlePvalue = () => {
        req_items = [];
        req_items.push(
            this.getReqItem("P464", "464", ""),
            this.getReqItem("P465", "465", ""),
            
        );
        return req_items;
    }

    componentDidMount = () => {
        this.props.getItemValues(this.handlePvalue(), (values) => {
            this.getVideoData(values);
        });
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.activeKey == this.props.tabOrder) {
            // selected tab changed
            if (this.props.activeKey != nextProps.activeKey) {
                this.props.getItemValues(this.handlePvalue());
                this.props.form.resetFields();
            }

            // enter key pressed
            if (this.props.enterSave != nextProps.enterSave) {
                this.handleSubmit();
            }
        }
    }
    getVideoData(values){
        let keys = ["P464", "P465"];
        let videoTargetKeys = [];
        keys.forEach((i) => {
            if(values[i] != '') {
                videoTargetKeys.push(values[i])
            }
        })
        this.setState({
            videoTargetKeys
        })
    }
    handleChange = (nextTargetKeys) => {
        this.setState({videoTargetKeys: nextTargetKeys});
    }
    saveVideo = () => {
        const keys = ['P464', 'P465'];
        const values = this.state.videoTargetKeys;
        let videoObj = {};
        keys.forEach((item, i) => {
            videoObj[item] = values[i] ? values[i] : ''
        })
        return videoObj;
    }
    handleSubmit = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
               Object.assign(values, this.saveVideo())
               this.props.setItemValues(req_items, values,1);
          }
        });
     }

    render() {
        const { getFieldDecorator } = this.props.form;
        const callTr = this.props.callTr;
        if(this.isEmptyObject(this.props.itemValues)) {
            return null;
        }

        let itemList =
           <Form>
                <FormItem label={(<span>{callTr("a_16115")}&nbsp;<Tooltip title={this.tips_tr("Preferred Video Coder")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    <Transfer dataSource={this.videoDataSource} targetKeys={this.state.videoTargetKeys} render={item => item.title} onChange={this.handleChange} sorter={true} titles={[callTr("a_4877"), callTr("a_407")]} listStyle={{ width: 135, height: 206, }}/>
                </FormItem>
                <FormItem>
                    <Button className="submit" type="primary" size="large" onClick={this.handleSubmit}>{callTr("a_17")}</Button>
                </FormItem>
            </Form>;

        let hideItem = this.props.hideItem;
        for (var i = hideItem.length-1; i>=0; i--) {
            itemList.props.children.splice(hideItem[i], 1);
        }
        return itemList;
    }
}

const mapStateToProps = (state) => ({
    enterSave: state.enterSave,
    activeKey: state.TabactiveKey
})

export default connect(mapStateToProps)(Enhance(CodecForm));
