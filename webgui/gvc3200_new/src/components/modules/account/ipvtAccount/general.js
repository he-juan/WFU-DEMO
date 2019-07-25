import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Enhance from "../../../mixins/Enhance";
import { Form, Layout, Input, Icon, Tooltip, Checkbox, Select, Button } from "antd";
import DefaultAcctSelect from '../../pubModule/defaultAcctSelect'
import * as Actions from '../../../redux/actions'
const FormItem = Form.Item;
const Content = Layout;
const Option = Select.Option;
let req_items = new Array;

class GeneralForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultAcctSelect: false
        }
    }

    handlePvalue = () => {
        req_items = [];
        req_items.push(
            this.getReqItem("accountactive", "401", ""),
            this.getReqItem("name", "407", ""),
            this.getReqItem("siptranport", "448", ""),
            this.getReqItem("enableiptalkpro", "7059", "")
        );
        return req_items;
    }

    componentDidMount = () => {
        this.props.getItemValues(this.handlePvalue());
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

    handleSubmit = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            if((values.accountactive == '0' || values.enableiptalkpro == '0') && this.props.defaultAcct == '1' ) {
                this.setState({
                    defaultAcctSelect : true
                })
            } else {
            this.props.setItemValues(req_items, values, 1, () => {
                this.props.getItemValues([this.getReqItem("P7059", "7059", "")], (data) => {
                    this.props.getIpvtExist(data);
                })        
            });
            }
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
                <FormItem label={(<span>{callTr("a_19028")}&nbsp;<Tooltip title={this.tips_tr("Enable IPVideoTalk2")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('enableiptalkpro', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues['enableiptalkpro'])
                    })(<Checkbox className={"P-7059"}/>)
                    }
                    <Icon title={callTr("a_4278")} className="rebooticon" type="exclamation-circle-o" />
                </FormItem>
               {
                    this.props.ipvtExist == '0' ? null :
                    <div>
                        <FormItem label={(<span>{callTr("a_1119")}&nbsp;<Tooltip title={this.tips_tr("Account Active")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                            {getFieldDecorator('accountactive', {
                                    valuePropName: 'checked',
                                    initialValue: parseInt(this.props.itemValues['accountactive'])
                                })(<Checkbox className={"P-401"}/>)
                            }
                        </FormItem>

                        <FormItem label={(<span>{callTr("a_1126")}&nbsp;<Tooltip title={this.tips_tr("Display Name")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                            {getFieldDecorator('name', {
                                rules: [{
                                    max:64,message: callTr("a_19632"),
                                }],
                                initialValue: this.props.itemValues['name']
                                })(
                                <Input type="text" className={"P-407"}/>
                            )}
                        </FormItem>

                        <FormItem className = "select-item"　 label={(<span>{callTr("a_16093")}&nbsp;<Tooltip title={this.tips_tr("SIP Transport")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                            {getFieldDecorator('siptranport', {
                                    initialValue: Number(this.props.itemValues['siptranport']) ? this.props.itemValues['siptranport'] : "1"
                                    })(
                                        <Select className={"P-448"}>
                                            <Option value="1">TCP</Option>
                                            <Option value="2">TLS</Option>
                                        </Select>
                            )}
                    　　　</FormItem>
                    </div>

               }
               
              <FormItem>
                  <Button className="submit" type="primary" size="large" onClick={this.handleSubmit}>{callTr("a_17")}</Button>
              </FormItem>
              {this.state.defaultAcctSelect ? <DefaultAcctSelect currAcct='1' cb={this.handleSubmit} cancel={() => this.setState({defaultAcctSelect: false})} /> : null}
        </Form>;
        let hideItem = this.props.hideItem;
        for (var i = hideItem.length-1; i>=0; i--) {
            itemList.props.children.splice(hideItem[i], 1);
        }
        return itemList;

    }
}

const mapStateToProps = (state) => ({
    defaultAcct: state.defaultAcct,
    enterSave: state.enterSave,
    activeKey: state.TabactiveKey,
    ipvtExist: state.ipvtExist
})
const mapDispatchToProps = (dispatch) => ({

    getIpvtExist: (data) => dispatch(Actions.getIpvtExist(data)),
})
export default connect(mapStateToProps, mapDispatchToProps)(Enhance(GeneralForm));
