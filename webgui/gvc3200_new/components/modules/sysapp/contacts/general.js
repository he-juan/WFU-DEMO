import React, { Component, PropTypes } from 'react'
import Enhance from '../../../mixins/Enhance'
import * as Actions from '../../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Form, Tooltip, Icon, Input, Button, Select, Radio } from "antd"
const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group

class GeneralForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            value: "",
            iceValues:[]
        }
    }

    handlePvalue = () => {
         let req_items = [];
         let getReqItem = this.props.getReqItem
         req_items.push(
             getReqItem("sortmethod","2914",""),
             getReqItem("phbkkeyfunc","1526",""),
             getReqItem("icecontactspvalue", "25675", "")
         );
         return req_items;
    }

    componentWillMount = () => {
        this.props.getItemValues(this.handlePvalue(),(values) => {
            let iceValues = values.icecontactspvalue.split(",")
            this.setState({iceValues:iceValues})

        })
    }

    connectInputValue = (e) => {
        let [input,value] = [e.target,e.target.value]
        this.setState({value:value},(e) => {
            let iceIndex = input.id.slice(-1)
            let iceValues = this.state.iceValues
            iceValues[iceIndex] = value
            this.setState({iceValues:iceValues})
        })
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.activeKey == this.props.tabOrder) {
            if (this.props.activeKey != nextProps.activeKey) {
                this.props.getItemValues(this.handlePvalue(),(values) => {
                    let iceValues = values.icecontactspvalue.split(",");
                    this.setState({iceValues:iceValues});
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
            if (!err) {
                let icecontacts = "";
                let iceValues = this.state.iceValues
                if(iceValues.length >1 && ( iceValues[iceValues.length-1] == "" || iceValues[iceValues.length-1].replace(/(^\s*)|(\s*$)/g,"") == -1 ) ) {
                    iceValues.pop()
                }
                let set = new Set(iceValues)
                if(iceValues.length != [...set].length) {
                    this.props.promptMsg('ERROR','a_numberexist');
                    return false;
                }
                iceValues = [...set];
                icecontacts = iceValues.join(",")
                icecontacts = icecontacts.replace("\"", "\\\"");
                values.icecontactspvalue = icecontacts;
                this.props.setItemValues(this.handlePvalue(), values);
            }
        });
     }

    hanleIceContacts = (e) => {
        let prevElem = e.target.previousElementSibling
        let iceValues = this.state.iceValues
        if(e.target.className.indexOf("add-btn") != -1 && prevElem.value != "" && prevElem.value.replace(/(^\s*)|(\s*$)/g,"") != -1) {
            if(iceValues[iceValues.length-1] == "") {
                iceValues.pop()
            } else {
                if(prevElem.value.indexOf(',') != -1) {
                    this.props.promptMsg('ERROR','a_nocomma');
                    return false;
                }
                for (let i=0,len=iceValues.length-1;i<len;i++) {
                    if(iceValues[i] == prevElem.value) {
                        this.props.promptMsg('ERROR','a_numberexist');
                        return false;
                    }
                }
            }
            iceValues.push("")
            this.setState({iceValues: iceValues})
        } else if(e.target.className.indexOf("del-btn") != -1) {
            let parentElem = e.target.parentNode.parentNode.parentNode
            iceValues.filter((val,idx,arr) => {
                return val == prevElem.value && arr.splice(idx,1)
            })
            for(let i=0;i<iceValues.length;i++){
                this.props.form.resetFields(['addicecontacts'+i])
            }
            this.setState({iceValues:iceValues})
        } else {
            this.props.promptMsg('ERROR','a_icecontactsempty');
            return false;
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const callTr = this.props.callTr;
        let itemList =
            <Form>
                <FormItem label={(<span>{callTr("a_sortmethod")}&nbsp;<Tooltip title={this.tips_tr("Sort Phonebook by")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('sortmethod', {
                        initialValue: this.props.itemValues['sortmethod'] ? this.props.itemValues['sortmethod'] : "0"
                    })(
                        <RadioGroup className="P-2914">
                            <Radio value="0">{callTr("a_lastname")}</Radio>
                            <Radio value="1">{callTr("a_firstname")}</Radio>
                        </RadioGroup>
                    )
                    }
                </FormItem>
                <FormItem className = "select-item" label={(<span>{callTr("a_phbkkeyfunc")}&nbsp;<Tooltip title={this.tips_tr("Phonebook Key Function")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('phbkkeyfunc', {
                        initialValue: this.props.itemValues['phbkkeyfunc'] ? this.props.itemValues['phbkkeyfunc'] : "0"
                    })(
                        <Select className="P-1526">
                            <Option value="0">{callTr("a_default")}</Option>
                            <Option value="1">{callTr("a_ldapsearch")}</Option>
                            <Option value="2">{callTr("a_localphbk")}</Option>
                            <Option value="3">{callTr("a_localgroup")}</Option>
                            <Option value="4">{callTr("a_bsphbk")}</Option>
                            <Option value="5">{callTr("a_keep")}</Option>
                        </Select>
                    )
                    }
                </FormItem>
                    {
                        (this.state.iceValues != "" || this.state.iceValues.length > 0) && this.state.iceValues.map((val,idx,arr) => {
                            return (
                                <FormItem className="icecontact" label={idx == 0 ? (<span>{callTr("a_icecontacts")}&nbsp;<Tooltip title={this.tips_tr("Emergency Call Numbers")}><Icon type="question-circle-o" /></Tooltip></span>) : (<span style={{visibility:'hidden'}}>{"紧急联系人"}</span>)}>
                                    {getFieldDecorator('addicecontacts'+idx, {
                                        rules: [{
                                            max:64,message: callTr("max_length64"),
                                        }],
                                        initialValue: val
                                        })(
                                            <Input type="text" onChange ={this.connectInputValue}/>
                                    )}&nbsp;&nbsp;
                                    <i className={idx != arr.length-1 ? 'del-btn' : 'add-btn' } onClick = {this.hanleIceContacts.bind(this)} style={{ backgroundPosition: idx != arr.length-1 ? '-21px -25px' : '-63px -25px'}}/>
                                </FormItem>
                            )
                        })
                    }
                <FormItem>
                    <Button className="submit" type="primary" size="large" onClick={this.handleSubmit}>{callTr("a_save")}</Button>
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
    activeKey: state.TabactiveKey
})
function mapDispatchToProps(dispatch) {
  var actions = {

  }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(GeneralForm));
